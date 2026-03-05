import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react'
import { useAuth } from '../../../app/providers/auth-provider'

interface ProtectedRouteProps {
	children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};