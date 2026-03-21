import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ActiveFilter } from './ActiveFilter';
import styles from './ActiveFilter.module.scss';

// Мокаем иконку X
vi.mock('lucide-react', () => ({
	X: () => <div data-testid="x-icon" />
}));

describe('ActiveFilter', () => {
	const mockOnClear = vi.fn();

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('не рендерит компонент, когда selectedCategory = "all"', () => {
		render(
			<ActiveFilter
				selectedCategory="all"
				onClear={mockOnClear}
			/>
		);

		expect(screen.queryByText(/Категория:/)).not.toBeInTheDocument();
		expect(screen.queryByTestId('x-icon')).not.toBeInTheDocument();
	});

	it('рендерит фильтр, когда выбрана категория', () => {
		render(
			<ActiveFilter
				selectedCategory="health"
				onClear={mockOnClear}
			/>
		);

		expect(screen.getByText('Категория: health')).toBeInTheDocument();
		expect(screen.getByTestId('x-icon')).toBeInTheDocument();
	});

	it('отображает название категории', () => {
		render(
			<ActiveFilter
				selectedCategory="training"
				onClear={mockOnClear}
			/>
		);

		expect(screen.getByText('Категория: training')).toBeInTheDocument();
	});

	it('вызывает onClear при клике на кнопку', () => {
		render(
			<ActiveFilter
				selectedCategory="nutrition"
				onClear={mockOnClear}
			/>
		);

		const button = screen.getByRole('button');
		fireEvent.click(button);

		expect(mockOnClear).toHaveBeenCalledTimes(1);
	});

	it('имеет правильный CSS класс для контейнера', () => {
		const { container } = render(
			<ActiveFilter
				selectedCategory="health"
				onClear={mockOnClear}
			/>
		);

		const activeFilter = container.firstChild;
		expect(activeFilter).toHaveClass(styles.activeFilter);
	});

	it('имеет правильный CSS класс для кнопки', () => {
		render(
			<ActiveFilter
				selectedCategory="health"
				onClear={mockOnClear}
			/>
		);

		const button = screen.getByRole('button');
		expect(button).toHaveClass(styles.clearFilter);
	});
});
