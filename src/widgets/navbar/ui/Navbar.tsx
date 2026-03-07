import { useEffect, useState } from 'react';
import { FaDog, FaHome, FaLightbulb } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { usePet } from '../../../app/providers/pet-provider/usePet';
import { BurgerMenu } from '../../../shared/ui/BurgerMenu/BurgerMenu';
import { Container } from '../../../shared/ui/Container/Container';
import cls from './Navbar.module.scss';
import { NavLink } from './NavLink';

const DEFAULT_AVATAR = '/images/passport-1';

export const Navbar = () => {
	const [isMobile, setIsMobile] = useState(window.innerWidth <= 820);
	const navigate = useNavigate();
	const { pet, loading } = usePet();

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

	// Для отладки - можно убрать после исправления
	useEffect(() => {
		console.log('Navbar - pet:', {
			pet,
			loading,
			avatar_url: pet?.avatar_url
		});
	}, [pet, loading]);

	const petName = pet?.name || 'Питомец';
	const userEmail = 'grishavinyar@gmail.com';

	// Определяем URL аватара
	const avatarUrl = loading || !pet?.avatar_url 
		? DEFAULT_AVATAR 
		: pet.avatar_url;

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

				<div
					className={cls.profile}
					onClick={() => navigate('/profile')}
				>
					<div className={cls.image_block}>
						{loading ? (
							<div className={cls.avatarSkeleton}>...</div>
						) : (
							<img
								key={avatarUrl} // Ключ для принудительного обновления при смене URL
								src={avatarUrl}
								alt="profile"
								onError={(e) => {
									console.log('Image failed to load:', e.currentTarget.src);
									e.currentTarget.src = DEFAULT_AVATAR;
								}}
							/>
						)}
					</div>
					<div className={cls.info}>
						<span>{petName}</span>
						<span>{userEmail}</span>
					</div>
				</div>
			</Container>
		</header>
	);
};