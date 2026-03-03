import { useContext } from 'react';
import { MedicalRecordsContext } from './context';

export const useMedicalRecords = () => {
  const context = useContext(MedicalRecordsContext);

  if (!context) {
    throw new Error(
      'useMedicalRecords must be used inside MedicalRecordsProvider'
    );
  }

  return context;
};