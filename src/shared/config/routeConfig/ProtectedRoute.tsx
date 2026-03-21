import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../../app/providers/auth-provider';
import { LoadingScreen } from '../../ui/LoadingScreen';

interface Props {
	children: ReactNode;
}

export const ProtectedRoute = ({ children }: Props) => {
	const { user, loading } = useAuth();

	console.log('ProtectedRoute - user:', user, 'loading:', loading);

	if (loading) {
		return <LoadingScreen />;
	}

	if (!user) {
		console.log('No user, redirecting to /login');
		// Перенаправляем на страницу входа, а не регистрации
		return <Navigate to="/login" />;
	}

	console.log('User authenticated, rendering children');
	return children;
};
