import { useState, type FC } from 'react';
import { Button } from '../../../shared/ui/Button/Button';
import styles from './DeleteAccount.module.scss';

interface DeleteAccountProps {
	onDelete?: () => void;
}

export const DeleteAccount: FC<DeleteAccountProps> = ({ onDelete }) => {
	const [isConfirming, setIsConfirming] = useState(false);

	const handleDeleteClick = () => {
		setIsConfirming(true);
	};

	const handleConfirmDelete = () => {
		// Здесь логика удаления аккаунта
		if (onDelete) {
			onDelete();
		}
		// Очистка localStorage и редирект
		localStorage.clear();
		window.location.href = '/';
	};

	const handleCancel = () => {
		setIsConfirming(false);
	};

	if (isConfirming) {
		return (
			<div className={styles.confirmation}>
				<p className={styles.warning}>
					⚠️ Вы уверены? Это действие нельзя отменить.
				</p>
				<div className={styles.actions}>
					<Button variant="outline" onClick={handleCancel}>
						Отмена
					</Button>
					<Button variant="danger" onClick={handleConfirmDelete}>
						Да, удалить аккаунт
					</Button>
				</div>
			</div>
		);
	}

	return (
		<Button variant="danger" onClick={handleDeleteClick}>
			Удалить аккаунт
		</Button>
	);
};