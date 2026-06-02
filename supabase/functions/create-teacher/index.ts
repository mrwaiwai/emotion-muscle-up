import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const authHeader = req.headers.get('Authorization') ?? ''
    const token = authHeader.replace('Bearer ', '')

    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? ''

    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
      auth: { autoRefreshToken: false, persistSession: false },
    })
    const adminClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    })

    const { data: userData, error: userError } = await userClient.auth.getUser(token)
    if (userError || !userData.user) {
      return new Response(
        JSON.stringify({ error: 'Not authenticated' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { data: role } = await adminClient
      .from('user_roles')
      .select('id')
      .eq('user_id', userData.user.id)
      .eq('role', 'admin')
      .maybeSingle()

    if (!role) {
      return new Response(
        JSON.stringify({ error: 'Admin access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { email, password, displayName, schoolName } = await req.json()
    const normalizedEmail = String(email ?? '').trim().toLowerCase()
    const normalizedSchoolName = String(schoolName ?? '').trim()
    const normalizedDisplayName = String(displayName ?? '').trim()
    const normalizedPassword = String(password ?? '')

    if (!normalizedEmail || !normalizedPassword || !normalizedDisplayName || !normalizedSchoolName) {
      return new Response(
        JSON.stringify({ error: 'Missing teacher account fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { data: school, error: schoolError } = await adminClient
      .from('schools')
      .upsert({ name: normalizedSchoolName }, { onConflict: 'name' })
      .select('id, name')
      .single()

    if (schoolError) throw schoolError

    const { data: existingUsers, error: listError } = await adminClient.auth.admin.listUsers()
    if (listError) throw listError

    const existingTeacher = existingUsers.users.find((user) => user.email === normalizedEmail)
    let userId: string

    if (existingTeacher) {
      const { error: updateError } = await adminClient.auth.admin.updateUserById(
        existingTeacher.id,
        {
          email: normalizedEmail,
          password: normalizedPassword,
          email_confirm: true,
        }
      )
      if (updateError) throw updateError
      userId = existingTeacher.id
    } else {
      const { data: createdUser, error: createError } = await adminClient.auth.admin.createUser({
        email: normalizedEmail,
        password: normalizedPassword,
        email_confirm: true,
      })
      if (createError) throw createError
      userId = createdUser.user.id
    }

    const { error: profileError } = await adminClient
      .from('teacher_profiles')
      .upsert(
        {
          user_id: userId,
          school_id: school.id,
          display_name: normalizedDisplayName,
          email: normalizedEmail,
        },
        { onConflict: 'user_id' }
      )

    if (profileError) throw profileError

    return new Response(
      JSON.stringify({
        success: true,
        teacher: {
          email: normalizedEmail,
          displayName: normalizedDisplayName,
          schoolName: school.name,
        },
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
