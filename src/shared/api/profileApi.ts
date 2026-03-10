import { supabase } from './supabase';

export interface Profile {
  id: string;
  name: string;
  email: string;
  avatar_url?: string | null;
  updated_at?: string;
  created_at?: string;
}

export const getProfile = async (userId: string) => {
  try {
    // Сначала пробуем получить профиль из таблицы profiles
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') throw error;

    // Если профиль не найден, создаем его из данных auth
    if (!data) {
      // Получаем данные пользователя из auth
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const newProfile = {
          id: userId,
          name: user.user_metadata?.name || user.email?.split('@')[0] || 'Пользователь',
          email: user.email,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        const { data: createdProfile, error: createError } = await supabase
          .from('profiles')
          .insert([newProfile])
          .select()
          .single();

        if (createError) throw createError;
        return createdProfile;
      }
    }

    return data;
  } catch (error) {
    console.error('Error in getProfile:', error);
    throw error;
  }
};

export const updateProfile = async (userId: string, updates: { name?: string; avatar_url?: string | null }) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        ...updates,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error in updateProfile:', error);
    throw error;
  }
};

export const updateUserEmail = async (newEmail: string) => {
  try {
    const { data, error } = await supabase.auth.updateUser({
      email: newEmail
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error in updateUserEmail:', error);
    throw error;
  }
};

export const updateUserPassword = async (newPassword: string) => {
  try {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error in updateUserPassword:', error);
    throw error;
  }
};

export const uploadAvatar = async (userId: string, file: File) => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/avatar-${Date.now()}.${fileExt}`;

    // Загружаем файл в storage
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (uploadError) throw uploadError;

    // Получаем публичный URL
    const { data } = supabase.storage
      .from('avatars')
      .getPublicUrl(fileName);

    const avatarUrl = data.publicUrl;

    // Обновляем профиль с новым URL аватара
    await updateProfile(userId, { avatar_url: avatarUrl });

    return avatarUrl;
  } catch (error) {
    console.error('Error in uploadAvatar:', error);
    throw error;
  }
};