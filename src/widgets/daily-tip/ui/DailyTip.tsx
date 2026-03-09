import { Calendar, Share2, Sparkles, Sun, Coffee } from 'lucide-react';
import type { Tip } from '../../../entities/tip';
import cls from './DailyTip.module.scss';

interface DailyTipProps {
	tips: Tip[];
	isLoading?: boolean;
}

export const DailyTip = ({ tips, isLoading = false }: DailyTipProps) => {
	// Функция для получения иконки в зависимости от категории
	const getCategoryIcon = (category?: string) => {
		switch (category) {
			case 'health':
				return <Sparkles />;
			case 'training':
				return <Sun />;
			case 'nutrition':
				return <Coffee />;
			default:
				return <Sparkles />;
		}
	};

	// Форматирование даты
	const today = new Date().toLocaleDateString('ru-RU', {
		day: 'numeric',
		month: 'long',
		year: 'numeric'
	});

	if (isLoading) {
		return (
			<section className={cls.card}>
				<div className={cls.decor}>
					<Sparkles />
				</div>
				<div className={cls.header}>
					<div className={cls.iconWrapper}>
						<Sparkles />
					</div>
					<h2 className={cls.title}>Совет дня</h2>
				</div>
				<div className={cls.skeleton}>
					<div className={cls.skeletonLine} />
					<div className={cls.skeletonLine} />
					<div className={cls.skeletonLine} />
				</div>
				<div className={cls.shine} />
			</section>
		);
	}

	if (!tips || tips.length === 0) {
		return (
			<section className={cls.card}>
				<div className={cls.decor}>
					<Sparkles />
				</div>
				<div className={cls.header}>
					<div className={cls.iconWrapper}>
						<Sparkles />
					</div>
					<h2 className={cls.title}>Совет дня</h2>
				</div>
				<div className={cls.empty}>
					<div className={cls.emptyIcon}>
						<Sun />
					</div>
					<p className={cls.emptyText}>Сегодня советов нет. Загляните позже!</p>
				</div>
				<div className={cls.shine} />
			</section>
		);
	}

	const dailyTip = tips[0];

	return (
		<section className={cls.card}>
			<div className={cls.decor}>
				<Sparkles />
			</div>

			<div className={cls.header}>
				<div className={cls.iconWrapper}>
					{getCategoryIcon(dailyTip.category)}
				</div>
				<h2 className={cls.title}>Совет дня</h2>
			</div>

			<div className={cls.content}>
				<div className={cls.text}>
					<p>{dailyTip.content}</p>
				</div>

				<div className={cls.meta}>
					<div className={cls.category}>
						{getCategoryIcon(dailyTip.category)}
						<span>{dailyTip.category || 'полезное'}</span>
					</div>

					<div className={cls.date}>
						<Calendar size={14} />
						<span>{today}</span>
					</div>

					<button
						className={cls.shareButton}
						onClick={() => {
							// Логика шаринга
							navigator.share?.({
								title: 'Совет дня',
								text: dailyTip.content
							});
						}}
						title="Поделиться"
					>
						<Share2 />
					</button>
				</div>
			</div>

			<div className={cls.shine} />
		</section>
	);
};
