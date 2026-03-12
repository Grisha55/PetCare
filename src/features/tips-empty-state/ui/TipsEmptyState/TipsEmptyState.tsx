import { Heart, PawPrint } from 'lucide-react';
import { EmptyState } from '../../../../shared/ui/EmptyState';
import cls from './TipsEmptyState.module.scss';

interface TipsEmptyStateProps {
	showOnlySaved: boolean;
	onShowAllClick: () => void;
}

export const TipsEmptyState = ({
	showOnlySaved,
	onShowAllClick
}: TipsEmptyStateProps) => {
	return (
		<EmptyState
			icon={showOnlySaved ? <Heart /> : <PawPrint />}
			title={
				showOnlySaved
					? 'У вас пока нет сохраненных советов'
					: 'Советы не найдены'
			}
			description={
				showOnlySaved
					? 'Нажимайте на сердечко у советов, чтобы сохранить их'
					: 'Попробуйте выбрать другую категорию'
			}
			action={
				showOnlySaved ? (
					<button
						onClick={onShowAllClick}
						className={cls.showAllButton}
					>
						Показать все советы
					</button>
				) : undefined
			}
		/>
	);
};
