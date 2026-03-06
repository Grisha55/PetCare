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

export const usePassportPhotos = (petId: string) => {
  const [photos, setPhotos] = useState<PassportPhoto[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadPhotos = async () => {
      const data = await getPassportPhotos(petId)
      setPhotos(data)
      setLoading(false)
    }

    loadPhotos()
  }, [petId])

  const addPhoto = async (file: File) => {
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