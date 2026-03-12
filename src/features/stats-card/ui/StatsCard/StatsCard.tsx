import cls from './StatsCard.module.scss';

interface StatsCardProps {
	daysWithPet: number;
	savedTipsCount: number;
	achievementsCount: number;
}

export const StatsCard = ({
	daysWithPet,
	savedTipsCount,
	achievementsCount
}: StatsCardProps) => {
	return (
		<div className={cls.statsCard}>
			<h3 className={cls.statsTitle}>Статистика</h3>
			<div className={cls.statsGrid}>
				<div className={cls.statItem}>
					<span className={cls.statValue}>{daysWithPet}</span>
					<span className={cls.statLabel}>Дней с питомцем</span>
				</div>
				<div className={cls.statItem}>
					<span className={cls.statValue}>{savedTipsCount}</span>
					<span className={cls.statLabel}>Сохраненных советов</span>
				</div>
				<div className={cls.statItem}>
					<span className={cls.statValue}>{achievementsCount}</span>
					<span className={cls.statLabel}>Достижений</span>
				</div>
			</div>
		</div>
	);
};
