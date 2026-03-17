import type { CategoryFilterValue } from '../../../features/tips-filters';
import { TipsFilters } from '../../tips-filters';
import styles from './TipsHeader.module.scss';

interface TipsHeaderProps {
	selectedCategory: CategoryFilterValue;
	onCategoryChange: (category: CategoryFilterValue) => void;
	showOnlySaved?: boolean;
	onSavedToggle?: () => void;
	savedCount?: number;
	isAuthenticated?: boolean;
}

export const TipsHeader = ({
	selectedCategory,
	onCategoryChange
}: TipsHeaderProps) => {
	return (
		<div className={styles.header}>
			<h1 className={styles.title}>Полезные советы</h1>

			<div className={styles.controls}>
				<TipsFilters
					selectedCategory={selectedCategory}
					onCategoryChange={onCategoryChange}
				/>
			</div>
		</div>
	);
};
