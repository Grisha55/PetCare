import type { ComponentType } from 'react'
import { LoginPage } from '../../../pages/LoginPage/ui/LoginPage'
import { MainPage } from '../../../pages/MainPage'
import { PassportPage } from '../../../pages/PassportPage'
import ProfilePage from '../../../pages/ProfilePage'
import { RegistrationPage } from '../../../pages/RegistrationPage/ui/RegistrationPage/RegistrationPage'
import { SettingsPage } from '../../../pages/SettingsPage'
import { TipsPage } from '../../../pages/TipsPage'
// import { withTheme } from '../../../app/providers/ThemeProvider'

export interface AppRoute {
	path: string
	component: ComponentType
}

export const AppRoutes = {
	LOGIN: 'login',
	REGISTRATION: 'registration',
	TIPS: 'tips',
	PROFILE: 'profile',
} as const;

export type AppRoutes = typeof AppRoutes[keyof typeof AppRoutes]

export const routeConfig: Record<string, AppRoute> = {
	[AppRoutes.LOGIN]: {
		path: '/login',
		component: LoginPage,
	},
	[AppRoutes.REGISTRATION]: {
		path: '/registration',
		component: RegistrationPage,
	},
	main: {
		path: '/',
		component: MainPage,
	},
	passport: {
		path: '/passport',
		component: PassportPage,
	},
	[AppRoutes.PROFILE]: {
		path: '/profile',
		component: ProfilePage,
	},
	settings: {
		path: '/settings',
		component: SettingsPage,
	},
	[AppRoutes.TIPS]: {
		path: '/tips',
		component: TipsPage,
	}
}