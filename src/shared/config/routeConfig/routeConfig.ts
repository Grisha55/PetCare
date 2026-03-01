import type { ComponentType } from 'react'
import { MainPage } from '../../../pages/MainPage'

export interface AppRoute {
	path: string
	component: ComponentType
}

export const routeConfig: Record<string, AppRoute> = {
	main: {
		path: '/',
		component: MainPage,
	},
	// passport: {
	// 	path: '/passport',
	// 	component: () => <div>Паспорт</div>,
	// },
}