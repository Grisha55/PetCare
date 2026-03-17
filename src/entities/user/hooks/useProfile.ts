import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../app/providers/auth-provider';
import { 
  getProfile, 
  updateProfile, 
  updateUserEmail, 
  updateUserPassword,
  uploadAvatar,
  type Profile 
} from '../../../shared/api/profileApi';

export const useProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProfile = useCallback(async () => {
    if (!user) {
      setProfile(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await getProfile(user.id);
      setProfile(data);
    } catch (err) {
      console.error('Failed to load profile:', err);
      setError(err instanceof Error ? err.message : 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const updateUserData = async (data: { 
    name?: string; 
    email?: string; 
    password?: string;
    avatar?: File;
  }) => {
    if (!user) throw new Error('User not authenticated');

    try {
      setLoading(true);
      setError(null);

      // Обновляем имя в таблице profiles
      if (data.name && data.name !== profile?.name) {
        await updateProfile(user.id, { name: data.name });
      }

      // Обновляем email в auth
      if (data.email && data.email !== user.email) {
        await updateUserEmail(data.email);
      }

      // Обновляем пароль в auth
      if (data.password) {
        await updateUserPassword(data.password);
      }

      // Загружаем аватар
      if (data.avatar) {
        await uploadAvatar(user.id, data.avatar);
      }

      // Перезагружаем профиль
      await loadProfile();

      return { success: true };
    } catch (err) {
      console.error('Error updating user data:', err);
      const message = err instanceof Error ? err.message : 'Failed to update profile';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    profile,
    loading,
    error,
    updateUserData,
    refreshProfile: loadProfile
  };
};