import { useState } from 'react';
import { type MedicalRecord } from './types';

export const useMedicalRecords = () => {
  const [records, setRecords] = useState<MedicalRecord[]>([]);

  const addRecord = (record: MedicalRecord) => {
    setRecords((prev) => [...prev, record]);
  };

  return {
    records,
    addRecord,
  };
};