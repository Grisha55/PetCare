import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TipsEmptyState } from './TipsEmptyState';
import cls from './TipsEmptyState.module.scss';

// Типы для мок-компонента EmptyState
interface EmptyStateProps {
	icon: React.ReactNode;
	title: string;
	description: string;
	action?: React.ReactNode;
}

// Мокаем EmptyState компонент
vi.mock('../../../../shared/ui/EmptyState', () => ({
	EmptyState: ({ icon, title, description, action }: EmptyStateProps) => (
		<div data-testid="empty-state">
			<div data-testid="icon">{icon}</div>
			<h3>{title}</h3>
			<p>{description}</p>
			{action && <div data-testid="action">{action}</div>}
		</div>
	)
}));

// Мокаем иконки
vi.mock('lucide-react', () => ({
	Heart: () => <div data-testid="heart-icon" />,
	PawPrint: () => <div data-testid="paw-icon" />
}));

describe('TipsEmptyState', () => {
	const mockOnShowAllClick = vi.fn();

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('показывает состояние "нет сохраненных советов" при showOnlySaved=true', () => {
		render(
			<TipsEmptyState
				showOnlySaved={true}
				onShowAllClick={mockOnShowAllClick}
			/>
		);

		expect(
			screen.getByText('У вас пока нет сохраненных советов')
		).toBeInTheDocument();
		expect(
			screen.getByText('Нажимайте на сердечко у советов, чтобы сохранить их')
		).toBeInTheDocument();
		expect(screen.getByTestId('heart-icon')).toBeInTheDocument();
	});

	it('показывает состояние "советы не найдены" при showOnlySaved=false', () => {
		render(
			<TipsEmptyState
				showOnlySaved={false}
				onShowAllClick={mockOnShowAllClick}
			/>
		);

		expect(screen.getByText('Советы не найдены')).toBeInTheDocument();
		expect(
			screen.getByText('Попробуйте выбрать другую категорию')
		).toBeInTheDocument();
		expect(screen.getByTestId('paw-icon')).toBeInTheDocument();
	});

	it('показывает кнопку "Показать все советы" при showOnlySaved=true', () => {
		render(
			<TipsEmptyState
				showOnlySaved={true}
				onShowAllClick={mockOnShowAllClick}
			/>
		);

		const action = screen.getByTestId('action');
		expect(action).toBeInTheDocument();
		expect(screen.getByText('Показать все советы')).toBeInTheDocument();
	});

	it('не показывает кнопку при showOnlySaved=false', () => {
		render(
			<TipsEmptyState
				showOnlySaved={false}
				onShowAllClick={mockOnShowAllClick}
			/>
		);

		expect(screen.queryByTestId('action')).not.toBeInTheDocument();
		expect(screen.queryByText('Показать все советы')).not.toBeInTheDocument();
	});

	it('вызывает onShowAllClick при клике на кнопку', () => {
		render(
			<TipsEmptyState
				showOnlySaved={true}
				onShowAllClick={mockOnShowAllClick}
			/>
		);

		const button = screen.getByText('Показать все советы');
		fireEvent.click(button);

		expect(mockOnShowAllClick).toHaveBeenCalledTimes(1);
	});

	it('имеет правильный CSS класс для кнопки', () => {
		render(
			<TipsEmptyState
				showOnlySaved={true}
				onShowAllClick={mockOnShowAllClick}
			/>
		);

		const button = screen.getByText('Показать все советы');
		expect(button).toHaveClass(cls.showAllButton);
	});
});
