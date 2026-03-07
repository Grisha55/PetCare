import { useEffect, useState } from 'react'
import {
  getPassportPhotos,
  uploadPassportPhoto,
  deletePassportPhoto
} from '../../../shared/api/passportApi'

export interface PassportPhoto {
  id: string
  url: string
}

export const usePassportPhotos = (petId: string | null) => {
  const [photos, setPhotos] = useState<PassportPhoto[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Если petId нет, не загружаем данные
    if (!petId) {
      setLoading(false);
      return;
    }

    const loadPhotos = async () => {
      try {
        const data = await getPassportPhotos(petId)
        setPhotos(data)
      } catch (error) {
        console.error('Error loading passport photos:', error)
      } finally {
        setLoading(false)
      }
    }

    loadPhotos()
  }, [petId])

  const addPhoto = async (file: File) => {
    if (!petId) return;
    
    const newPhoto = await uploadPassportPhoto(petId, file)
    setPhotos((prev) => [...prev, ...newPhoto])
  }

  const deletePhoto = async (id: string, url: string) => {
    await deletePassportPhoto(id, url)
    setPhotos((prev) => prev.filter((p) => p.id !== id))
  }

  return {
    photos,
    loading,
    addPhoto,
    deletePhoto
  }
}