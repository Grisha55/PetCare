import type { ComponentType } from 'react'
import { MainPage } from '../../../pages/MainPage'
import { PassportPage } from '../../../pages/PassportPage'
import { ProfilePage } from '../../../pages/ProfilePage'
import { SettingsPage } from '../../../pages/SettingsPage'
// import { withTheme } from '../../../app/providers/ThemeProvider'

export interface AppRoute {
	path: string
	component: ComponentType
}

export const routeConfig: Record<string, AppRoute> = {
	main: {
		path: '/',
		component: MainPage,
	},
	passport: {
		path: '/passport',
		component: PassportPage,
	},
	profile: {
		path: '/profile',
		component: ProfilePage,
	},
	settings: {
		path: '/settings',
		component: SettingsPage,
	},
}