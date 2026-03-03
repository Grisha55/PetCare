export type MedicalRecordType = 'vaccine' | 'medicine' | 'visit';

export interface MedicalRecord {
  id: string;
  type: MedicalRecordType;
  title: string;
  description: string;
  date: string;
}

export type CreateMedicalRecord = Omit<MedicalRecord, 'id'>;