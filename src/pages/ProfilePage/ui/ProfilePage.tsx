import { Navbar } from '../../../widgets/navbar';
import { ProfileCard } from '../../../widgets/profile-card';
import { ProfileForm } from '../../../widgets/profile-form';
import { useAuth } from '../../../app/providers/auth-provider';
import { useProfile } from '../../../entities/user/hooks/useProfile';
import { User, Settings, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // или import { useRouter } from 'next/navigation' для Next.js
import cls from './ProfilePage.module.scss';

const ProfilePage = () => {
	const { user, logout } = useAuth();
	const { profile } = useProfile();
	const navigate = useNavigate(); // для React Router v6
	// const router = useRouter(); // для Next.js

	const formKey = `${user?.id}-${profile?.name}-${user?.email}`;

	const handleSettingsClick = () => {
		// Переход на страницу настроек
		navigate('/settings'); // для React Router
		// router.push('/settings'); // для Next.js
	};

	const handleLogoutClick = () => {
		logout();
	};

	return (
		<div className={cls.pageWrapper}>
			<Navbar />

			<main className={cls.main}>
				<div className={cls.container}>
					{/* Хлебные крошки */}
					<div className={cls.breadcrumbs}>
						<span>Главная</span>
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
							>
								<Settings size={20} />
								<span>Настройки</span>
							</button>
							<button
								className={cls.logoutBtn}
								onClick={handleLogoutClick}
								aria-label="Выйти из аккаунта"
							>
								<LogOut size={20} />
								<span>Выйти</span>
							</button>
						</div>
					</div>

					{/* Основной контент */}
					<div className={cls.content}>
						<div className={cls.grid}>
							{/* Левая колонка - карточка профиля */}
							<div className={cls.cardColumn}>
								<ProfileCard />

								{/* Дополнительная информация для десктопа */}
								<div className={cls.statsCard}>
									<h3 className={cls.statsTitle}>Статистика</h3>
									<div className={cls.statsGrid}>
										<div className={cls.statItem}>
											<span className={cls.statValue}>156</span>
											<span className={cls.statLabel}>Дней с питомцем</span>
										</div>
										<div className={cls.statItem}>
											<span className={cls.statValue}>24</span>
											<span className={cls.statLabel}>Заметок</span>
										</div>
										<div className={cls.statItem}>
											<span className={cls.statValue}>8</span>
											<span className={cls.statLabel}>Достижений</span>
										</div>
									</div>
								</div>
							</div>

							{/* Правая колонка - форма */}
							<div className={cls.formColumn}>
								<ProfileForm key={formKey} />
							</div>
						</div>
					</div>
				</div>
			</main>
		</div>
	);
};

export default ProfilePage;
