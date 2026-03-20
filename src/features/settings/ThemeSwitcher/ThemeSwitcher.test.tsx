import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
	Theme,
	ThemeContext
} from '../../../app/providers/ThemeProvider/lib/ThemeContext';
import { ThemeSwitcher } from './ThemeSwitcher';
import styles from './ThemeSwitcher.module.scss';

// Мокаем localStorage
const localStorageMock = (() => {
	let store: Record<string, string> = {};
	return {
		getItem: (key: string) => store[key] || null,
		setItem: (key: string, value: string) => {
			store[key] = value;
		},
		clear: () => {
			store = {};
		}
	};
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('ThemeSwitcher', () => {
	const mockSetTheme = vi.fn();

	beforeEach(() => {
		vi.clearAllMocks();
		localStorageMock.clear();
	});

	it('рендерит обе кнопки тем', () => {
		render(
			<ThemeContext.Provider
				value={{ theme: Theme.LIGHT, setTheme: mockSetTheme }}
			>
				<ThemeSwitcher />
			</ThemeContext.Provider>
		);

		expect(screen.getByText('Светлая')).toBeInTheDocument();
		expect(screen.getByText('Темная')).toBeInTheDocument();
		expect(screen.getByText('☀️')).toBeInTheDocument();
		expect(screen.getByText('🌙')).toBeInTheDocument();
	});

	it('показывает активную тему (светлая)', () => {
		render(
			<ThemeContext.Provider
				value={{ theme: Theme.LIGHT, setTheme: mockSetTheme }}
			>
				<ThemeSwitcher />
			</ThemeContext.Provider>
		);

		const lightButton = screen.getByText('Светлая').closest('button');
		const darkButton = screen.getByText('Темная').closest('button');

		expect(lightButton).toHaveClass(styles.active);
		expect(darkButton).not.toHaveClass(styles.active);
	});

	it('показывает активную тему (темная)', () => {
		render(
			<ThemeContext.Provider
				value={{ theme: Theme.DARK, setTheme: mockSetTheme }}
			>
				<ThemeSwitcher />
			</ThemeContext.Provider>
		);

		const lightButton = screen.getByText('Светлая').closest('button');
		const darkButton = screen.getByText('Темная').closest('button');

		expect(lightButton).not.toHaveClass(styles.active);
		expect(darkButton).toHaveClass(styles.active);
	});

	it('переключает тему на светлую при клике', () => {
		render(
			<ThemeContext.Provider
				value={{ theme: Theme.DARK, setTheme: mockSetTheme }}
			>
				<ThemeSwitcher />
			</ThemeContext.Provider>
		);

		const lightButton = screen.getByText('Светлая');
		fireEvent.click(lightButton);

		expect(mockSetTheme).toHaveBeenCalledWith(Theme.LIGHT);
		expect(localStorageMock.getItem('theme')).toBe(Theme.LIGHT);
	});

	it('переключает тему на темную при клике', () => {
		render(
			<ThemeContext.Provider
				value={{ theme: Theme.LIGHT, setTheme: mockSetTheme }}
			>
				<ThemeSwitcher />
			</ThemeContext.Provider>
		);

		const darkButton = screen.getByText('Темная');
		fireEvent.click(darkButton);

		expect(mockSetTheme).toHaveBeenCalledWith(Theme.DARK);
		expect(localStorageMock.getItem('theme')).toBe(Theme.DARK);
	});

	it('сохраняет тему в localStorage', () => {
		render(
			<ThemeContext.Provider
				value={{ theme: Theme.LIGHT, setTheme: mockSetTheme }}
			>
				<ThemeSwitcher />
			</ThemeContext.Provider>
		);

		const darkButton = screen.getByText('Темная');
		fireEvent.click(darkButton);

		expect(localStorageMock.getItem('theme')).toBe(Theme.DARK);
	});

	it('не вызывает setTheme, если setTheme отсутствует', () => {
		render(
			<ThemeContext.Provider
				value={{ theme: Theme.LIGHT, setTheme: undefined }}
			>
				<ThemeSwitcher />
			</ThemeContext.Provider>
		);

		const darkButton = screen.getByText('Темная');
		fireEvent.click(darkButton);

		expect(localStorageMock.getItem('theme')).toBeNull();
	});
});
