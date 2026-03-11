import { useState } from 'react';
import { useAuth } from '../../../app/providers/auth-provider';
import { useNavigate, Link } from 'react-router-dom';
import cls from './LoginPage.module.scss';

export const LoginPage = () => {
	const { login } = useAuth();
	const navigate = useNavigate();

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	const handleSubmit: React.FormEventHandler<HTMLFormElement> = async e => {
		e.preventDefault();
		setError(null);
		setLoading(true);

		try {
			await login(email, password);
			navigate('/');
		} catch (error) {
			setError('Неверный email или пароль');
			console.error('Login error:', error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className={cls.container}>
			<div className={cls.card}>
				<h1 className={cls.title}>Вход в аккаунт</h1>

				{error && <div className={cls.error}>{error}</div>}

				<form
					onSubmit={handleSubmit}
					className={cls.form}
				>
					<div className={cls.field}>
						<label htmlFor="email">Email</label>
						<input
							id="email"
							type="email"
							placeholder="your@email.com"
							value={email}
							onChange={e => setEmail(e.target.value)}
							disabled={loading}
							required
						/>
					</div>

					<div className={cls.field}>
						<label htmlFor="password">Пароль</label>
						<input
							id="password"
							type="password"
							placeholder="••••••••"
							value={password}
							onChange={e => setPassword(e.target.value)}
							disabled={loading}
							required
						/>
					</div>

					<button
						type="submit"
						className={cls.submitButton}
						disabled={loading}
					>
						{loading ? 'Вход...' : 'Войти'}
					</button>
				</form>

				<div className={cls.footer}>
					<p>Нет аккаунта?</p>
					<Link
						to="/registration"
						className={cls.registerLink}
					>
						Зарегистрироваться
					</Link>
				</div>
			</div>
		</div>
	);
};
