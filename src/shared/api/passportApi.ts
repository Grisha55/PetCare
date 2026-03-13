import SparkMD5 from 'spark-md5';
import type { PassportPhoto } from '../../entities/passport/model/types';
import { supabase } from './supabase';

const calculateFileHash = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const arrayBuffer = e.target?.result as ArrayBuffer;
      const spark = new SparkMD5.ArrayBuffer();
      spark.append(arrayBuffer);
      const hash = spark.end();
      resolve(hash);
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
};

// ✅ Функция для получения фотографий
export const getPassportPhotos = async (petId: string): Promise<PassportPhoto[]> => {
  const { data, error } = await supabase
    .from('passport_photos')
    .select('*')
    .eq('pet_id', petId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching passport photos:', error);
    throw error;
  }

  return data || [];
};

export const uploadPassportPhoto = async (
  petId: string,
  file: File
): Promise<PassportPhoto[]> => {
  // Вычисляем хеш перед загрузкой
  const fileHash = await calculateFileHash(file);
  
  // Проверяем, есть ли уже фото с таким хешем
  const { data: existing } = await supabase
    .from('passport_photos')
    .select('id')
    .eq('pet_id', petId)
    .eq('file_hash', fileHash)
    .maybeSingle();

  if (existing) {
    throw new Error('Такое фото уже существует');
  }

  const fileName = `${petId}/${Date.now()}-${file.name}`;

  const { error: uploadError } = await supabase.storage
    .from('pasport-photos')
    .upload(fileName, file);

  if (uploadError) throw uploadError;

  const { data: urlData } = supabase.storage
    .from('pasport-photos')
    .getPublicUrl(fileName);

  const { data, error } = await supabase
    .from('passport_photos')
    .insert({
      pet_id: petId,
      url: urlData.publicUrl,
      file_hash: fileHash,
      file_size: file.size,
      file_name: file.name
    })
    .select()
    .returns<PassportPhoto[]>();

  if (error) throw error;

  return data || [];
};

// ✅ Функция для удаления фотографии (тоже добавьте, если нужно)
export const deletePassportPhoto = async (
  id: string,
  url: string
): Promise<void> => {
  const path = url.split('/pasport-photos/')[1];

  const { error: storageError } = await supabase.storage
    .from('pasport-photos')
    .remove([path]);

  if (storageError) throw storageError;

  const { error: dbError } = await supabase
    .from('passport_photos')
    .delete()
    .eq('id', id);

  if (dbError) throw dbError;
};