import { Heart } from 'lucide-react';
import { useState } from 'react';
import styles from './TipCard.module.scss';
import type { Tip } from '../model/types';

interface TipCardProps {
	tip: Tip;
	onSaveToggle?: (tip: Tip) => Promise<void>;
}

export const TipCard = ({ tip, onSaveToggle }: TipCardProps) => {
	const [isSaving, setIsSaving] = useState(false);

	const handleSaveClick = async (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();

		if (!onSaveToggle || isSaving) return;

		try {
			setIsSaving(true);
			await onSaveToggle(tip);
		} catch (error) {
			console.error('Failed to toggle save:', error);
		} finally {
			setIsSaving(false);
		}
	};

	// Определяем эмодзи для категорий
	const getCategoryEmoji = (category: string) => {
		switch (category) {
			case 'health':
				return '🏥';
			case 'training':
				return '🎯';
			case 'nutrition':
				return '🥗';
			default:
				return '📌';
		}
	};

	// Определяем название категории на русском
	const getCategoryName = (category: string) => {
		switch (category) {
			case 'health':
				return 'Здоровье';
			case 'training':
				return 'Дрессировка';
			case 'nutrition':
				return 'Питание';
			default:
				return category;
		}
	};

	return (
		<div
			className={styles.card}
			data-category={tip.category}
		>
			<div className={styles.category}>
				<span>{getCategoryEmoji(tip.category)}</span>
				{getCategoryName(tip.category)}
			</div>

			<h3 className={styles.title}>{tip.title}</h3>
			<p className={styles.content}>{tip.content}</p>

			{onSaveToggle && (
				<button
					className={`${styles.saveButton} ${tip.saved ? styles.saved : ''}`}
					onClick={handleSaveClick}
					disabled={isSaving}
					aria-label={tip.saved ? 'Удалить из сохраненных' : 'Сохранить совет'}
				>
					<Heart
						size={20}
						fill={tip.saved ? 'currentColor' : 'none'}
					/>
					<span>{tip.saved ? 'Сохранено' : 'Сохранить'}</span>
				</button>
			)}
		</div>
	);
};
