import { useState, type FC } from 'react';
import { supabase } from '../../../shared/api/supabase';
import { Button } from '../../../shared/ui/Button/Button';
import styles from './DeleteAccount.module.scss';
import { FunctionsHttpError } from '@supabase/supabase-js';

interface DeleteAccountProps {
	onDelete?: () => void;
}

interface FunctionsError {
	message: string;
	name: string;
	status?: number;
	context?: unknown;
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

			console.log('1. Session check:', {
				hasSession: !!session,
				sessionError,
				userId: session?.user?.id
			});

			if (sessionError || !session) {
				throw new Error('Сессия не найдена. Пожалуйста, войдите снова.');
			}

			console.log('2. Access token:', {
				exists: !!session.access_token,
				length: session.access_token?.length,
				preview: session.access_token?.substring(0, 20) + '...'
			});

			// 2. Получаем пользователя
			const {
				data: { user },
				error: userError
			} = await supabase.auth.getUser();

			console.log('3. User check:', {
				userId: user?.id,
				userError,
				email: user?.email
			});

			if (userError || !user) {
				throw new Error('Пользователь не найден');
			}

			// 3. Удаляем связанные данные (питомцев)
			console.log('4. Deleting pets for user:', user.id);
			const { error: petsError } = await supabase
				.from('pets')
				.delete()
				.eq('user_id', user.id);

			if (petsError) {
				console.error('4a. Error deleting pets:', petsError);
				// Продолжаем выполнение, даже если не удалились питомцы
			} else {
				console.log('4b. Pets deleted successfully');
			}

			// 4. Вызываем Edge Function с токеном в заголовках
			console.log('5. Calling edge function...');

			const { data, error: fnError } = await supabase.functions.invoke(
				'delete-user',
				{
					headers: {
						Authorization: `Bearer ${session.access_token}`,
						'Content-Type': 'application/json'
					},
					body: { userId: user.id }
				}
			);

			// Приводим ошибку к нужному типу
			const typedFnError = fnError as FunctionsError | null;

			console.log('6. Edge function response:', {
				data,
				fnError: typedFnError,
				fnErrorStatus: typedFnError?.status,
				fnErrorMessage: typedFnError?.message
			});

			if (typedFnError) {
				console.error('6a. Edge function error details:', {
					name: typedFnError.name,
					message: typedFnError.message,
					status: typedFnError.status,
					context: typedFnError.context
				});

				// Пытаемся получить тело ответа из контекста
				let errorMessage = typedFnError.message;
				let detailedError = '';

				if (typedFnError.context instanceof Response) {
					try {
						const responseBody = await typedFnError.context.text();
						console.error('6b. Error response body:', responseBody);

						// Пытаемся распарсить JSON ответ
						try {
							const errorData = JSON.parse(responseBody);
							detailedError = errorData.error || errorData.message || '';
							errorMessage = detailedError || errorMessage;
						} catch {
							// Если не JSON, используем текст как есть
							errorMessage = responseBody || errorMessage;
						}
					} catch (e) {
						console.error('6c. Failed to read error response:', e);
					}
				}

				// Проверяем статус ошибки
				if (typedFnError.status === 401) {
					throw new Error('Не авторизован. Пожалуйста, войдите снова.');
				} else if (typedFnError.status === 404) {
					throw new Error('Пользователь не найден.');
				} else if (typedFnError instanceof FunctionsHttpError) {
					if (detailedError.includes('Database error')) {
						throw new Error(
							'Ошибка базы данных при удалении пользователя. Возможно, у пользователя есть связанные записи, которые не удалось удалить.'
						);
					}
					throw new Error(
						`Ошибка при вызове функции удаления: ${errorMessage}`
					);
				} else {
					throw new Error(errorMessage || 'Ошибка при удалении пользователя');
				}
			}

			console.log('7. User deleted successfully, signing out...');

			// 5. Выходим из системы
			const { error: signOutError } = await supabase.auth.signOut();
			if (signOutError) {
				console.error('7a. Sign out error:', signOutError);
			}

			// 6. Очищаем хранилище
			localStorage.clear();
			sessionStorage.clear();

			console.log('8. Redirecting to home page...');

			// 7. Перенаправляем
			window.location.href = '/';
		} catch (err) {
			console.error('9. Error in handleConfirmDelete:', err);

			// Пользовательское сообщение в зависимости от ошибки
			let userMessage = 'Произошла ошибка при удалении аккаунта';

			if (err instanceof Error) {
				if (err.message.includes('Database error')) {
					userMessage =
						'Не удалось удалить аккаунт из-за ошибки базы данных. Пожалуйста, обратитесь в поддержку.';
				} else if (err.message.includes('session')) {
					userMessage = 'Сессия истекла. Пожалуйста, войдите снова.';
				} else {
					userMessage = err.message;
				}
			}

			setError(userMessage);
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
