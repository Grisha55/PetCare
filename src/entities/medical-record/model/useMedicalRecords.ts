import { useEffect, useState } from 'react'
import {
  createMedicalRecord,
  deleteMedicalRecord,
  getMedicalRecords,
} from '../../../shared/api/medicalApi'
import type {
  MedicalRecord,
  CreateMedicalRecord,
} from './types'

export const useMedicalRecords = (petId: string) => {
  const [records, setRecords] = useState<MedicalRecord[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadRecords = async () => {
      const data = await getMedicalRecords(petId)
      setRecords(data)
      setLoading(false)
    }

    loadRecords()
  }, [petId])

  const addRecord = async (record: CreateMedicalRecord) => {
    const newRecord = await createMedicalRecord(
      petId,
      record.type,
      record.title,
      record.description,
      record.date
    )

    setRecords((prev) => [...prev, ...newRecord])
  }

  const deleteRecord = async (id: string) => {
    await deleteMedicalRecord(id)
    setRecords((prev) => prev.filter((record) => record.id !== id))
  }

  return {
    records,
    loading,
    addRecord,
    deleteRecord
  }
}