import { Sparkles, Heart, Dog, Cat } from 'lucide-react';
import {
	type CategoryFilterProps,
	type CategoryFilterValue
} from '../model/types';
import styles from './CategoryFilter.module.scss';
import type { JSX } from 'react';

const categories: {
	value: CategoryFilterValue;
	label: string;
	icon: JSX.Element;
}[] = [
	{ value: 'all', label: 'Все советы', icon: <Sparkles /> },
	{ value: 'health', label: 'Здоровье', icon: <Heart /> },
	{ value: 'training', label: 'Дрессировка', icon: <Dog /> },
	{ value: 'nutrition', label: 'Питание', icon: <Cat /> }
];

export const CategoryFilter = ({
	selectedCategory,
	onCategoryChange
}: CategoryFilterProps) => {
	return (
		<div className={styles.filters}>
			{categories.map(({ value, label, icon }) => (
				<button
					key={value}
					className={`${styles.filterButton} ${
						selectedCategory === value ? styles.active : ''
					}`}
					onClick={() => onCategoryChange(value)}
				>
					{icon}
					<span>{label}</span>
				</button>
			))}
		</div>
	);
};
