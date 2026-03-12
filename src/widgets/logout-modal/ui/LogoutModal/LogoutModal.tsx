import cls from './LogoutModal.module.scss';

interface LogoutModalProps {
	isOpen: boolean;
}

export const LogoutModal = ({ isOpen }: LogoutModalProps) => {
	if (!isOpen) return null;

	return (
		<div className={cls.logoutOverlay}>
			<div className={cls.logoutModal}>
				<div className={cls.spinnerLarge} />
				<p>Выполняется выход...</p>
			</div>
		</div>
	);
};
