import { useContext, useEffect } from 'react';
import { AppRouter } from '../shared/config/routeConfig/AppRouter';
import {
	Theme,
	ThemeContext
} from './providers/ThemeProvider/lib/ThemeContext';
import './styles/index.scss';

function App() {
	const { theme } = useContext(ThemeContext);

	useEffect(() => {
		document.body.classList.remove(Theme.LIGHT, Theme.DARK);
		document.body.classList.add(theme || Theme.LIGHT);
		document.body.classList.add('app');
	}, [theme]);

	return (
		<div className={`app ${theme}`}>
			<AppRouter />
		</div>
	);
}

export default App;
