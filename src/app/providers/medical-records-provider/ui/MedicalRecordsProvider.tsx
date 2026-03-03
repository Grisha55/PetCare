import { useState, type ReactNode } from 'react';
import { v4 as uuid } from 'uuid';
import { MedicalRecordsContext } from '../model/context';
import type { CreateMedicalRecord, MedicalRecord } from '../../../../entities/medical-record/model/types'

export const MedicalRecordsProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [records, setRecords] = useState<MedicalRecord[]>([]);

  const addRecord = (data: CreateMedicalRecord) => {
    setRecords((prev) => [
      ...prev,
      {
        id: uuid(),
        ...data,
      },
    ]);
  };

  return (
    <MedicalRecordsContext.Provider value={{ records, addRecord }}>
      {children}
    </MedicalRecordsContext.Provider>
  );
};