import { createContext } from 'react';

export interface Pet {
  id: string;
  name: string;
  avatar_url: string | null;
  user_id: string;
  created_at?: string;
}

export interface PetContextType {
  pet: Pet | null;
  loading: boolean;
  error: Error | null;
  changeAvatar: (file: File) => Promise<void>;
  refreshPet: () => Promise<void>;
  setPet: (pet: Pet | null) => void;
}

export const PetContext = createContext<PetContextType | null>(null);