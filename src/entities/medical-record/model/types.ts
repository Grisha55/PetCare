export type MedicalRecordType =
  | 'vaccine'
  | 'medicine'
  | 'visit'

export interface MedicalRecord {
  id: string
  pet_id: string
  type: MedicalRecordType
  title: string
  description: string
  date: string
}

export interface CreateMedicalRecord {
  type: MedicalRecordType
  title: string
  description: string
  date: string
}