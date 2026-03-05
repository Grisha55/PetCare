import { supabase } from './supabase';

export const createPet = async (
  userId: string,
  name: string,
  breed: string,
  age: number
) => {
  const { data, error } = await supabase
    .from('pets')
    .insert({
      user_id: userId,
      name,
      breed,
      age,
    })
    .select();

  if (error) throw error;

  return data;
};

export const getPets = async (userId: string) => {
  const { data, error } = await supabase
    .from('pets')
    .select('*')
    .eq('user_id', userId);

  if (error) throw error;

  return data;
};