import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("PROJECT_URL")!;
const supabaseServiceKey = Deno.env.get("SERVICE_ROLE_KEY")!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

Deno.serve(async (req) => {
  try {
    // Получаем все предстоящие медицинские записи
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);

    const { data: records, error } = await supabase
      .from('medical_records')
      .select(`
        *,
        pets!inner (
          user_id,
          name
        )
      `)
      .gte('date', today.toISOString().split('T')[0])
      .lte('date', nextWeek.toISOString().split('T')[0])
      .eq('reminder_sent', false);

    if (error) throw error;

    console.log(`Found ${records?.length || 0} upcoming medical records`);

    for (const record of records || []) {
      try {
        // Создаем уведомление
        await createReminderNotification(record);
        
        // Отмечаем как отправленное
        await supabase
          .from('medical_records')
          .update({ reminder_sent: true })
          .eq('id', record.id);
          
      } catch (recordError) {
        console.error(`Error processing record ${record.id}:`, recordError);
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        processed: records?.length || 0 
      }),
      { 
        status: 200, 
        headers: { "Content-Type": "application/json" } 
      }
    );
    
  } catch (error) {
    console.error("Error processing reminders:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});

async function createReminderNotification(record: any) {
  const recordDate = new Date(record.date);
  const today = new Date();
  const daysUntil = Math.ceil((recordDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  let type = 'info';
  let message = '';

  if (daysUntil === 0) {
    type = 'warning';
    message = `Сегодня: ${record.title} для ${record.pets.name}`;
  } else if (daysUntil === 1) {
    type = 'reminder';
    message = `Завтра: ${record.title} для ${record.pets.name}`;
  } else if (daysUntil <= 7) {
    type = 'reminder';
    message = `Через ${daysUntil} дней: ${record.title} для ${record.pets.name}`;
  }

  await supabase
    .from('user_notifications')
    .insert({
      user_id: record.pets.user_id,
      pet_id: record.pet_id,
      record_id: record.id,
      type,
      title: `Напоминание: ${record.title}`,
      message
    });
}