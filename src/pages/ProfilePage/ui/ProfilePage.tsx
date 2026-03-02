import { Navbar } from '../../../widgets/navbar'
import { ProfileCard } from '../../../widgets/profile-card';
import { ProfileForm } from '../../../widgets/profile-form';
import cls from './ProfilePage.module.scss';

const ProfilePage = () => {
	return (
		<div className="container">
			<div className={cls.page}>
        <Navbar />
				<h1 className={cls.title}>Профиль</h1>

				<div className={cls.layout}>
					<ProfileCard />
					<ProfileForm />
				</div>
			</div>
		</div>
	);
};

export default ProfilePage;
