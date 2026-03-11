import { Heart } from 'lucide-react';
import styles from './TipCard.module.scss';
import type { Tip } from '../model/types';

interface TipCardProps {
	tip: Tip;
	onSaveToggle?: (tip: Tip) => Promise<void>;
}

export const TipCard = ({ tip, onSaveToggle }: TipCardProps) => {
	// Создаем детерминированную задержку на основе id
	// Используем последние цифры id для создания числа от 0 до 0.3
	const getAnimationDelay = (id: string) => {
		// Берем последние 2 символа id, конвертируем в число и нормализуем
		const lastChars = id.slice(-2);
		const num = parseInt(lastChars, 16) || 0; // парсим как hex
		const delay = (num % 30) / 100; // получаем число от 0 до 0.3
		return `${delay}s`;
	};

	const handleSaveClick = async (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		if (onSaveToggle) {
			const button = e.currentTarget as HTMLButtonElement;
			button.style.transform = 'scale(0.95)';
			setTimeout(() => {
				button.style.transform = '';
			}, 200);

			await onSaveToggle(tip);
		}
	};

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
			style={{ animationDelay: getAnimationDelay(tip.id) }}
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
