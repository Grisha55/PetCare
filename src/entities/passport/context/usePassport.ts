import { useContext } from 'react';
import { PassportContext } from './PassportContext';

export const usePassport = () => {
  const context = useContext(PassportContext);
  if (!context) {
    throw new Error('usePassport must be used within PassportProvider');
  }
  return context;
};