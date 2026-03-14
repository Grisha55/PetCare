import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../../../shared/api/supabase';
import { AuthLayout } from '../../../../widgets/auth-layout/ui/AuthLayout/AuthLayout';
import cls from './ResetPasswordPage.module.scss';

const ResetPasswordPage = () => {
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		// Проверяем, есть ли hash с токеном в URL
		const hash = window.location.hash;
		if (!hash || !hash.includes('access_token')) {
			setError('Недействительная ссылка для сброса пароля');
		}
	}, []);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (password !== confirmPassword) {
			setError('Пароли не совпадают');
			return;
		}

		if (password.length < 6) {
			setError('Пароль должен содержать минимум 6 символов');
			return;
		}

		setLoading(true);
		setError(null);

		try {
			const { error } = await supabase.auth.updateUser({
				password: password
			});

			if (error) throw error;

			setSuccess(true);

			// Перенаправляем на логин через 3 секунды
			setTimeout(() => {
				navigate('/login');
			}, 3000);
		} catch (error) {
			setError('Ошибка при обновлении пароля');
			console.error('Reset password error:', error);
		} finally {
			setLoading(false);
		}
	};

	if (success) {
		return (
			<AuthLayout title="Пароль обновлен">
				<div className={cls.success}>
					<p>Ваш пароль успешно обновлен</p>
					<p>Сейчас вы будете перенаправлены на страницу входа</p>
				</div>
			</AuthLayout>
		);
	}

	return (
		<AuthLayout title="Новый пароль">
			<form
				onSubmit={handleSubmit}
				className={cls.form}
			>
				{error && <div className={cls.error}>{error}</div>}

				<div className={cls.field}>
					<label htmlFor="password">Новый пароль</label>
					<input
						id="password"
						type="password"
						placeholder="••••••••"
						value={password}
						onChange={e => setPassword(e.target.value)}
						disabled={loading}
						required
						minLength={6}
					/>
				</div>

				<div className={cls.field}>
					<label htmlFor="confirmPassword">Подтвердите пароль</label>
					<input
						id="confirmPassword"
						type="password"
						placeholder="••••••••"
						value={confirmPassword}
						onChange={e => setConfirmPassword(e.target.value)}
						disabled={loading}
						required
						minLength={6}
					/>
				</div>

				<button
					type="submit"
					className={cls.submitButton}
					disabled={loading}
				>
					{loading ? 'Обновление...' : 'Обновить пароль'}
				</button>
			</form>
		</AuthLayout>
	);
};

export default ResetPasswordPage;
