import { Navbar } from '../../../widgets/navbar';
import { ProfileCard } from '../../../widgets/profile-card';
import { ProfileForm } from '../../../widgets/profile-form';
import { useAuth } from '../../../app/providers/auth-provider';
import { useProfile } from '../../../entities/user/hooks/useProfile';
import cls from './ProfilePage.module.scss';

const ProfilePage = () => {
	const { user } = useAuth();
	const { profile } = useProfile();

	// Создаем ключ на основе данных пользователя
	// Когда данные меняются, форма полностью пересоздается
	const formKey = `${user?.id}-${profile?.name}-${user?.email}`;

	return (
		<div className="container">
			<div className={cls.page}>
				<Navbar />
				<h1 className={cls.title}>Профиль</h1>

				<div className={cls.layout}>
					<ProfileCard />
					<ProfileForm key={formKey} />{' '}
					{/* Ключ заставит React пересоздать форму */}
				</div>
			</div>
		</div>
	);
};

export default ProfilePage;
