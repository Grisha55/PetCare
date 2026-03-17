import { useState } from 'react';
import { resetPassword } from '../../../../../shared/api/authApi';
import cls from './ForgotPasswordLink.module.scss';

export const ForgotPasswordLink = () => {
	const [showModal, setShowModal] = useState(false);
	const [email, setEmail] = useState('');
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState<{
		type: 'success' | 'error';
		text: string;
	} | null>(null);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setMessage(null);

		try {
			const { error } = await resetPassword(email);

			if (error) throw error;

			setMessage({
				type: 'success',
				text: 'Письмо для сброса пароля отправлено на ваш email'
			});

			// Закрываем модалку через 3 секунды
			setTimeout(() => {
				setShowModal(false);
				setEmail('');
				setMessage(null);
			}, 3000);
		} catch (error) {
			setMessage({
				type: 'error',
				text: 'Ошибка при отправке. Проверьте правильность email'
			});
			console.error('Reset password error:', error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<button
				type="button"
				onClick={() => setShowModal(true)}
				className={cls.forgotLink}
			>
				Забыли пароль?
			</button>

			{showModal && (
				<div
					className={cls.modalOverlay}
					onClick={() => setShowModal(false)}
				>
					<div
						className={cls.modal}
						onClick={e => e.stopPropagation()}
					>
						<button
							className={cls.closeButton}
							onClick={() => setShowModal(false)}
						>
							✕
						</button>

						<h3 className={cls.modalTitle}>Сброс пароля</h3>
						<p className={cls.modalDescription}>
							Введите ваш email, и мы отправим вам ссылку для сброса пароля
						</p>

						{/* Заменяем <form> на <div> с ролью form для семантики */}
						<div
							className={cls.form}
							role="form"
							aria-label="Форма сброса пароля"
						>
							<input
								type="email"
								placeholder="your@email.com"
								value={email}
								onChange={e => setEmail(e.target.value)}
								required
								disabled={loading}
								className={cls.input}
								autoFocus
							/>

							{message && (
								<div className={`${cls.message} ${cls[message.type]}`}>
									{message.text}
								</div>
							)}

							<button
								type="button" // Меняем на type="button"
								onClick={handleSubmit} // Вызываем handleSubmit напрямую
								disabled={loading}
								className={cls.submitButton}
							>
								{loading ? 'Отправка...' : 'Отправить'}
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	);
};
