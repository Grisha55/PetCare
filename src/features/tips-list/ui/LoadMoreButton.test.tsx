import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { LoadMoreButton } from './LoadMoreButton';
import cls from './LoadMoreButton.module.scss';

// Мокаем иконку ChevronDown
vi.mock('lucide-react', () => ({
	ChevronDown: () => <div data-testid="chevron-icon" />
}));

describe('LoadMoreButton', () => {
	const mockOnLoadMore = vi.fn();

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('рендерит кнопку "Показать еще" когда loading=false', () => {
		render(
			<LoadMoreButton
				onLoadMore={mockOnLoadMore}
				loading={false}
				totalCount={5}
			/>
		);

		expect(screen.getByText('Показать еще')).toBeInTheDocument();
		expect(screen.getByTestId('chevron-icon')).toBeInTheDocument();
	});

	it('рендерит состояние загрузки когда loading=true', () => {
		render(
			<LoadMoreButton
				onLoadMore={mockOnLoadMore}
				loading={true}
				totalCount={5}
			/>
		);

		expect(screen.getByText('Загрузка...')).toBeInTheDocument();
		expect(screen.queryByText('Показать еще')).not.toBeInTheDocument();
		expect(screen.queryByTestId('chevron-icon')).not.toBeInTheDocument();
	});

	it('отображает спиннер при loading=true', () => {
		const { container } = render(
			<LoadMoreButton
				onLoadMore={mockOnLoadMore}
				loading={true}
				totalCount={5}
			/>
		);

		const spinner = container.querySelector(`.${cls.spinner}`);
		expect(spinner).toBeInTheDocument();
	});

	it('показывает количество загруженных советов', () => {
		render(
			<LoadMoreButton
				onLoadMore={mockOnLoadMore}
				loading={false}
				totalCount={12}
			/>
		);

		expect(screen.getByText('Загружено 12 советов')).toBeInTheDocument();
	});

	it('обновляет количество советов', () => {
		const { rerender } = render(
			<LoadMoreButton
				onLoadMore={mockOnLoadMore}
				loading={false}
				totalCount={5}
			/>
		);

		expect(screen.getByText('Загружено 5 советов')).toBeInTheDocument();

		rerender(
			<LoadMoreButton
				onLoadMore={mockOnLoadMore}
				loading={false}
				totalCount={10}
			/>
		);

		expect(screen.getByText('Загружено 10 советов')).toBeInTheDocument();
	});

	it('вызывает onLoadMore при клике на кнопку', () => {
		render(
			<LoadMoreButton
				onLoadMore={mockOnLoadMore}
				loading={false}
				totalCount={5}
			/>
		);

		const button = screen.getByRole('button');
		fireEvent.click(button);

		expect(mockOnLoadMore).toHaveBeenCalledTimes(1);
	});

	it('кнопка заблокирована при loading=true', () => {
		render(
			<LoadMoreButton
				onLoadMore={mockOnLoadMore}
				loading={true}
				totalCount={5}
			/>
		);

		const button = screen.getByRole('button');
		expect(button).toBeDisabled();
	});

	it('кнопка активна при loading=false', () => {
		render(
			<LoadMoreButton
				onLoadMore={mockOnLoadMore}
				loading={false}
				totalCount={5}
			/>
		);

		const button = screen.getByRole('button');
		expect(button).not.toBeDisabled();
	});

	it('имеет правильный CSS класс для контейнера', () => {
		const { container } = render(
			<LoadMoreButton
				onLoadMore={mockOnLoadMore}
				loading={false}
				totalCount={5}
			/>
		);

		const wrapper = container.firstChild;
		expect(wrapper).toHaveClass(cls.container);
	});

	it('имеет правильный CSS класс для кнопки', () => {
		render(
			<LoadMoreButton
				onLoadMore={mockOnLoadMore}
				loading={false}
				totalCount={5}
			/>
		);

		const button = screen.getByRole('button');
		expect(button).toHaveClass(cls.button);
	});

	it('имеет правильный CSS класс для счетчика', () => {
		render(
			<LoadMoreButton
				onLoadMore={mockOnLoadMore}
				loading={false}
				totalCount={5}
			/>
		);

		const countText = screen.getByText('Загружено 5 советов');
		expect(countText).toHaveClass(cls.count);
	});
});
