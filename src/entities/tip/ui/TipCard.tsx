import { Heart } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { Tip } from '../model/types';
import styles from './TipCard.module.scss';

interface TipCardProps {
	tip: Tip;
	onSaveToggle?: (tip: Tip) => Promise<void>;
}

export const TipCard = ({ tip, onSaveToggle }: TipCardProps) => {
	const [isSaving, setIsSaving] = useState(false);
	// Используем локальное состояние для отслеживания статуса сохранения
	const [isSaved, setIsSaved] = useState(tip.saved || false);

	// Синхронизируем локальное состояние с пропсом при изменении tip
	useEffect(() => {
		setIsSaved(tip.saved || false);
	}, [tip.saved, tip.id]);

	const handleSaveClick = async (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();

		if (!onSaveToggle || isSaving) return;

		// Оптимистичное обновление UI
		const previousState = isSaved;
		setIsSaved(!previousState);
		setIsSaving(true);

		try {
			await onSaveToggle(tip);
			// После успешного сохранения оставляем новое состояние
			console.log('Save toggled successfully for tip:', tip.id);
		} catch (error) {
			// В случае ошибки возвращаем предыдущее состояние
			console.error('Failed to toggle save:', error);
			setIsSaved(previousState);
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
					className={`${styles.saveButton} ${isSaved ? styles.saved : ''}`}
					onClick={handleSaveClick}
					disabled={isSaving}
					aria-label={isSaved ? 'Удалить из сохраненных' : 'Сохранить совет'}
				>
					<Heart
						size={20}
						fill={isSaved ? 'currentColor' : 'none'}
					/>
					<span>{isSaving ? '...' : isSaved ? 'Сохранено' : 'Сохранить'}</span>
				</button>
			)}
		</div>
	);
};
