import { Camera, Mail, PawPrint, User } from 'lucide-react';
import { useRef } from 'react';
import { useAuth } from '../../../app/providers/auth-provider';
import { usePet } from '../../../app/providers/pet-provider/usePet';
import { useProfile } from '../../../entities/user/hooks/useProfile';
import cls from './ProfileCard.module.scss';

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

	const displayName =
		profile?.name ||
		user?.user_metadata?.name ||
		user?.email?.split('@')[0] ||
		'Пользователь';

	return (
		<div className={cls.card}>
			<div className={cls.cardGradient} />

			<div className={cls.avatarSection}>
				<div className={cls.avatarWrapper}>
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
				</div>

				<input
					type="file"
					ref={fileInputRef}
					onChange={handleAvatarChange}
					accept="image/*"
					style={{ display: 'none' }}
				/>
			</div>

			<div className={cls.info}>
				<div className={cls.nameWrapper}>
					<User
						size={20}
						className={cls.icon}
					/>
					<h3 className={cls.name}>{displayName}</h3>
				</div>

				<div className={cls.infoRow}>
					<Mail
						size={18}
						className={cls.icon}
					/>
					<p className={cls.email}>{user?.email}</p>
				</div>

				{pet && profile?.name && (
					<div className={cls.infoRow}>
						<PawPrint
							size={18}
							className={cls.icon}
						/>
						<p className={cls.petName}>
							Питомец: <span>{profile.name}</span>
						</p>
					</div>
				)}
			</div>

			<button
				onClick={handleAvatarClick}
				className={cls.changeAvatarBtn}
			>
				<Camera size={18} />
				<span>Сменить фото питомца</span>
			</button>
		</div>
	);
};
