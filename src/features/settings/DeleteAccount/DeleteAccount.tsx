import { useState, type FC } from 'react';
import { supabase } from '../../../shared/api/supabase';
import { Button } from '../../../shared/ui/Button/Button';
import styles from './DeleteAccount.module.scss';

export const DeleteAccount: FC = () => {
	const [isConfirming, setIsConfirming] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleDeleteClick = () => {
		setIsConfirming(true);
		setError(null);
	};

	const handleConfirmDelete = async () => {
		setIsDeleting(true);
		setError(null);

		try {
			console.log('🗑️ Начинаем удаление...');

			// Вызываем SQL функцию с новым именем
			const { error: rpcError } = await supabase.rpc('delete_my_account');

			if (rpcError) {
				console.error('❌ Ошибка SQL функции:', rpcError);
				throw new Error(rpcError.message || 'Не удалось удалить аккаунт');
			}

			console.log('✅ Аккаунт удален');

			// Выходим из системы
			await supabase.auth.signOut();

			// Очищаем хранилище
			localStorage.clear();
			sessionStorage.clear();

			// Перенаправляем на главную
			window.location.href = '/';
		} catch (err) {
			console.error('❌ Ошибка:', err);
			setError(
				err instanceof Error ? err.message : 'Ошибка при удалении аккаунта'
			);
			setIsDeleting(false);
		}
	};

	const handleCancel = () => {
		setIsConfirming(false);
		setError(null);
	};

	if (isConfirming) {
		return (
			<div className={styles.confirmation}>
				<p className={styles.warning}>
					⚠️ Вы уверены? Это действие нельзя отменить.
				</p>
				{error && <p className={styles.error}>{error}</p>}
				<div className={styles.actions}>
					<Button
						variant="outline"
						onClick={handleCancel}
						disabled={isDeleting}
					>
						Отмена
					</Button>
					<Button
						variant="danger"
						onClick={handleConfirmDelete}
						disabled={isDeleting}
					>
						{isDeleting ? 'Удаление...' : 'Да, удалить аккаунт'}
					</Button>
				</div>
			</div>
		);
	}

	return (
		<Button
			variant="danger"
			onClick={handleDeleteClick}
		>
			Удалить аккаунт
		</Button>
	);
};
