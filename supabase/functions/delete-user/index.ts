import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req: Request) => {
  // Обработка preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('Function started')
    console.log('Method:', req.method)
    
    const headers = {
      ...corsHeaders,
      'Content-Type': 'application/json',
    }

    // Проверяем метод
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { status: 405, headers }
      )
    }

    // Получаем и логируем заголовки
    console.log('All headers:', Object.fromEntries(req.headers.entries()))
    
    const authHeader = req.headers.get('Authorization')
    console.log('Auth header:', authHeader)

    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers }
      )
    }

    const jwt = authHeader.replace('Bearer ', '')
    console.log('JWT length:', jwt.length)

    // Получаем переменные окружения
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    console.log('Supabase URL exists:', !!supabaseUrl)
    console.log('Service role key exists:', !!supabaseServiceRoleKey)

    if (!supabaseUrl || !supabaseServiceRoleKey) {
      throw new Error('Missing environment variables')
    }

    // Создаем admin клиент
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    })

    // Проверяем пользователя
    console.log('Verifying user with JWT...')
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(jwt)

    if (userError) {
      console.error('User verification error:', userError)
      return new Response(
        JSON.stringify({ error: 'Invalid token', details: userError.message }),
        { status: 401, headers }
      )
    }

    if (!user) {
      console.error('User not found')
      return new Response(
        JSON.stringify({ error: 'User not found' }),
        { status: 401, headers }
      )
    }

    console.log('User verified:', user.id, user.email)

    // Удаляем пользователя
    console.log('Deleting user...')
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(user.id)

    if (deleteError) {
      console.error('Delete error:', deleteError)
      throw deleteError
    }

    console.log('User deleted successfully')

    return new Response(
      JSON.stringify({ success: true, userId: user.id }),
      { status: 200, headers }
    )
  } catch (error) {
    console.error('Function error:', error)
    return new Response(
      JSON.stringify({ error: error.message || 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})