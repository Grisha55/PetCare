import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from './app/App';

import { ThemeProvider } from './app/providers/ThemeProvider';
import { AuthProvider } from './app/providers/auth-provider';
import { PetProvider } from './app/providers/pet-provider/PetProvider';
import { MedicalRecordsProvider } from './app/providers/medical-records-provider/ui/MedicalRecordsProvider';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <PetProvider>
            <MedicalRecordsProvider>
              <App />
            </MedicalRecordsProvider>
          </PetProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
);