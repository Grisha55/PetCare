import { Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { MainPage } from '../../../../pages/MainPage'


const AppRouter = () => {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<Routes>
				<Route path='/' element={<MainPage />} />
			</Routes>
		</Suspense>
	)
}

export default AppRouter