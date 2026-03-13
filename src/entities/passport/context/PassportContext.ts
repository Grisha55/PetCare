import { createContext } from 'react';
import type { PassportContextType } from './types';

export const PassportContext = createContext<PassportContextType | undefined>(
  undefined
);