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
    const { username, password } = await req.json()

    // Validate credentials
    if (username !== 'Admin' || password !== 'ISE1234') {
      return new Response(
        JSON.stringify({ error: 'Invalid setup credentials' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { autoRefreshToken: false, persistSession: false } }
    )

    const adminEmail = 'admin@emotion-assessment.app'

    // Check if admin user already exists
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers()
    const existingAdmin = existingUsers?.users?.find(u => u.email === adminEmail)

    let userId: string

    if (existingAdmin) {
      // Update password if user exists
      const { data, error } = await supabaseAdmin.auth.admin.updateUserById(
        existingAdmin.id,
        { password: password }
      )
      if (error) throw error
      userId = existingAdmin.id
    } else {
      // Create new admin user
      const { data, error } = await supabaseAdmin.auth.admin.createUser({
        email: adminEmail,
        password: password,
        email_confirm: true,
      })
      if (error) throw error
      userId = data.user.id
    }

    // Check if user already has admin role
    const { data: existingRole } = await supabaseAdmin
      .from('user_roles')
      .select('id')
      .eq('user_id', userId)
      .eq('role', 'admin')
      .maybeSingle()

    if (!existingRole) {
      // Add admin role
      const { error: roleError } = await supabaseAdmin
        .from('user_roles')
        .insert({ user_id: userId, role: 'admin' })

      if (roleError) throw roleError
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Admin account configured successfully' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
