import { createContext } from 'react'

export interface Pet {
  id: string
  name: string
  avatar_url: string | null
  user_id: string
}

export interface PetContextType {
  pet: Pet | null
  loading: boolean
  error: Error | null
  changeAvatar: (file: File) => Promise<void>
  refreshPet: () => Promise<void>
}

export const PetContext = createContext<PetContextType | null>(null)