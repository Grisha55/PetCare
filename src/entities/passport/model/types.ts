export interface PassportPhoto {
  id: string;
  pet_id: string;
  url: string;
  created_at: string;
  updated_at?: string;
}

export interface PassportPhotoUpload {
  pet_id: string;
  url: string;
}