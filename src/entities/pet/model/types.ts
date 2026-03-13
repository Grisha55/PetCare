export interface Pet {
  id: string
  name: string
  avatar_url: string | null
  user_id: string
  created_at?: string
}

export interface CreatePetData {
  name: string;
}