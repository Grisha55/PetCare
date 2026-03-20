import type { MedicalRecord } from '../../../entities/medical-record/model/types';
import cls from './HealthStatus.module.scss';

interface HealthStatusProps {
	records: MedicalRecord[];
}

// Маппинг типов записей на категории и отображение
const typeConfig: Record<
	string,
	{ category: string; title: string; icon: string }
> = {
	vaccine: { category: 'vaccination', title: 'Прививки', icon: '💉' },
	medicine: { category: 'medicines', title: 'Лекарства', icon: '💊' },
	visit: { category: 'visits', title: 'Визиты к врачу', icon: '🏥' }
};

export const HealthStatus = ({ records }: HealthStatusProps) => {
	const getStatusByType = (type: string) => {
		const typeRecords = records.filter(record => record.type === type);

		if (typeRecords.length === 0) {
			return { status: 'empty', text: 'нет записей', emoji: '❌' };
		}

		// Сортируем по дате (новые сначала)
		const sorted = [...typeRecords].sort(
			(a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
		);

		const latest = sorted[0];
		const today = new Date();
		// Обнуляем время у today для корректного сравнения
		today.setHours(0, 0, 0, 0);

		const recordDate = new Date(latest.date);
		recordDate.setHours(0, 0, 0, 0);

		const diffTime = recordDate.getTime() - today.getTime();
		const daysDiff = Math.ceil(diffTime / (1000 * 3600 * 24));

		// Определяем статус на основе давности
		if (daysDiff > 0) {
			// Будущая запись
			return {
				status: 'upcoming',
				text: `📅 через ${daysDiff} ${getDaysWord(daysDiff)}`,
				emoji: '📅',
				date: latest.date,
				title: latest.title
			};
		} else if (daysDiff === 0) {
			// Сегодня
			return {
				status: 'good',
				text: `✅ сегодня`,
				emoji: '✅',
				date: latest.date,
				title: latest.title
			};
		}

		const daysAgo = Math.abs(daysDiff);

		// Прошлые записи
		if (daysAgo < 30) {
			return {
				status: 'good',
				text: `✅ ${daysAgo} ${getDaysWord(daysAgo)} назад`,
				emoji: '✅',
				date: latest.date,
				title: latest.title
			};
		} else if (daysAgo < 90) {
			const months = Math.floor(daysAgo / 30);
			return {
				status: 'warning',
				text: `🟡 ${months} ${getMonthsWord(months)} назад`,
				emoji: '🟡',
				date: latest.date,
				title: latest.title
			};
		} else {
			const months = Math.floor(daysAgo / 30);
			return {
				status: 'bad',
				text: `🔴 ${months} ${getMonthsWord(months)} назад`,
				emoji: '🔴',
				date: latest.date,
				title: latest.title
			};
		}
	};

	const getDaysWord = (days: number): string => {
		if (days === 1) return 'день';
		if (days >= 2 && days <= 4) return 'дня';
		return 'дней';
	};

	const getMonthsWord = (months: number): string => {
		if (months === 1) return 'месяц';
		if (months >= 2 && months <= 4) return 'месяца';
		return 'месяцев';
	};

	const getLatestRecordByType = (type: string) => {
		const typeRecords = records.filter(record => record.type === type);
		if (typeRecords.length === 0) return null;

		const sorted = [...typeRecords].sort(
			(a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
		);
		return sorted[0];
	};

	const getRecordsCountByType = (type: string) => {
		return records.filter(record => record.type === type).length;
	};

	// Получаем все уникальные типы записей
	const availableTypes = Object.keys(typeConfig);

	return (
		<section className={cls.section}>
			<h3 className={cls.title}>Здоровье</h3>

			<div className={cls.statusList}>
				{availableTypes.map(type => {
					const config = typeConfig[type];
					const status = getStatusByType(type);
					const latestRecord = getLatestRecordByType(type);
					const count = getRecordsCountByType(type);

					return (
						<div
							key={type}
							className={`${cls.row} ${cls[status.status]}`}
						>
							<div className={cls.categoryInfo}>
								<span className={cls.categoryIcon}>{config.icon}</span>
								<div className={cls.categoryText}>
									<span className={cls.categoryTitle}>{config.title}</span>
									{count > 0 && (
										<span className={cls.recordCount}>{count} записей</span>
									)}
								</div>
							</div>

							<div className={cls.statusInfo}>
								<span className={cls.statusText}>{status.text}</span>
								{latestRecord && (
									<div className={cls.tooltip}>
										<div className={cls.tooltipTitle}>{latestRecord.title}</div>
										<div className={cls.tooltipDate}>
											{new Date(latestRecord.date).toLocaleDateString('ru-RU', {
												day: 'numeric',
												month: 'long',
												year: 'numeric'
											})}
										</div>
										{latestRecord.description && (
											<div className={cls.tooltipDesc}>
												{latestRecord.description}
											</div>
										)}
									</div>
								)}
							</div>
						</div>
					);
				})}
			</div>

			{records.length > 0 && (
				<div className={cls.stats}>
					<span className={cls.statItem}>
						📊 Всего записей: {records.length}
					</span>
					<span className={cls.statItem}>
						📅 Последняя:{' '}
						{new Date(
							Math.max(...records.map(r => new Date(r.date).getTime()))
						).toLocaleDateString()}
					</span>
				</div>
			)}
		</section>
	);
};
