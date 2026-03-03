import { Navigate } from 'react-router-dom';
import { useAuth } from '../../../app/providers/auth-provider/AuthContext';
import type { ReactNode } from 'react'

interface ProtectedRouteProps {
	children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};