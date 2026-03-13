import type { PassportPhoto } from '../model/types';

export interface PassportContextType {
  photos: PassportPhoto[];
  loading: boolean;
  refreshPhotos: () => Promise<void>;
  addPhoto: (photo: PassportPhoto) => void;
  removePhoto: (photoId: string) => void;
}