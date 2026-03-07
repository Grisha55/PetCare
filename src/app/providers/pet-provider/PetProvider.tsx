// PetProvider.tsx
import { useEffect, useState, useCallback } from 'react';
import { createPet, uploadPetAvatar } from '../../../shared/api/petApi';
import { supabase } from '../../../shared/api/supabase';
import { useAuth } from '../auth-provider';
import { PetContext, type Pet } from './PetContext';

export const PetProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [pet, setPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadOrCreatePet = useCallback(async () => {
    if (!user) {
      setPet(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      // Сначала пытаемся найти существующего питомца
      const { data: existingPet, error: findError } = await supabase
        .from('pets')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (findError) {
        console.error('Error finding pet:', findError);
        throw findError;
      }

      // Если питомец уже существует - используем его
      if (existingPet) {
        console.log('Existing pet found:', existingPet);
        setPet(existingPet);
        return;
      }

      // Если питомца нет - создаем нового
      console.log('No pet found, creating new one for user:', user.id);
      const petName = user.email?.split('@')[0] || 'Питомец';
      
      const newPet = await createPet(user.id, { name: petName });
      console.log('New pet created:', newPet);
      
      setPet(newPet);
    } catch (err) {
      console.error('Error in loadOrCreatePet:', err);
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  }, [user]);

  const changeAvatar = async (file: File) => {
    if (!pet?.id) {
      console.error('No pet ID available');
      return;
    }

    try {
      const url = await uploadPetAvatar(pet.id, file);
      console.log('Avatar uploaded, URL:', url);

      // Обновляем локальное состояние
      setPet((prev: Pet | null) => {
        if (!prev) return prev;
        return {
          ...prev,
          avatar_url: url
        };
      });
    } catch (err) {
      console.error('Error changing avatar:', err);
      setError(err instanceof Error ? err : new Error('Error changing avatar'));
    }
  };

  // Загружаем питомца при монтировании или смене пользователя
  useEffect(() => {
    loadOrCreatePet();
  }, [loadOrCreatePet]);

  // Добавляем подписку на изменения в таблице pets
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('pets-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'pets',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Pet changed:', payload);
          // Обновляем данные при изменениях
          loadOrCreatePet();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, loadOrCreatePet]);

  return (
    <PetContext.Provider
      value={{
        pet,
        loading,
        error,
        changeAvatar,
        refreshPet: loadOrCreatePet
      }}
    >
      {children}
    </PetContext.Provider>
  );
};