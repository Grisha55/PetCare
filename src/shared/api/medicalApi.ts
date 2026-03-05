import { supabase } from './supabase';

export const createMedicalRecord = async (
  petId: string,
  type: 'vaccine' | 'medicine' | 'visit',
  title: string,
  description: string,
  date: string
) => {
  const { data, error } = await supabase
    .from('medical_records')
    .insert({
      pet_id: petId,
      type,
      title,
      description,
      date,
    })
    .select();

  if (error) throw error;

  return data;
};

export const getMedicalRecords = async (petId: string) => {
  const { data, error } = await supabase
    .from('medical_records')
    .select('*')
    .eq('pet_id', petId)
    .order('date', { ascending: true });

  if (error) throw error;

  return data;
};

export const deleteMedicalRecord = async (id: string) => {
  const { error } = await supabase
    .from('medical_records')
    .delete()
    .eq('id', id)

  if (error) throw error
}