import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { LikedFilter } from './LikedFilter';
import styles from './LikedFilter.module.scss';

// Мокаем иконку Heart
vi.mock('lucide-react', () => ({
	Heart: ({ fill, className }: { fill?: string; className?: string }) => (
		<div
			data-testid="heart-icon"
			data-fill={fill}
			className={className}
		/>
	)
}));

describe('LikedFilter', () => {
	const mockOnToggle = vi.fn();

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('не рендерит компонент, если пользователь не авторизован', () => {
		render(
			<LikedFilter
				showOnlyLiked={false}
				onToggle={mockOnToggle}
				likedCount={0}
				isAuthenticated={false}
			/>
		);

		expect(screen.queryByText('Только понравившиеся')).not.toBeInTheDocument();
		expect(screen.queryByTestId('heart-icon')).not.toBeInTheDocument();
	});

	it('рендерит кнопку "Только понравившиеся" для авторизованного пользователя', () => {
		render(
			<LikedFilter
				showOnlyLiked={false}
				onToggle={mockOnToggle}
				likedCount={5}
				isAuthenticated={true}
			/>
		);

		expect(screen.getByText('Только понравившиеся')).toBeInTheDocument();
		expect(screen.getByTestId('heart-icon')).toBeInTheDocument();
	});

	it('показывает "Все советы" когда showOnlyLiked=true', () => {
		render(
			<LikedFilter
				showOnlyLiked={true}
				onToggle={mockOnToggle}
				likedCount={5}
				isAuthenticated={true}
			/>
		);

		expect(screen.getByText('Все советы')).toBeInTheDocument();
		expect(screen.queryByText('Только понравившиеся')).not.toBeInTheDocument();
	});

	it('показывает количество понравившихся советов когда showOnlyLiked=true', () => {
		render(
			<LikedFilter
				showOnlyLiked={true}
				onToggle={mockOnToggle}
				likedCount={5}
				isAuthenticated={true}
			/>
		);

		expect(screen.getByText('(5)')).toBeInTheDocument();
	});

	it('не показывает количество понравившихся советов когда showOnlyLiked=false', () => {
		render(
			<LikedFilter
				showOnlyLiked={false}
				onToggle={mockOnToggle}
				likedCount={5}
				isAuthenticated={true}
			/>
		);

		expect(screen.queryByText('(5)')).not.toBeInTheDocument();
	});

	it('вызывает onToggle при клике на кнопку', () => {
		render(
			<LikedFilter
				showOnlyLiked={false}
				onToggle={mockOnToggle}
				likedCount={5}
				isAuthenticated={true}
			/>
		);

		const button = screen.getByRole('button');
		fireEvent.click(button);

		expect(mockOnToggle).toHaveBeenCalledTimes(1);
	});

	it('имеет активный класс когда showOnlyLiked=true', () => {
		render(
			<LikedFilter
				showOnlyLiked={true}
				onToggle={mockOnToggle}
				likedCount={5}
				isAuthenticated={true}
			/>
		);

		const button = screen.getByRole('button');
		expect(button).toHaveClass(styles.active);
	});

	it('не имеет активного класса когда showOnlyLiked=false', () => {
		render(
			<LikedFilter
				showOnlyLiked={false}
				onToggle={mockOnToggle}
				likedCount={5}
				isAuthenticated={true}
			/>
		);

		const button = screen.getByRole('button');
		expect(button).not.toHaveClass(styles.active);
	});

	it('имеет правильный fill для иконки сердца при showOnlyLiked=true', () => {
		render(
			<LikedFilter
				showOnlyLiked={true}
				onToggle={mockOnToggle}
				likedCount={5}
				isAuthenticated={true}
			/>
		);

		const heartIcon = screen.getByTestId('heart-icon');
		expect(heartIcon).toHaveAttribute('data-fill', '#ef4444');
	});

	it('имеет правильный fill для иконки сердца при showOnlyLiked=false', () => {
		render(
			<LikedFilter
				showOnlyLiked={false}
				onToggle={mockOnToggle}
				likedCount={5}
				isAuthenticated={true}
			/>
		);

		const heartIcon = screen.getByTestId('heart-icon');
		expect(heartIcon).toHaveAttribute('data-fill', 'none');
	});

	it('имеет правильный CSS класс для контейнера', () => {
		const { container } = render(
			<LikedFilter
				showOnlyLiked={false}
				onToggle={mockOnToggle}
				likedCount={5}
				isAuthenticated={true}
			/>
		);

		const wrapper = container.firstChild;
		expect(wrapper).toHaveClass(styles.likedFilter);
	});

	it('имеет правильный CSS класс для кнопки', () => {
		render(
			<LikedFilter
				showOnlyLiked={false}
				onToggle={mockOnToggle}
				likedCount={5}
				isAuthenticated={true}
			/>
		);

		const button = screen.getByRole('button');
		expect(button).toHaveClass(styles.likedButton);
	});

	it('имеет правильный CSS класс для иконки сердца', () => {
		render(
			<LikedFilter
				showOnlyLiked={false}
				onToggle={mockOnToggle}
				likedCount={5}
				isAuthenticated={true}
			/>
		);

		const heartIcon = screen.getByTestId('heart-icon');
		expect(heartIcon).toHaveClass(styles.heartIcon);
	});
});
