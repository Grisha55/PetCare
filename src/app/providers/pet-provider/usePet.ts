import { useContext } from 'react';
import { PetContext } from './PetContext';

export const usePet = () => {
  const context = useContext(PetContext);

  if (!context) {
    throw new Error('usePet must be used inside PetProvider');
  }

  return context;
};