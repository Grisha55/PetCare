// supabase/functions/delete-user/index.ts
// @ts-expect-error - Deno specific import
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
// @ts-expect-error - Deno specific import
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

serve(async (req: Request) => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    console.log('1️⃣ Function started');
    
    // Получаем переменные окружения
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseServiceRoleKey) {
      throw new Error('Missing env vars');
    }

    // Получаем userId из тела запроса
    const { userId } = await req.json();
    console.log('2️⃣ UserId:', userId);
    
    if (!userId) {
      throw new Error('No userId provided');
    }

    // Создаем админ-клиент
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);
    console.log('3️⃣ Admin client created');

    // Удаляем все связанные записи ПОСЛЕДОВАТЕЛЬНО
    console.log('4️⃣ Deleting pets...');
    const { error: petsError } = await supabaseAdmin
      .from('pets')
      .delete()
      .eq('user_id', userId);
    
    if (petsError) {
      console.error('⚠️ Pets deletion error:', petsError);
    }

    // Удаляем медицинские записи (если таблица существует)
    try {
      console.log('5️⃣ Deleting medical records...');
      await supabaseAdmin
        .from('medical_records')
        .delete()
        .eq('user_id', userId);
    } catch (e) {
      console.log('ℹ️ Medical records table may not exist');
    }

    // Удаляем профиль (если таблица существует)
    try {
      console.log('6️⃣ Deleting profile...');
      await supabaseAdmin
        .from('profiles')
        .delete()
        .eq('id', userId);
    } catch (e) {
      console.log('ℹ️ Profiles table may not exist');
    }

    // Теперь удаляем пользователя
    console.log('7️⃣ Deleting user from auth...');
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userId);
    
    if (deleteError) {
      console.error('❌ Auth deletion error:', deleteError);
      throw deleteError;
    }

    console.log('8️⃣ User deleted successfully');
    
    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('❌ Fatal error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});