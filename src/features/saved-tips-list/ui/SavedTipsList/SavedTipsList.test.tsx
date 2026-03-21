import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { SavedTip } from '../../../../entities/saved-tip';
import { SavedTipsList } from './SavedTipsList';

// Типы для мок-компонентов
interface MockSavedTipCardProps {
	tip: SavedTip;
	onDelete: (tipId: string) => void;
	isDeleting: boolean;
	getCategoryName: (category: string) => string;
	truncateContent: (content: string | undefined, maxLength: number) => string;
	formatDate: (dateString: string) => string;
}

interface MockEmptyStateProps {
	icon: React.ReactNode;
	title: string;
	description: string;
	action: React.ReactNode;
}

// Мокаем дочерние компоненты
vi.mock('lucide-react', () => ({
	Heart: () => <div data-testid="heart-icon" />,
	ChevronRight: () => <div data-testid="chevron-icon" />,
	PawPrint: () => <div data-testid="paw-icon" />
}));

vi.mock('../SavedTipCard/SavedTipCard', () => ({
	SavedTipCard: ({ tip, onDelete, isDeleting }: MockSavedTipCardProps) => (
		<div data-testid={`tip-card-${tip.id}`}>
			<span>{tip.title}</span>
			<button
				onClick={() => onDelete(tip.id)}
				disabled={isDeleting}
			>
				Удалить
			</button>
		</div>
	)
}));

vi.mock('../../../../shared/ui/EmptyState', () => ({
	EmptyState: ({ title, description, action }: MockEmptyStateProps) => (
		<div data-testid="empty-state">
			<h3>{title}</h3>
			<p>{description}</p>
			{action}
		</div>
	)
}));

describe('SavedTipsList', () => {
	const mockTips: SavedTip[] = [
		{
			id: '1',
			title: 'Совет 1',
			content: 'Контент 1',
			category: 'health',
			saved_at: '2024-01-01',
			user_id: 'user-1'
		},
		{
			id: '2',
			title: 'Совет 2',
			content: 'Контент 2',
			category: 'training',
			saved_at: '2024-01-02',
			user_id: 'user-1'
		},
		{
			id: '3',
			title: 'Совет 3',
			content: 'Контент 3',
			category: 'nutrition',
			saved_at: '2024-01-03',
			user_id: 'user-1'
		},
		{
			id: '4',
			title: 'Совет 4',
			content: 'Контент 4',
			category: 'health',
			saved_at: '2024-01-04',
			user_id: 'user-1'
		}
	];

	const mockOnDeleteTip = vi.fn();
	const mockOnViewAllTips = vi.fn();
	const mockGetCategoryName = vi.fn().mockReturnValue('Категория');
	const mockTruncateContent = vi.fn().mockReturnValue('Обрезанный текст');
	const mockFormatDate = vi.fn().mockReturnValue('01.01.2024');

	const defaultProps = {
		savedTips: mockTips,
		loading: false,
		deletingTipId: null,
		onDeleteTip: mockOnDeleteTip,
		onViewAllTips: mockOnViewAllTips,
		getCategoryName: mockGetCategoryName,
		truncateContent: mockTruncateContent,
		formatDate: mockFormatDate
	};

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('показывает загрузку', () => {
		render(
			<SavedTipsList
				{...defaultProps}
				loading={true}
			/>
		);
		expect(screen.getByText('Загрузка советов...')).toBeInTheDocument();
	});

	it('показывает список советов', () => {
		render(<SavedTipsList {...defaultProps} />);

		expect(screen.getByTestId('tip-card-1')).toBeInTheDocument();
		expect(screen.getByTestId('tip-card-2')).toBeInTheDocument();
		expect(screen.getByTestId('tip-card-3')).toBeInTheDocument();
	});

	it('показывает количество советов', () => {
		render(<SavedTipsList {...defaultProps} />);
		expect(screen.getByText('4')).toBeInTheDocument();
	});

	it('показывает кнопку "Все советы"', () => {
		render(<SavedTipsList {...defaultProps} />);
		expect(screen.getByText('Все советы')).toBeInTheDocument();
	});

	it('показывает кнопку "Показать еще" если советов больше 3', () => {
		render(<SavedTipsList {...defaultProps} />);
		expect(screen.getByText('Показать еще 1')).toBeInTheDocument();
	});

	it('не показывает кнопку "Показать еще" если советов 3 или меньше', () => {
		const threeTips = mockTips.slice(0, 3);
		render(
			<SavedTipsList
				{...defaultProps}
				savedTips={threeTips}
			/>
		);
		expect(screen.queryByText(/Показать еще/)).not.toBeInTheDocument();
	});

	it('вызывает onViewAllTips при клике на "Все советы"', () => {
		render(<SavedTipsList {...defaultProps} />);
		fireEvent.click(screen.getByText('Все советы'));
		expect(mockOnViewAllTips).toHaveBeenCalledTimes(1);
	});

	it('вызывает onViewAllTips при клике на "Показать еще"', () => {
		render(<SavedTipsList {...defaultProps} />);
		fireEvent.click(screen.getByText('Показать еще 1'));
		expect(mockOnViewAllTips).toHaveBeenCalledTimes(1);
	});

	it('вызывает onDeleteTip при удалении совета', () => {
		render(<SavedTipsList {...defaultProps} />);

		const deleteButton = screen.getAllByText('Удалить')[0];
		fireEvent.click(deleteButton);

		expect(mockOnDeleteTip).toHaveBeenCalledTimes(1);
		expect(mockOnDeleteTip).toHaveBeenCalledWith('1');
	});

	it('блокирует кнопку удаления для удаляемого совета', () => {
		render(
			<SavedTipsList
				{...defaultProps}
				deletingTipId="1"
			/>
		);

		const deleteButtons = screen.getAllByRole('button', { name: /удалить/i });
		expect(deleteButtons[0]).toBeDisabled();
		expect(deleteButtons[1]).not.toBeDisabled();
	});

	it('показывает пустое состояние, если нет советов', () => {
		render(
			<SavedTipsList
				{...defaultProps}
				savedTips={[]}
			/>
		);

		expect(screen.getByTestId('empty-state')).toBeInTheDocument();
		expect(
			screen.getByText('У вас пока нет сохраненных советов')
		).toBeInTheDocument();
	});

	it('не показывает количество советов, если их нет', () => {
		render(
			<SavedTipsList
				{...defaultProps}
				savedTips={[]}
			/>
		);
		expect(screen.queryByText('0')).not.toBeInTheDocument();
	});

	it('не показывает кнопку "Все советы", если советов нет', () => {
		render(
			<SavedTipsList
				{...defaultProps}
				savedTips={[]}
			/>
		);
		expect(screen.queryByText('Все советы')).not.toBeInTheDocument();
	});

	it('вызывает onViewAllTips при клике на кнопку в пустом состоянии', () => {
		render(
			<SavedTipsList
				{...defaultProps}
				savedTips={[]}
			/>
		);

		const browseButton = screen.getByText('Посмотреть советы');
		fireEvent.click(browseButton);

		expect(mockOnViewAllTips).toHaveBeenCalledTimes(1);
	});
});
