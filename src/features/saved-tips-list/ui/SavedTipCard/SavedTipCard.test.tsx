import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { SavedTip } from '../../../../entities/saved-tip';
import { SavedTipCard } from './SavedTipCard';
import cls from './SavedTipCard.module.scss';

// Мокаем иконки
vi.mock('lucide-react', () => ({
	Heart: () => <div data-testid="heart-icon" />,
	Trash2: () => <div data-testid="trash-icon" />
}));

describe('SavedTipCard', () => {
	const mockTip: SavedTip = {
		id: '1',
		title: 'Полезный совет',
		content: 'Это очень длинный текст, который должен быть обрезан...',
		category: 'health',
		saved_at: '2024-01-15T10:00:00Z',
		user_id: 'user-1'
	};

	const mockTipWithEmptyContent: SavedTip = {
		...mockTip,
		content: ''
	};

	const mockOnDelete = vi.fn();
	const mockGetCategoryName = vi.fn().mockReturnValue('Здоровье');
	const mockTruncateContent = vi.fn().mockReturnValue('Обрезанный текст...');
	const mockFormatDate = vi.fn().mockReturnValue('15 января 2024');

	const defaultProps = {
		tip: mockTip,
		onDelete: mockOnDelete,
		isDeleting: false,
		getCategoryName: mockGetCategoryName,
		truncateContent: mockTruncateContent,
		formatDate: mockFormatDate
	};

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('рендерит заголовок совета', () => {
		render(<SavedTipCard {...defaultProps} />);
		expect(screen.getByText('Полезный совет')).toBeInTheDocument();
	});

	it('рендерит категорию', () => {
		render(<SavedTipCard {...defaultProps} />);
		expect(screen.getByText('Здоровье')).toBeInTheDocument();
		expect(mockGetCategoryName).toHaveBeenCalledWith('health');
	});

	it('не рендерит категорию, если поле category отсутствует', () => {
		// Создаем объект без поля category
		const tipWithoutCategory = {
			id: mockTip.id,
			title: mockTip.title,
			content: mockTip.content,
			saved_at: mockTip.saved_at,
			user_id: mockTip.user_id
		} as SavedTip;

		render(
			<SavedTipCard
				{...defaultProps}
				tip={tipWithoutCategory}
			/>
		);
		expect(screen.queryByText('Здоровье')).not.toBeInTheDocument();
	});

	it('рендерит описание, если оно есть', () => {
		render(<SavedTipCard {...defaultProps} />);
		expect(screen.getByText('Обрезанный текст...')).toBeInTheDocument();
		expect(mockTruncateContent).toHaveBeenCalledWith(mockTip.content, 100);
	});

	it('не рендерит описание, если контент пустой', () => {
		render(
			<SavedTipCard
				{...defaultProps}
				tip={mockTipWithEmptyContent}
			/>
		);
		expect(screen.queryByText('Обрезанный текст...')).not.toBeInTheDocument();
	});

	it('рендерит дату сохранения', () => {
		render(<SavedTipCard {...defaultProps} />);
		expect(screen.getByText('Сохранено: 15 января 2024')).toBeInTheDocument();
		expect(mockFormatDate).toHaveBeenCalledWith(mockTip.saved_at);
	});

	it('рендерит иконки сердечка и корзины', () => {
		render(<SavedTipCard {...defaultProps} />);
		expect(screen.getByTestId('heart-icon')).toBeInTheDocument();
		expect(screen.getByTestId('trash-icon')).toBeInTheDocument();
	});

	it('вызывает onDelete при клике на кнопку удаления', () => {
		render(<SavedTipCard {...defaultProps} />);

		const deleteButton = screen.getByRole('button', { name: /удалить совет/i });
		fireEvent.click(deleteButton);

		expect(mockOnDelete).toHaveBeenCalledTimes(1);
		expect(mockOnDelete).toHaveBeenCalledWith('1');
	});

	it('кнопка удаления заблокирована при isDeleting=true', () => {
		render(
			<SavedTipCard
				{...defaultProps}
				isDeleting={true}
			/>
		);

		const deleteButton = screen.getByRole('button', { name: /удалить совет/i });
		expect(deleteButton).toBeDisabled();
	});

	it('показывает спиннер при isDeleting=true', () => {
		const { container } = render(
			<SavedTipCard
				{...defaultProps}
				isDeleting={true}
			/>
		);

		const spinner = container.querySelector(`.${cls.deletingSpinner}`);
		expect(spinner).toBeInTheDocument();
	});

	it('не показывает спиннер при isDeleting=false', () => {
		const { container } = render(<SavedTipCard {...defaultProps} />);

		const spinner = container.querySelector(`.${cls.deletingSpinner}`);
		expect(spinner).not.toBeInTheDocument();
	});

	it('имеет правильные CSS классы', () => {
		const { container } = render(<SavedTipCard {...defaultProps} />);

		const card = container.firstChild;
		expect(card).toHaveClass(cls.tipCard);

		const deleteButton = screen.getByRole('button', { name: /удалить совет/i });
		expect(deleteButton).toHaveClass(cls.deleteButton);
	});
});
