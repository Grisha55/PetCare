import { Settings, LogOut, User } from 'lucide-react';
import cls from './ProfileHeader.module.scss';

interface ProfileHeaderProps {
	onSettingsClick: () => void;
	onLogoutClick: () => void;
	isLoggingOut: boolean;
}

export const ProfileHeader = ({
	onSettingsClick,
	onLogoutClick,
	isLoggingOut
}: ProfileHeaderProps) => {
	return (
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
					onClick={onSettingsClick}
					aria-label="Перейти к настройкам"
					disabled={isLoggingOut}
				>
					<Settings size={20} />
					<span>Настройки</span>
				</button>

				<button
					className={cls.logoutBtn}
					onClick={onLogoutClick}
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
	);
};
