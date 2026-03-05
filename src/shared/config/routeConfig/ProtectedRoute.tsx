import { Navigate } from 'react-router-dom'
import { useAuth } from '../../../app/providers/auth-provider'
import type { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

export const ProtectedRoute = ({ children }: Props) => {
  const { user, loading } = useAuth()

  console.log('ProtectedRoute - user:', user, 'loading:', loading);

  if (loading) {
    return <div>Loading...</div>
  }

  if (!user) {
    console.log('No user, redirecting to /registration');
    return <Navigate to="/registration" />
  }

  console.log('User authenticated, rendering children');
  return children
}