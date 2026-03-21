import { Route, Routes } from 'react-router-dom';
import { useAuth } from '../../../app/providers/auth-provider';
import { LoadingScreen } from '../../ui/LoadingScreen';
import { ProtectedRoute } from './ProtectedRoute';
import { routeConfig } from './routeConfig';

export const AppRouter = () => {
	const { user, loading } = useAuth();
	console.log('AppRouter - user: ', user, 'loading: ', loading);

	if (loading) {
		return <LoadingScreen />;
	}

	return (
		<Routes>
			{Object.values(routeConfig).map(({ path, component: Component }) => {
				// Если это login или registration — не защищаем
				if (path === '/login' || path === '/registration') {
					return (
						<Route
							key={path}
							path={path}
							element={<Component />}
						/>
					);
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
