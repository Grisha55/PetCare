import { useEffect, useState } from 'react';
import { uploadPetAvatar, createPet } from '../../../shared/api/petApi';
import type { Pet } from './types';
import { useAuth } from '../../../app/providers/auth-provider'
import { supabase } from '../../../shared/api/supabase'

export const usePet = () => {
  const [pet, setPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const loadOrCreatePet = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        console.log('Loading pet for user:', user.id);
        
        const { data: petByUserId } = await supabase
          .from('pets')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();
        
        console.log('Pet by user_id:', petByUserId);
        
        let data = petByUserId;
        
        // Если питомца нет, создаем нового
        if (!data) {
          console.log('Pet not found, creating new pet for user:', user.email);
          
          const petName = user.email?.split('@')[0] || 'Питомец';
          data = await createPet(user.id, { name: petName });
          
          console.log('Created pet:', data);
        }
        
        setPet(data);
      } catch (err) {
        console.error('Error loading/creating pet:', err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    };

    loadOrCreatePet();
  }, [user]);

  const changeAvatar = async (file: File) => {
    if (!pet?.id) return;
    
    try {
      const url = await uploadPetAvatar(pet.id, file);
      setPet(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          avatar_url: url
        };
      });
    } catch (err) {
      console.error('Error changing avatar:', err);
      throw err;
    }
  };

  return { pet, changeAvatar, loading, error };
};