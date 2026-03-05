import { Routes, Route } from 'react-router-dom';
import { routeConfig } from './routeConfig';
import { ProtectedRoute } from './ProtectedRoute'
import { useAuth } from '../../../app/providers/auth-provider'

export const AppRouter = () => {
  const { user } = useAuth();
	console.log(user);
  return (
    <Routes>
      {Object.values(routeConfig).map(({ path, component: Component }) => {
        // Если это login или registration — не защищаем
        if (path === '/login' || path === '/registration') {
          return <Route key={path} path={path} element={<Component />} />;
        }

        // Остальные страницы — защищаем
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