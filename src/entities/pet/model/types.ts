export interface Pet {
  id: string
  name: string
  avatar_url: string | null
  email?: string
}

export interface CreatePetData {
  name: string;
}