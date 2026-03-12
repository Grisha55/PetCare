import { Heart, Trash2 } from 'lucide-react';
import type { SavedTip } from '../../../../entities/saved-tip';
import cls from './SavedTipCard.module.scss';

interface SavedTipCardProps {
	tip: SavedTip;
	onDelete: (tipId: string) => void;
	isDeleting: boolean;
	getCategoryName: (category: string) => string;
	truncateContent: (content: string | undefined, maxLength: number) => string;
	formatDate: (dateString: string) => string;
}

export const SavedTipCard = ({
	tip,
	onDelete,
	isDeleting,
	getCategoryName,
	truncateContent,
	formatDate
}: SavedTipCardProps) => {
	return (
		<div className={cls.tipCard}>
			<div className={cls.tipContent}>
				<div className={cls.tipHeader}>
					<h3>{tip.title}</h3>
					{tip.category && (
						<span className={cls.tipCategory}>
							{getCategoryName(tip.category)}
						</span>
					)}
				</div>

				{tip.content && (
					<p className={cls.tipDescription}>
						{truncateContent(tip.content, 100)}
					</p>
				)}

				<div className={cls.tipFooter}>
					<span className={cls.savedDate}>
						Сохранено: {formatDate(tip.saved_at)}
					</span>
					<div className={cls.tipActions}>
						<Heart
							size={16}
							className={cls.tipSavedIcon}
							fill="currentColor"
						/>
						<button
							onClick={() => onDelete(tip.id)}
							disabled={isDeleting}
							className={cls.deleteButton}
							aria-label="Удалить совет"
						>
							<Trash2 size={16} />
							{isDeleting && <span className={cls.deletingSpinner} />}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};
