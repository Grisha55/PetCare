import { Routes, Route } from 'react-router-dom'
import { routeConfig } from './routeConfig'

export const AppRouter = () => (
	<Routes>
		{Object.values(routeConfig).map(({ path, component: Component }) => (
			<Route key={path} path={path} element={<Component />} />
		))}
	</Routes>
)