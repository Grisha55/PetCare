import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ProfileHeader } from './ProfileHeader';
import cls from './ProfileHeader.module.scss';

// Мокаем иконки, так как они не важны для логики
vi.mock('lucide-react', () => ({
	Settings: () => <div data-testid="mock-settings-icon" />,
	LogOut: () => <div data-testid="mock-logout-icon" />,
	User: () => <div data-testid="mock-user-icon" />
}));

describe('ProfileHeader', () => {
	const mockOnSettingsClick = vi.fn();
	const mockOnLogoutClick = vi.fn();

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('рендерит заголовок и иконку пользователя', () => {
		render(
			<ProfileHeader
				onSettingsClick={mockOnSettingsClick}
				onLogoutClick={mockOnLogoutClick}
				isLoggingOut={false}
			/>
		);

		expect(screen.getByText('Профиль пользователя')).toBeInTheDocument();
		expect(screen.getByTestId('mock-user-icon')).toBeInTheDocument();
	});

	it('рендерит кнопки "Настройки" и "Выйти"', () => {
		render(
			<ProfileHeader
				onSettingsClick={mockOnSettingsClick}
				onLogoutClick={mockOnLogoutClick}
				isLoggingOut={false}
			/>
		);

		expect(screen.getByText('Настройки')).toBeInTheDocument();
		expect(screen.getByText('Выйти')).toBeInTheDocument();
		expect(screen.getByTestId('mock-settings-icon')).toBeInTheDocument();
		expect(screen.getByTestId('mock-logout-icon')).toBeInTheDocument();
	});

	it('вызывает onSettingsClick при клике на кнопку настроек', async () => {
		const user = userEvent.setup();

		render(
			<ProfileHeader
				onSettingsClick={mockOnSettingsClick}
				onLogoutClick={mockOnLogoutClick}
				isLoggingOut={false}
			/>
		);

		await user.click(screen.getByText('Настройки'));
		expect(mockOnSettingsClick).toHaveBeenCalledTimes(1);
	});

	it('вызывает onLogoutClick при клике на кнопку выхода', async () => {
		const user = userEvent.setup();

		render(
			<ProfileHeader
				onSettingsClick={mockOnSettingsClick}
				onLogoutClick={mockOnLogoutClick}
				isLoggingOut={false}
			/>
		);

		await user.click(screen.getByText('Выйти'));
		expect(mockOnLogoutClick).toHaveBeenCalledTimes(1);
	});

	it('отключает обе кнопки при isLoggingOut = true', () => {
		render(
			<ProfileHeader
				onSettingsClick={mockOnSettingsClick}
				onLogoutClick={mockOnLogoutClick}
				isLoggingOut={true}
			/>
		);

		const buttons = screen.getAllByRole('button');
		buttons.forEach(button => {
			expect(button).toBeDisabled();
		});
	});

	it('показывает спиннер и текст "Выход..." при isLoggingOut = true', () => {
		render(
			<ProfileHeader
				onSettingsClick={mockOnSettingsClick}
				onLogoutClick={mockOnLogoutClick}
				isLoggingOut={true}
			/>
		);

		expect(screen.getByText('Выход...')).toBeInTheDocument();
		expect(screen.queryByText('Выйти')).not.toBeInTheDocument();
		expect(screen.getByText('Настройки')).toBeInTheDocument();

		// Проверяем наличие спиннера (по классу)
		const spinner = document.querySelector(`.${cls.spinner}`);
		expect(spinner).toBeInTheDocument();
	});

	it('имеет правильные aria-label для кнопок', () => {
		render(
			<ProfileHeader
				onSettingsClick={mockOnSettingsClick}
				onLogoutClick={mockOnLogoutClick}
				isLoggingOut={false}
			/>
		);

		expect(screen.getByLabelText('Перейти к настройкам')).toBeInTheDocument();
		expect(screen.getByLabelText('Выйти из аккаунта')).toBeInTheDocument();
	});

	it('кнопки имеют правильные классы', () => {
		render(
			<ProfileHeader
				onSettingsClick={mockOnSettingsClick}
				onLogoutClick={mockOnLogoutClick}
				isLoggingOut={false}
			/>
		);

		const settingsBtn = screen.getByText('Настройки').closest('button');
		const logoutBtn = screen.getByText('Выйти').closest('button');

		expect(settingsBtn).toHaveClass(cls.settingsBtn);
		expect(logoutBtn).toHaveClass(cls.logoutBtn);
	});
});
