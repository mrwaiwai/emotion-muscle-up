import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const jsonResponse = (body: Record<string, unknown>, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })

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

    if (!supabaseUrl || !serviceRoleKey || !anonKey) {
      return jsonResponse({ error: 'Supabase function configuration is missing' }, 500)
    }

    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
      auth: { autoRefreshToken: false, persistSession: false },
    })
    const adminClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    })

    const { data: userData, error: userError } = await userClient.auth.getUser(token)
    if (userError || !userData.user) {
      return jsonResponse({ error: 'Not authenticated' }, 401)
    }

    const { data: role } = await adminClient
      .from('user_roles')
      .select('id')
      .eq('user_id', userData.user.id)
      .eq('role', 'admin')
      .maybeSingle()

    if (!role) {
      return jsonResponse({ error: 'Admin access required' }, 403)
    }

    const { teacherUserId } = await req.json()
    const normalizedTeacherUserId = String(teacherUserId ?? '').trim()

    if (!normalizedTeacherUserId) {
      return jsonResponse({ error: 'Missing teacher account id' }, 400)
    }

    if (normalizedTeacherUserId === userData.user.id) {
      return jsonResponse({ error: 'Cannot delete your own account here' }, 400)
    }

    const { data: teacherProfile, error: profileError } = await adminClient
      .from('teacher_profiles')
      .select('id, display_name, email')
      .eq('user_id', normalizedTeacherUserId)
      .maybeSingle()

    if (profileError) throw profileError
    if (!teacherProfile) {
      return jsonResponse({ error: 'Teacher account not found' }, 404)
    }

    const { error: deleteError } = await adminClient.auth.admin.deleteUser(normalizedTeacherUserId)
    if (deleteError) throw deleteError

    return jsonResponse({
      success: true,
      teacher: {
        displayName: teacherProfile.display_name,
        email: teacherProfile.email,
      },
    })
  } catch (error) {
    return jsonResponse({ error: error.message }, 500)
  }
})
