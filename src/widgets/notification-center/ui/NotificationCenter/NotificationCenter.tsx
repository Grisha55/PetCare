import { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { useAuth } from '../../../../app/providers/auth-provider';
import { supabase } from '../../../../shared/api/supabase';
import cls from './NotificationCenter.module.scss';

interface Notification {
	id: string;
	title: string;
	message: string;
	type: string;
	created_at: string;
	is_read: boolean;
}

export const NotificationCenter = () => {
	const [notifications, setNotifications] = useState<Notification[]>([]);
	const [unreadCount, setUnreadCount] = useState(0);
	const [isOpen, setIsOpen] = useState(false);
	const { user } = useAuth();

	useEffect(() => {
		if (!user) return;

		// Загружаем уведомления
		const loadNotifications = async () => {
			const { data } = await supabase
				.from('user_notifications')
				.select('*')
				.eq('user_id', user.id)
				.order('created_at', { ascending: false })
				.limit(20);

			setNotifications(data || []);
			setUnreadCount(data?.filter(n => !n.is_read).length || 0);
		};

		loadNotifications();

		// Подписываемся на новые уведомления в реальном времени
		const subscription = supabase
			.channel('notifications')
			.on(
				'postgres_changes',
				{
					event: 'INSERT',
					schema: 'public',
					table: 'user_notifications',
					filter: `user_id=eq.${user.id}`
				},
				payload => {
					setNotifications(prev => [payload.new as Notification, ...prev]);
					setUnreadCount(prev => prev + 1);
				}
			)
			.subscribe();

		return () => {
			subscription.unsubscribe();
		};
	}, [user]);

	const markAsRead = async (id: string) => {
		await supabase
			.from('user_notifications')
			.update({ is_read: true })
			.eq('id', id);

		setNotifications(prev =>
			prev.map(n => (n.id === id ? { ...n, is_read: true } : n))
		);
		setUnreadCount(prev => prev - 1);
	};

	const markAllAsRead = async () => {
		await supabase
			.from('user_notifications')
			.update({ is_read: true })
			.eq('user_id', user?.id)
			.eq('is_read', false);

		setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
		setUnreadCount(0);
	};

	const getTypeIcon = (type: string) => {
		switch (type) {
			case 'warning':
				return '⚠️';
			case 'reminder':
				return '📅';
			default:
				return 'ℹ️';
		}
	};

	return (
		<div className={cls.container}>
			<button
				className={cls.bellButton}
				onClick={() => setIsOpen(!isOpen)}
			>
				<Bell size={24} />
				{unreadCount > 0 && <span className={cls.badge}>{unreadCount}</span>}
			</button>

			{isOpen && (
				<div className={cls.dropdown}>
					<div className={cls.header}>
						<h3>Уведомления</h3>
						{unreadCount > 0 && (
							<button
								onClick={markAllAsRead}
								className={cls.markAllRead}
							>
								Прочитать все
							</button>
						)}
					</div>

					<div className={cls.notificationsList}>
						{notifications.length === 0 ? (
							<p className={cls.empty}>Нет уведомлений</p>
						) : (
							notifications.map(notification => (
								<div
									key={notification.id}
									className={`${cls.notificationItem} ${!notification.is_read ? cls.unread : ''}`}
									onClick={() => markAsRead(notification.id)}
								>
									<span className={cls.icon}>
										{getTypeIcon(notification.type)}
									</span>
									<div className={cls.content}>
										<h4>{notification.title}</h4>
										<p>{notification.message}</p>
										<small>
											{new Date(notification.created_at).toLocaleString()}
										</small>
									</div>
								</div>
							))
						)}
					</div>
				</div>
			)}
		</div>
	);
};
