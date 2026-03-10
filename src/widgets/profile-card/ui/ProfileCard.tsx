import { useRef } from 'react';
import cls from './ProfileCard.module.scss';
import { useAuth } from '../../../app/providers/auth-provider';
import { useProfile } from '../../../entities/user/hooks/useProfile';
import { usePet } from '../../../app/providers/pet-provider/usePet';

export const ProfileCard = () => {
	const { user } = useAuth();
	const { pet, changeAvatar } = usePet();
	const { profile } = useProfile();
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleAvatarClick = () => {
		fileInputRef.current?.click();
	};

	const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file && pet) {
			try {
				await changeAvatar(file);
			} catch (error) {
				console.error('Failed to change avatar:', error);
			}
		}
	};

	// Получаем имя пользователя из разных источников
	const displayName =
		profile?.name ||
		user?.user_metadata?.name ||
		user?.email?.split('@')[0] ||
		'Пользователь';

	return (
		<div className={cls.card}>
			<div className={cls.avatarSection}>
				<div
					className={cls.avatar}
					onClick={handleAvatarClick}
				>
					{pet?.avatar_url ? (
						<img
							src={pet?.avatar_url}
							alt="Avatar"
						/>
					) : (
						<div className={cls.avatarPlaceholder}>
							{displayName.charAt(0).toUpperCase()}
						</div>
					)}
				</div>
				<input
					type="file"
					ref={fileInputRef}
					onChange={handleAvatarChange}
					accept="image/*"
					style={{ display: 'none' }}
				/>
				<button
					onClick={handleAvatarClick}
					className={cls.changeAvatarBtn}
				>
					Сменить фото питомца
				</button>
			</div>

			<div className={cls.info}>
				<h3>{displayName}</h3>
				<p>{user?.email}</p>
				{pet && <p>Питомец: {pet.name}</p>}
			</div>
		</div>
	);
};
