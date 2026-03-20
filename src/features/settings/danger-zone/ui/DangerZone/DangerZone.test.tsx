import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { DangerZone } from './DangerZone';
import cls from './DangerZone.module.scss';

// Мокаем иконку
vi.mock('lucide-react', () => ({
	AlertTriangle: () => <div data-testid="alert-icon" />
}));

// Мокаем DeleteAccount компонент
vi.mock('../../../DeleteAccount/DeleteAccount', () => ({
	DeleteAccount: () => (
		<button data-testid="delete-account-button">Удалить аккаунт</button>
	)
}));

describe('DangerZone', () => {
	it('рендерит предупреждение с иконкой', () => {
		render(<DangerZone />);

		expect(screen.getByTestId('alert-icon')).toBeInTheDocument();
		expect(
			screen.getByText(/Удаление аккаунта приведет к потере всех данных/)
		).toBeInTheDocument();
	});

	it('рендерит текст предупреждения', () => {
		render(<DangerZone />);

		const warningText = screen.getByText(
			/Удаление аккаунта приведет к потере всех данных/
		);
		expect(warningText).toBeInTheDocument();
		expect(warningText).toHaveTextContent(
			'Удаление аккаунта приведет к потере всех данных. Это действие необратимо.'
		);
	});

	it('рендерит кнопку удаления аккаунта', () => {
		render(<DangerZone />);

		const deleteButton = screen.getByTestId('delete-account-button');
		expect(deleteButton).toBeInTheDocument();
		expect(deleteButton).toHaveTextContent('Удалить аккаунт');
	});

	it('имеет правильный CSS класс для контейнера', () => {
		const { container } = render(<DangerZone />);

		const dangerZoneDiv = container.firstChild;
		expect(dangerZoneDiv).toHaveClass(cls.dangerZone);
	});

	it('имеет правильный CSS класс для предупреждения', () => {
		const { container } = render(<DangerZone />);

		const warningDiv = container.querySelector(`.${cls.warning}`);
		expect(warningDiv).toBeInTheDocument();
	});

	it('отображает иконку AlertTriangle', () => {
		render(<DangerZone />);

		expect(screen.getByTestId('alert-icon')).toBeInTheDocument();
	});
});
