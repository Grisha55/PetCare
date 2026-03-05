import { Routes, Route } from 'react-router-dom';
import { routeConfig } from './routeConfig';
import { ProtectedRoute } from './ProtectedRoute'
import { useAuth } from '../../../app/providers/auth-provider'

export const AppRouter = () => {
  const { user, loading } = useAuth();
	console.log('AppRouter - user: ', user, 'loading: ', loading);

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <Routes>
      {Object.values(routeConfig).map(({ path, component: Component }) => {
        // Если это login или registration — не защищаем
        if (path === '/login' || path === '/registration') {
          return <Route key={path} path={path} element={<Component />} />;
        }

        return (
          <Route
            key={path}
            path={path}
            element={
              <ProtectedRoute>
                <Component />
              </ProtectedRoute>
            }
          />
        );
      })}
    </Routes>
  );
};