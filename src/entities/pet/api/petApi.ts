import { supabase } from '../../../shared/api/supabase';
import type { Pet, CreatePetData } from '../model/types';

export const createPet = async (userId: string, data: CreatePetData): Promise<Pet | null> => {
  const { data: pet, error } = await supabase
    .from('pets')
    .insert({
      user_id: userId,
      name: data.name
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating pet:', error);
    throw error;
  }

  return pet;
};

export const uploadPetAvatar = async (petId: string, file: File): Promise<string | null> => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${petId}-${Math.random()}.${fileExt}`;
  const filePath = `pet-avatars/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('pets')
    .upload(filePath, file);

  if (uploadError) {
    console.error('Error uploading avatar:', uploadError);
    throw uploadError;
  }

  const { data: urlData } = supabase.storage
    .from('pets')
    .getPublicUrl(filePath);

  const { error: updateError } = await supabase
    .from('pets')
    .update({ avatar_url: urlData.publicUrl })
    .eq('id', petId);

  if (updateError) {
    console.error('Error updating pet avatar:', updateError);
    throw updateError;
  }

  return urlData.publicUrl;
};