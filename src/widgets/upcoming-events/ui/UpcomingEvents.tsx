import cls from './UpcomingEvents.module.scss';
import { getUpcomingEvents } from '../../../entities/event/model/selectors';
import type { MedicalRecord } from '../../../entities/medical-record/model/types';

interface Props {
	records: MedicalRecord[];
	onDelete: (id: string) => void;
}

// Типы событий из селектора
interface Event {
	id: string;
	title: string;
	date: string;
	status: 'upcoming' | 'past';
}

const statusConfig = {
	upcoming: { label: 'Предстоит', color: '#4caf50', emoji: '✅' },
	past: { label: 'Прошлое', color: '#9e9e9e', emoji: '📅' }
};

export const UpcomingEvents = ({ records, onDelete }: Props) => {
	const events = getUpcomingEvents(records) as Event[];

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		const today = new Date();
		const tomorrow = new Date(today);
		tomorrow.setDate(tomorrow.getDate() + 1);

		today.setHours(0, 0, 0, 0);
		tomorrow.setHours(0, 0, 0, 0);
		const eventDate = new Date(date);
		eventDate.setHours(0, 0, 0, 0);

		if (eventDate.getTime() === today.getTime()) {
			return 'Сегодня';
		} else if (eventDate.getTime() === tomorrow.getTime()) {
			return 'Завтра';
		} else {
			return date.toLocaleDateString('ru-RU', {
				day: 'numeric',
				month: 'long'
			});
		}
	};

	const getDaysUntil = (dateString: string) => {
		const eventDate = new Date(dateString);
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		eventDate.setHours(0, 0, 0, 0);

		const diffTime = eventDate.getTime() - today.getTime();
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
		return diffDays;
	};

	const upcomingEvents = events.filter(event => event.status === 'upcoming');

	return (
		<section className={cls.section}>
			<div className={cls.header}>
				<h3 className={cls.title}>
					<span className={cls.titleIcon}>📅</span>
					Ближайшие события
				</h3>
				{upcomingEvents.length > 0 && (
					<span className={cls.badge}>{upcomingEvents.length}</span>
				)}
			</div>

			<div className={cls.list}>
				{upcomingEvents.length === 0 ? (
					<div className={cls.emptyState}>
						<span className={cls.emptyIcon}>🎉</span>
						<p className={cls.emptyText}>Нет ближайших событий</p>
						<p className={cls.emptyHint}>Все записи в порядке</p>
					</div>
				) : (
					upcomingEvents.map(event => {
						const daysUntil = getDaysUntil(event.date);

						let icon = '📌';
						if (event.title.toLowerCase().includes('прививк')) icon = '💉';
						else if (event.title.toLowerCase().includes('таблет')) icon = '💊';
						else if (event.title.toLowerCase().includes('ветеринар'))
							icon = '🏥';
						else if (event.title.toLowerCase().includes('осмотр')) icon = '🔬';

						return (
							<div
								key={event.id}
								className={`${cls.item} ${cls.upcoming}`}
							>
								<div className={cls.itemIcon}>{icon}</div>

								<div className={cls.itemContent}>
									<div className={cls.itemHeader}>
										<strong className={cls.itemTitle}>{event.title}</strong>
										<span
											className={cls.itemStatus}
											style={{
												backgroundColor: statusConfig.upcoming.color + '20',
												color: statusConfig.upcoming.color
											}}
										>
											{statusConfig.upcoming.emoji}{' '}
											{statusConfig.upcoming.label}
										</span>
									</div>

									<div className={cls.itemDetails}>
										<div className={cls.itemDate}>
											<span className={cls.dateIcon}>📅</span>
											<span className={cls.dateText}>
												{formatDate(event.date)}
											</span>
										</div>

										{daysUntil <= 3 && daysUntil > 0 && (
											<div className={cls.itemUrgent}>
												<span className={cls.urgentIcon}>⏰</span>
												<span className={cls.urgentText}>
													через {daysUntil} {getDaysWord(daysUntil)}
												</span>
											</div>
										)}
									</div>
								</div>

								<button
									className={cls.deleteButton}
									onClick={() => onDelete(event.id)}
									aria-label="Удалить событие"
									title="Удалить"
								>
									<span className={cls.deleteIcon}>✕</span>
								</button>
							</div>
						);
					})
				)}
			</div>

			{upcomingEvents.length > 0 && (
				<div className={cls.footer}>
					<span className={cls.footerText}>
						<span className={cls.footerIcon}>📊</span>
						Всего: {upcomingEvents.length}
					</span>
					<span className={cls.footerText}>
						<span className={cls.footerIcon}>⏳</span>
						На неделе:{' '}
						{
							upcomingEvents.filter(e => {
								const days = getDaysUntil(e.date);
								return days <= 7 && days > 0;
							}).length
						}
					</span>
				</div>
			)}
		</section>
	);
};

const getDaysWord = (days: number): string => {
	if (days === 1) return 'день';
	if (days >= 2 && days <= 4) return 'дня';
	return 'дней';
};
