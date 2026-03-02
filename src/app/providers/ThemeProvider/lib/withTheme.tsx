import type { ComponentType } from 'react'
import ThemeProvider from '../ui/ThemeProvider'


export const withTheme = <P extends object>(Component: ComponentType<P>) => {
	return function WithTheme(props: P) {
		return (
			<ThemeProvider>
				<Component {...props} />
			</ThemeProvider>
		);
	};
};