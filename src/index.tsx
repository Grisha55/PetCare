import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './app/App';
import { ThemeProvider } from './app/providers/ThemeProvider';
import { MedicalRecordsProvider } from './app/providers/medical-records-provider/ui/MedicalRecordsProvider'
import { AuthProvider } from './app/providers/auth-provider'

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<BrowserRouter>
			<ThemeProvider>
				<AuthProvider>
					<MedicalRecordsProvider>
						<App />
					</MedicalRecordsProvider>
				</AuthProvider>
			</ThemeProvider>
		</BrowserRouter>
	</StrictMode>
);
