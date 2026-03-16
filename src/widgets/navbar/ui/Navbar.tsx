import { useEffect, useState } from 'react';
import { FaDog, FaHome, FaLightbulb } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../app/providers/auth-provider';
import { usePet } from '../../../app/providers/pet-provider/usePet';
import { useProfile } from '../../../entities/user/hooks/useProfile';
import { BurgerMenu } from '../../../shared/ui/BurgerMenu/BurgerMenu';
import { Container } from '../../../shared/ui/Container/Container';
import { NotificationCenter } from '../../../widgets/notification-center'; // 👈 Импортируем
import cls from './Navbar.module.scss';
import { NavLink } from './NavLink';

export const Navbar = () => {
	const [isMobile, setIsMobile] = useState(window.innerWidth <= 820);
	const navigate = useNavigate();
	const { pet, loading } = usePet();
	const { user } = useAuth();
	const { profile } = useProfile();

	useEffect(() => {
		const handleResize = () => {
			setIsMobile(window.innerWidth <= 820);
		};

		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	const links = [
		{ to: '/', icon: <FaHome />, label: 'Дом' },
		{ to: '/passport', icon: <FaDog />, label: 'Паспорт' },
		{ to: '/tips', icon: <FaLightbulb />, label: 'Советы' }
	];

	const petName = profile?.name || 'NoName';
	const userEmail = user?.email || '';

	// Функция для получения содержимого аватара
	const getAvatarContent = () => {
		if (loading) {
			return <div className={cls.avatarSkeleton}>...</div>;
		}

		// Если есть avatar_url, пытаемся загрузить изображение
		if (pet?.avatar_url) {
			return (
				<img
					src={pet.avatar_url}
					alt={`${petName}'s avatar`}
					onError={e => {
						console.log('Image failed to load:', e.currentTarget.src);
						e.currentTarget.style.display = 'none';

						// Создаем fallback с первой буквой имени
						const parent = e.currentTarget.parentElement;
						if (parent) {
							// Проверяем, нет ли уже fallback
							if (!parent.querySelector(`.${cls.avatarFallback}`)) {
								const fallback = document.createElement('div');
								fallback.className = cls.avatarFallback;
								fallback.textContent = petName[0]?.toUpperCase() || '?';
								parent.appendChild(fallback);
							}
						}
					}}
					onLoad={e => {
						// Если изображение загрузилось, удаляем возможный fallback
						const parent = e.currentTarget.parentElement;
						if (parent) {
							const fallback = parent.querySelector(`.${cls.avatarFallback}`);
							if (fallback) {
								fallback.remove();
							}
						}
					}}
				/>
			);
		}

		return (
			<div className={cls.avatarFallback}>
				{petName[0]?.toUpperCase() || '?'}
			</div>
		);
	};

	return (
		<header className={cls.navbar}>
			<Container className={cls.navbarContainer}>
				<div className={cls.leftSection}>
					{isMobile && <BurgerMenu links={links} />}
					<div className={cls.logo}>
						<h1>🐾</h1>
					</div>
				</div>

				{!isMobile && (
					<nav className={cls.links}>
						{links.map((link, index) => (
							<NavLink
								key={index}
								to={link.to}
								icon={link.icon}
								label={link.label}
							/>
						))}
					</nav>
				)}

				<div className={cls.rightSection}>
					<NotificationCenter />

					<div
						className={cls.profile}
						onClick={() => navigate('/profile')}
					>
						<div className={cls.image_block}>{getAvatarContent()}</div>
						<div className={cls.info}>
							<span className={cls.petName}>{petName}</span>
							<span className={cls.userEmail}>{userEmail}</span>
						</div>
					</div>
				</div>
			</Container>
		</header>
	);
};
