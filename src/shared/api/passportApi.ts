import { supabase } from './supabase'

export const uploadPassportPhoto = async (
  petId: string,
  file: File
) => {
  const fileName = `${petId}/${Date.now()}-${file.name}`

  const { error: uploadError } = await supabase.storage
    .from('pasport-photos')
    .upload(fileName, file)

  if (uploadError) throw uploadError

  const { data } = supabase.storage
    .from('pasport-photos')
    .getPublicUrl(fileName)

  const { data: record, error } = await supabase
    .from('passport_photos')
    .insert({
      pet_id: petId,
      url: data.publicUrl
    })
    .select()

  if (error) throw error

  return record
}

export const getPassportPhotos = async (petId: string) => {
  const { data, error } = await supabase
    .from('passport_photos')
    .select('*')
    .eq('pet_id', petId)
    .order('created_at')

  if (error) throw error

  return data
}

export const deletePassportPhoto = async (
  id: string,
  url: string
) => {
  const path = url.split('/pasport-photos/')[1]

  await supabase.storage
    .from('pasport-photos')
    .remove([path])

  await supabase
    .from('passport_photos')
    .delete()
    .eq('id', id)
}