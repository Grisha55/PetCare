import { Heart, ChevronRight, PawPrint } from 'lucide-react';
import { EmptyState } from '../../../../shared/ui/EmptyState';
import { SavedTipCard } from '../SavedTipCard/SavedTipCard';
import type { SavedTip } from '../../../../entities/saved-tip';
import cls from './SavedTipsList.module.scss';

interface SavedTipsListProps {
	savedTips: SavedTip[];
	loading: boolean;
	deletingTipId: string | null;
	onDeleteTip: (tipId: string) => void;
	onViewAllTips: () => void;
	getCategoryName: (category: string) => string;
	truncateContent: (content: string | undefined, maxLength: number) => string;
	formatDate: (dateString: string) => string;
}

export const SavedTipsList = ({
	savedTips,
	loading,
	deletingTipId,
	onDeleteTip,
	onViewAllTips,
	getCategoryName,
	truncateContent,
	formatDate
}: SavedTipsListProps) => {
	return (
		<div className={cls.savedTipsSection}>
			<div className={cls.sectionHeader}>
				<div className={cls.sectionTitle}>
					<Heart
						size={20}
						className={cls.heartIcon}
					/>
					<h2>Сохраненные советы</h2>
					{savedTips.length > 0 && (
						<span className={cls.count}>{savedTips.length}</span>
					)}
				</div>

				{savedTips.length > 0 && (
					<button
						onClick={onViewAllTips}
						className={cls.viewAllLink}
					>
						<span>Все советы</span>
						<ChevronRight size={16} />
					</button>
				)}
			</div>

			{loading ? (
				<div className={cls.loadingTips}>
					<div className={cls.spinner} />
					<p>Загрузка советов...</p>
				</div>
			) : savedTips.length > 0 ? (
				<div className={cls.tipsGrid}>
					{savedTips.map(tip => (
						<SavedTipCard
							key={tip.id}
							tip={tip}
							onDelete={onDeleteTip}
							isDeleting={deletingTipId === tip.id}
							getCategoryName={getCategoryName}
							truncateContent={truncateContent}
							formatDate={formatDate}
						/>
					))}

					{savedTips.length > 3 && (
						<button
							onClick={onViewAllTips}
							className={cls.showMoreButton}
						>
							Показать еще {savedTips.length - 3}
						</button>
					)}
				</div>
			) : (
				<EmptyState
					icon={<Heart size={32} />}
					title="У вас пока нет сохраненных советов"
					description="Нажимайте на сердечко у советов, чтобы сохранить их"
					action={
						<button
							onClick={onViewAllTips}
							className={cls.browseTipsButton}
						>
							<PawPrint size={18} />
							<span>Посмотреть советы</span>
						</button>
					}
				/>
			)}
		</div>
	);
};
