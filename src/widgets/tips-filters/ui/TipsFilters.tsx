import { type CategoryFilterValue } from '../../../features/tips-filters';
import styles from './TipsFilters.module.scss';

interface Props {
	selectedCategory: CategoryFilterValue;
	onCategoryChange: (category: CategoryFilterValue) => void;
}

export const TipsFilters = ({ selectedCategory, onCategoryChange }: Props) => {
	const categories: { value: CategoryFilterValue; label: string }[] = [
		{ value: 'all', label: 'Все' },
		{ value: 'health', label: 'Здоровье' },
		{ value: 'training', label: 'Дрессировка' },
		{ value: 'nutrition', label: 'Питание' }
	];

	return (
		<div className={styles.filterBar}>
			{categories.map(({ value, label }) => (
				<button
					key={value}
					className={`${styles.filterButton} ${selectedCategory === value ? styles.active : ''}`}
					onClick={() => onCategoryChange(value)}
				>
					{label}
				</button>
			))}
		</div>
	);
};
