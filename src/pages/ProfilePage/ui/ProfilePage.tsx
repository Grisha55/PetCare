import {
	ChevronRight,
	Heart,
	LogOut,
	PawPrint,
	Settings,
	Trash2,
	User
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../app/providers/auth-provider';
import { useProfile } from '../../../entities/user/hooks/useProfile';
import {
	getSavedTips,
	unsaveTip,
	type SavedTip
} from '../../../shared/api/savedTipsApi';
import { EmptyState } from '../../../shared/ui/EmptyState';
import { Navbar } from '../../../widgets/navbar';
import { ProfileCard } from '../../../widgets/profile-card';
import { ProfileForm } from '../../../widgets/profile-form';
import cls from './ProfilePage.module.scss';

const ProfilePage = () => {
	const { user, logout } = useAuth();
	const { profile } = useProfile();
	const navigate = useNavigate();

	const [isLoggingOut, setIsLoggingOut] = useState(false);
	const [savedTips, setSavedTips] = useState<SavedTip[]>([]);
	const [loadingSaved, setLoadingSaved] = useState(false);
	const [deletingTipId, setDeletingTipId] = useState<string | null>(null);

	const formKey = `${user?.id}-${profile?.name}-${user?.email}`;

	// Загрузка сохраненных советов
	useEffect(() => {
		const loadSavedTips = async () => {
			if (!user) return;

			setLoadingSaved(true);
			try {
				const tips = await getSavedTips(user.id);
				setSavedTips(tips);
			} catch (error) {
				console.error('Failed to load saved tips:', error);
				setSavedTips([]);
			} finally {
				setLoadingSaved(false);
			}
		};

		loadSavedTips();
	}, [user]);

	// Функция удаления совета
	const handleDeleteTip = async (tipId: string) => {
		if (!user || deletingTipId) return;

		try {
			setDeletingTipId(tipId);
			console.log('Starting delete for tip:', tipId);

			// Удаляем из базы данных
			await unsaveTip(user.id, tipId);

			console.log('Delete successful, updating state');

			// Обновляем состояние - убираем удаленный совет
			setSavedTips(prev => {
				const newTips = prev.filter(tip => tip.id !== tipId);
				console.log('New tips state:', newTips);
				return newTips;
			});
		} catch (error) {
			console.error('Failed to delete tip:', error);
			// Можно показать уведомление об ошибке
		} finally {
			setDeletingTipId(null);
		}
	};

	const handleSettingsClick = () => {
		navigate('/settings');
	};

	const handleLogoutClick = async () => {
		try {
			setIsLoggingOut(true);

			if (logout) {
				await logout();
			}

			navigate('/login', {
				replace: true,
				state: { from: 'logout' }
			});
		} catch (error) {
			console.error('Failed to logout:', error);
		} finally {
			setIsLoggingOut(false);
		}
	};

	const handleViewAllTips = () => {
		navigate('/tips');
	};

	// Функция для получения названия категории на русском
	const getCategoryName = (category: string) => {
		const categories: Record<string, string> = {
			health: 'Здоровье',
			training: 'Дрессировка',
			nutrition: 'Питание'
		};
		return categories[category] || category;
	};

	// Безопасная функция для обрезания текста
	const truncateContent = (content: string | undefined, maxLength: number) => {
		if (!content || typeof content !== 'string') return '';
		if (content.length <= maxLength) return content;
		return content.substring(0, maxLength) + '...';
	};

	// Форматирование даты
	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleDateString('ru-RU', {
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		});
	};

	if (!user) {
		navigate('/login', { replace: true });
		return null;
	}

	return (
		<div className={cls.pageWrapper}>
			<Navbar />

			<main className={cls.main}>
				<div className={cls.container}>
					{/* Хлебные крошки */}
					<div className={cls.breadcrumbs}>
						<span onClick={() => navigate('/')}>Главная</span>
						<span className={cls.separator}>/</span>
						<span className={cls.current}>Профиль</span>
					</div>

					{/* Заголовок с действиями */}
					<div className={cls.header}>
						<div className={cls.titleWrapper}>
							<User
								size={28}
								className={cls.titleIcon}
							/>
							<h1 className={cls.title}>Профиль пользователя</h1>
						</div>

						<div className={cls.actions}>
							<button
								className={cls.settingsBtn}
								onClick={handleSettingsClick}
								aria-label="Перейти к настройкам"
								disabled={isLoggingOut}
							>
								<Settings size={20} />
								<span>Настройки</span>
							</button>

							<button
								className={cls.logoutBtn}
								onClick={handleLogoutClick}
								aria-label="Выйти из аккаунта"
								disabled={isLoggingOut}
							>
								{isLoggingOut ? (
									<>
										<span className={cls.spinner} />
										<span>Выход...</span>
									</>
								) : (
									<>
										<LogOut size={20} />
										<span>Выйти</span>
									</>
								)}
							</button>
						</div>
					</div>

					{/* Основной контент */}
					<div className={cls.content}>
						<div className={cls.grid}>
							{/* Левая колонка - карточка профиля */}
							<div className={cls.cardColumn}>
								<ProfileCard />

								{/* Статистика */}
								<div className={cls.statsCard}>
									<h3 className={cls.statsTitle}>Статистика</h3>
									<div className={cls.statsGrid}>
										<div className={cls.statItem}>
											<span className={cls.statValue}>156</span>
											<span className={cls.statLabel}>Дней с питомцем</span>
										</div>
										<div className={cls.statItem}>
											<span className={cls.statValue}>{savedTips.length}</span>
											<span className={cls.statLabel}>Сохраненных советов</span>
										</div>
										<div className={cls.statItem}>
											<span className={cls.statValue}>8</span>
											<span className={cls.statLabel}>Достижений</span>
										</div>
									</div>
								</div>
							</div>

							{/* Правая колонка */}
							<div className={cls.formColumn}>
								{/* Форма профиля */}
								<ProfileForm key={formKey} />

								{/* Блок с сохраненными советами */}
								<div className={cls.savedTipsSection}>
									<div className={cls.sectionHeader}>
										<div className={cls.sectionTitle}>
											<Heart
												size={20}
												className={cls.heartIcon}
											/>
											<h2>Сохраненные советы</h2>
											{savedTips.length > 0 && (
												<span className={cls.count}>{savedTips.length}</span>
											)}
										</div>

										{savedTips.length > 0 && (
											<button
												onClick={handleViewAllTips}
												className={cls.viewAllLink}
											>
												<span>Все советы</span>
												<ChevronRight size={16} />
											</button>
										)}
									</div>

									{loadingSaved ? (
										<div className={cls.loadingTips}>
											<div className={cls.spinner} />
											<p>Загрузка советов...</p>
										</div>
									) : savedTips.length > 0 ? (
										<div className={cls.tipsGrid}>
											{savedTips.map(tip => (
												<div
													key={tip.id}
													className={cls.tipCard}
												>
													<div className={cls.tipContent}>
														<div className={cls.tipHeader}>
															<h3>{tip.title}</h3>
															{tip.category && (
																<span className={cls.tipCategory}>
																	{getCategoryName(tip.category)}
																</span>
															)}
														</div>

														{tip.content && (
															<p className={cls.tipDescription}>
																{truncateContent(tip.content, 100)}
															</p>
														)}

														<div className={cls.tipFooter}>
															<span className={cls.savedDate}>
																Сохранено: {formatDate(tip.saved_at)}
															</span>
															<div className={cls.tipActions}>
																<Heart
																	size={16}
																	className={cls.tipSavedIcon}
																	fill="currentColor"
																/>
																<button
																	onClick={() => handleDeleteTip(tip.id)}
																	disabled={deletingTipId === tip.id}
																	className={cls.deleteButton}
																	aria-label="Удалить совет"
																>
																	<Trash2 size={16} />
																	{deletingTipId === tip.id && (
																		<span className={cls.deletingSpinner} />
																	)}
																</button>
															</div>
														</div>
													</div>
												</div>
											))}

											{savedTips.length > 3 && (
												<button
													onClick={handleViewAllTips}
													className={cls.showMoreButton}
												>
													Показать еще {savedTips.length - 3}
												</button>
											)}
										</div>
									) : (
										<EmptyState
											icon={<Heart size={32} />}
											title="У вас пока нет сохраненных советов"
											description="Нажимайте на сердечко у советов, чтобы сохранить их"
											action={
												<button
													onClick={handleViewAllTips}
													className={cls.browseTipsButton}
												>
													<PawPrint size={18} />
													<span>Посмотреть советы</span>
												</button>
											}
										/>
									)}
								</div>
							</div>
						</div>
					</div>
				</div>
			</main>

			{/* Модальное окно подтверждения выхода */}
			{isLoggingOut && (
				<div className={cls.logoutOverlay}>
					<div className={cls.logoutModal}>
						<div className={cls.spinnerLarge} />
						<p>Выполняется выход...</p>
					</div>
				</div>
			)}
		</div>
	);
};

export default ProfilePage;
