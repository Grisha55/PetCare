import { supabase } from './supabase'

export const uploadPetAvatar = async (
  petId: string,
  file: File
) => {
  const fileName = `${petId}/${Date.now()}-${file.name}`

  const { error: uploadError } = await supabase.storage
    .from('pet-avatars')
    .upload(fileName, file)

  if (uploadError) throw uploadError

  const { data } = supabase.storage
    .from('pet-avatars')
    .getPublicUrl(fileName)

  const avatarUrl = data.publicUrl

  const { error } = await supabase
    .from('pets')
    .update({ avatar_url: avatarUrl })
    .eq('id', petId)

  if (error) throw error

  return avatarUrl
}

export const getPet = async (petId: string) => {
  console.log('getPet called with ID:', petId);
  
  try {
    const { data, error } = await supabase
      .from('pets')
      .select('*')
      .eq('id', petId)
      .maybeSingle()

    console.log('Supabase response:', { data, error });

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    console.log('Pet data retrieved:', data);
    return data
  } catch (err) {
    console.error('Error in getPet:', err);
    throw err;
  }
}

export const createPet = async (userId: string, petData: { name: string }) => {
  console.log('Creating pet for user:', userId, 'with data:', petData);
  
  const { data: existingPet } = await supabase
    .from('pets')
    .select('id')
    .eq('user_id', userId)
    .maybeSingle();

  if (existingPet) {
    console.log('Pet already exists for user:', existingPet);
    // Если существует, обновляем его
    const { data, error } = await supabase
      .from('pets')
      .update({ name: petData.name })
      .eq('id', existingPet.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Если не существует, создаем новый с отдельным UUID
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
    .single()

  if (error) {
    console.error('Error creating pet:', error);
    throw error;
  }

  console.log('Pet created:', data);
  return data
}