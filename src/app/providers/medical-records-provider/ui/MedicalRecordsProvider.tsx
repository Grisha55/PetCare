// MedicalRecordsProvider.tsx
import { useState, type ReactNode } from 'react';
import { v4 as uuid } from 'uuid';
import type {
	CreateMedicalRecord,
	MedicalRecord
} from '../../../../entities/medical-record/model/types';
import { usePet } from '../../pet-provider/usePet';
import { MedicalRecordsContext } from '../model/context';

export const MedicalRecordsProvider = ({
	children
}: {
	children: ReactNode;
}) => {
	const { pet } = usePet(); // Получаем текущего питомца
	const [records, setRecords] = useState<MedicalRecord[]>([]);

	const addRecord = (data: CreateMedicalRecord) => {
		if (!pet?.id) {
			console.error('No pet selected');
			return;
		}

		setRecords(prev => [
			...prev,
			{
				id: uuid(),
				pet_id: pet.id,
				...data
			}
		]);
	};

	const deleteRecord = (id: string) => {
		setRecords(prev => prev.filter(record => record.id !== id));
	};

	return (
		<MedicalRecordsContext.Provider
			value={{ records, addRecord, deleteRecord }}
		>
			{children}
		</MedicalRecordsContext.Provider>
	);
};
