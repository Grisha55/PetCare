import type { MedicalRecord, CreateMedicalRecord } from '../../entities/medical-record/model/types'
import { supabase } from './supabase';

export const createMedicalRecord = async (
  petId: string,
  data: CreateMedicalRecord
) => {
  const { data: newRecord, error } = await supabase
    .from('medical_records')
    .insert({
      pet_id: petId,
      type: data.type,
      title: data.title,
      description: data.description,
      date: data.date,
    })
    .select()
    .single();

  if (error) throw error;

  return newRecord as MedicalRecord;
};

export const getMedicalRecords = async (petId: string): Promise<MedicalRecord[]> => {
  const { data, error } = await supabase
    .from('medical_records')
    .select('*')
    .eq('pet_id', petId)
    .order('date', { ascending: true });

  if (error) throw error;

  return data || [];
};

export const deleteMedicalRecord = async (id: string) => {
  const { error } = await supabase
    .from('medical_records')
    .delete()
    .eq('id', id)

  if (error) throw error
}

export const createReminderNotification = async (
  userId: string,
  petId: string,
  record: MedicalRecord
) => {
  const recordDate = new Date(record.date);
  const today = new Date();
  const daysUntil = Math.ceil((recordDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  let message = '';
  let type = 'info';

  if (daysUntil <= 0) {
    message = `Сегодня запланировано: ${record.title}`;
    type = 'warning';
  } else if (daysUntil === 1) {
    message = `Завтра: ${record.title}`;
    type = 'reminder';
  } else if (daysUntil <= 7) {
    message = `Через ${daysUntil} дней: ${record.title}`;
    type = 'reminder';
  }

  if (message) {
    const { error } = await supabase
      .from('user_notifications')
      .insert({
        user_id: userId,
        pet_id: petId,
        record_id: record.id,
        type,
        title: `Напоминание: ${record.title}`,
        message
      });

    if (error) console.error('Error creating notification:', error);
  }
};