import { useContext, type FC } from 'react';
import styles from './ThemeSwitcher.module.scss';
import { Theme, ThemeContext } from '../../../app/providers/ThemeProvider/lib/ThemeContext'

export const ThemeSwitcher: FC = () => {
	const { theme, setTheme } = useContext(ThemeContext);

	const handleThemeChange = (newTheme: Theme) => {
		if (setTheme) {
			setTheme(newTheme);
			localStorage.setItem('theme', newTheme);
		}
	};

	return (
		<div className={styles.themeSwitcher}>
			<div className={styles.options}>
				<button
					className={`${styles.option} ${theme === Theme.LIGHT ? styles.active : ''}`}
					onClick={() => handleThemeChange(Theme.LIGHT)}
				>
					<span className={styles.icon}>☀️</span>
					<span className={styles.themeName}>Светлая</span>
				</button>
				<button
					className={`${styles.option} ${theme === Theme.DARK ? styles.active : ''}`}
					onClick={() => handleThemeChange(Theme.DARK)}
				>
					<span className={styles.icon}>🌙</span>
					<span className={styles.themeName}>Темная</span>
				</button>
			</div>
		</div>
	);
};