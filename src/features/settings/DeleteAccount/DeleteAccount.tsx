import { useState, type FC } from 'react';
import { supabase } from '../../../shared/api/supabase';
import { Button } from '../../../shared/ui/Button/Button';
import styles from './DeleteAccount.module.scss';

interface DeleteAccountProps {
	onDelete?: () => void;
}

export const DeleteAccount: FC<DeleteAccountProps> = () => {
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
			// 1. Проверяем сессию
			const {
				data: { session },
				error: sessionError
			} = await supabase.auth.getSession();

			console.log('Session check:', { session: !!session, sessionError });

			if (sessionError || !session) {
				throw new Error('Сессия не найдена. Пожалуйста, войдите снова.');
			}

			console.log('Access token exists:', !!session.access_token);
			console.log('Access token length:', session.access_token?.length);

			// 2. Получаем пользователя
			const {
				data: { user },
				error: userError
			} = await supabase.auth.getUser();

			console.log('User check:', { user: user?.id, userError });

			if (userError || !user) {
				throw new Error('Пользователь не найден');
			}

			// 3. Удаляем связанные данные
			console.log('Deleting pets for user:', user.id);
			const { error: petsError } = await supabase
				.from('pets')
				.delete()
				.eq('user_id', user.id);

			if (petsError) {
				console.error('Error deleting pets:', petsError);
				// Продолжаем выполнение
			}

			// 4. Вызываем Edge Function
			console.log('Calling edge function...');
			const { data, error: fnError } = await supabase.functions.invoke(
				'delete-user',
				{
					body: {}
				}
			);

			console.log('Edge function response:', { data, fnError });

			if (fnError) {
				console.error('Edge function error:', fnError);
				throw new Error(fnError.message || 'Ошибка при удалении пользователя');
			}

			console.log('User deleted successfully, signing out...');

			// 5. Выходим из системы
			await supabase.auth.signOut();
			localStorage.clear();

			// 6. Перенаправляем
			window.location.href = '/';
		} catch (err) {
			console.error('Error in handleConfirmDelete:', err);
			setError(
				err instanceof Error
					? err.message
					: 'Произошла ошибка при удалении аккаунта'
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
