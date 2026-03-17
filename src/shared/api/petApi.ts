import { supabase } from './supabase';

export interface Pet {
  id: string;
  name: string;
  avatar_url: string | null;
  user_id: string;
  created_at?: string;
}

export const uploadPetAvatar = async (
  petId: string,
  file: File
) => {
  const fileName = `${petId}/${Date.now()}-${file.name}`;

  const { error: uploadError } = await supabase.storage
    .from('pet-avatars')
    .upload(fileName, file);

  if (uploadError) throw uploadError;

  const { data } = supabase.storage
    .from('pet-avatars')
    .getPublicUrl(fileName);

  const avatarUrl = data.publicUrl;

  const { error } = await supabase
    .from('pets')
    .update({ avatar_url: avatarUrl })
    .eq('id', petId);

  if (error) throw error;

  return avatarUrl;
};

export const getPetsByUserId = async (userId: string): Promise<Pet[]> => {
  console.log('getPetsByUserId called with ID:', userId);
  
  try {
    const { data, error } = await supabase
      .from('pets')
      .select('*')
      .eq('user_id', userId);

    console.log('Supabase response:', { data, error });

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    console.log('Pets data retrieved:', data);
    return data || [];
  } catch (err) {
    console.error('Error in getPetsByUserId:', err);
    throw err;
  }
};

export const getPet = async (petId: string) => {
  console.log('getPet called with ID:', petId);
  
  try {
    const { data, error } = await supabase
      .from('pets')
      .select('*')
      .eq('id', petId)
      .maybeSingle();

    console.log('Supabase response:', { data, error });

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    console.log('Pet data retrieved:', data);
    return data;
  } catch (err) {
    console.error('Error in getPet:', err);
    throw err;
  }
};

export const createPet = async (userId: string, petData: { name: string }) => {
  console.log('Creating pet for user:', userId, 'with data:', petData);
  
  // Проверяем, есть ли уже питомцы у пользователя
  const { data: existingPets, error: checkError } = await supabase
    .from('pets')
    .select('id')
    .eq('user_id', userId);

  if (checkError) {
    console.error('Error checking existing pets:', checkError);
    throw checkError;
  }

  if (existingPets && existingPets.length > 0) {
    console.log('Pet already exists for user:', existingPets[0]);
    // Если существует, обновляем первого питомца
    const { data, error } = await supabase
      .from('pets')
      .update({ name: petData.name })
      .eq('id', existingPets[0].id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Если не существует, создаем новый
  const { data, error } = await supabase
    .from('pets')
    .insert([
      {
        name: petData.name,
        avatar_url: null,
        user_id: userId
      }
    ])
    .select()
    .single();

  if (error) {
    console.error('Error creating pet:', error);
    throw error;
  }

  console.log('Pet created:', data);
  return data;
};

export const updatePet = async (petId: string, updates: Partial<Pet>) => {
  const { data, error } = await supabase
    .from('pets')
    .update(updates)
    .eq('id', petId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deletePet = async (petId: string) => {
  const { error } = await supabase
    .from('pets')
    .delete()
    .eq('id', petId);

  if (error) throw error;
};