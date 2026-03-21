import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CategoryFilter } from './CategoryFilter';
import styles from './CategoryFilter.module.scss';

// Мокаем иконки
vi.mock('lucide-react', () => ({
	Sparkles: () => <div data-testid="sparkles-icon" />,
	Heart: () => <div data-testid="heart-icon" />,
	Dog: () => <div data-testid="dog-icon" />,
	Cat: () => <div data-testid="cat-icon" />
}));

describe('CategoryFilter', () => {
	const mockOnCategoryChange = vi.fn();

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('рендерит все кнопки категорий', () => {
		render(
			<CategoryFilter
				selectedCategory="all"
				onCategoryChange={mockOnCategoryChange}
			/>
		);

		expect(screen.getByText('Все советы')).toBeInTheDocument();
		expect(screen.getByText('Здоровье')).toBeInTheDocument();
		expect(screen.getByText('Дрессировка')).toBeInTheDocument();
		expect(screen.getByText('Питание')).toBeInTheDocument();
	});

	it('отображает правильные иконки для каждой категории', () => {
		render(
			<CategoryFilter
				selectedCategory="all"
				onCategoryChange={mockOnCategoryChange}
			/>
		);

		expect(screen.getByTestId('sparkles-icon')).toBeInTheDocument();
		expect(screen.getByTestId('heart-icon')).toBeInTheDocument();
		expect(screen.getByTestId('dog-icon')).toBeInTheDocument();
		expect(screen.getByTestId('cat-icon')).toBeInTheDocument();
	});

	it('показывает активную категорию', () => {
		render(
			<CategoryFilter
				selectedCategory="health"
				onCategoryChange={mockOnCategoryChange}
			/>
		);

		const activeButton = screen.getByText('Здоровье').closest('button');
		expect(activeButton).toHaveClass(styles.active);
	});

	it('не показывает другие категории как активные', () => {
		render(
			<CategoryFilter
				selectedCategory="health"
				onCategoryChange={mockOnCategoryChange}
			/>
		);

		const allButton = screen.getByText('Все советы').closest('button');
		const trainingButton = screen.getByText('Дрессировка').closest('button');
		const nutritionButton = screen.getByText('Питание').closest('button');

		expect(allButton).not.toHaveClass(styles.active);
		expect(trainingButton).not.toHaveClass(styles.active);
		expect(nutritionButton).not.toHaveClass(styles.active);
	});

	it('вызывает onCategoryChange с правильным значением при клике', () => {
		render(
			<CategoryFilter
				selectedCategory="all"
				onCategoryChange={mockOnCategoryChange}
			/>
		);

		const healthButton = screen.getByText('Здоровье');
		fireEvent.click(healthButton);

		expect(mockOnCategoryChange).toHaveBeenCalledTimes(1);
		expect(mockOnCategoryChange).toHaveBeenCalledWith('health');
	});

	it('вызывает onCategoryChange для каждой категории', () => {
		render(
			<CategoryFilter
				selectedCategory="all"
				onCategoryChange={mockOnCategoryChange}
			/>
		);

		fireEvent.click(screen.getByText('Здоровье'));
		fireEvent.click(screen.getByText('Дрессировка'));
		fireEvent.click(screen.getByText('Питание'));

		expect(mockOnCategoryChange).toHaveBeenCalledTimes(3);
		expect(mockOnCategoryChange).toHaveBeenCalledWith('health');
		expect(mockOnCategoryChange).toHaveBeenCalledWith('training');
		expect(mockOnCategoryChange).toHaveBeenCalledWith('nutrition');
	});

	it('имеет правильный CSS класс для контейнера', () => {
		const { container } = render(
			<CategoryFilter
				selectedCategory="all"
				onCategoryChange={mockOnCategoryChange}
			/>
		);

		const filtersDiv = container.firstChild;
		expect(filtersDiv).toHaveClass(styles.filters);
	});

	it('имеет правильный CSS класс для кнопок', () => {
		render(
			<CategoryFilter
				selectedCategory="all"
				onCategoryChange={mockOnCategoryChange}
			/>
		);

		const buttons = screen.getAllByRole('button');
		buttons.forEach(button => {
			expect(button).toHaveClass(styles.filterButton);
		});
	});
});
