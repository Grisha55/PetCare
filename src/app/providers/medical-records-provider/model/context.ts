import { createContext } from 'react';
import type {
	CreateMedicalRecord,
	MedicalRecord
} from '../../../../entities/medical-record/model/types';

export interface MedicalRecordsContextType {
	records: MedicalRecord[];
	addRecord: (data: CreateMedicalRecord) => void;
	deleteRecord: (id: string) => void;
}

export const MedicalRecordsContext =
	createContext<MedicalRecordsContextType | null>(null);
