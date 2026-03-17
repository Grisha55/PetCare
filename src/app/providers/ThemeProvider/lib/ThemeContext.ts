import { createContext } from 'react';

export const Theme = {
	LIGHT: 'light',
	DARK: 'dark'
} as const;

export type Theme = typeof Theme[keyof typeof Theme];

export interface ThemeContextProps {
	theme?: Theme,
	setTheme?: (theme: Theme) => void
}

export const ThemeContext = createContext<ThemeContextProps>({});

export const LOCAL_STORAGE_THEME_KEY = 'theme';