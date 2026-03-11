import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../../shared/api/supabase';
import { createPet, uploadPetAvatar } from '../../../shared/api/petApi';
import cls from './RegistrationPage.module.scss';

interface PostgrestError {
	code: string;
	message: string;
	details?: string;
	hint?: string;
}

export const RegistrationPage = () => {
	const navigate = useNavigate();

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [petName, setPetName] = useState('');
	const [photo, setPhoto] = useState<File | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [needsEmailConfirmation, setNeedsEmailConfirmation] = useState(false);

	const handleSubmit: React.FormEventHandler<HTMLFormElement> = async e => {
		e.preventDefault();
		setLoading(true);
		setError(null);
		setNeedsEmailConfirmation(false);

		try {
			const { data, error: signUpError } = await supabase.auth.signUp({
				email,
				password,
				options: {
					emailRedirectTo: window.location.origin
				}
			});

			if (signUpError) throw signUpError;

			if (data.user && !data.session) {
				setNeedsEmailConfirmation(true);
				setError(
					`На email ${email} отправлено письмо с подтверждением. Подтвердите email и войдите в приложение.`
				);
				setLoading(false);
				return;
			}

			if (data.session) {
				const user = data.user;
				if (!user) throw new Error('User not found');

				const pet = await createPet(user.id, {
					name: petName
				});

				if (photo && pet) {
					await uploadPetAvatar(pet.id, photo);
				}

				navigate('/');
			}
		} catch (error: unknown) {
			console.error('Registration error:', error);

			const isPostgrestError = (err: unknown): err is PostgrestError => {
				return (
					typeof err === 'object' &&
					err !== null &&
					'code' in err &&
					'message' in err
				);
			};

			const isError = (err: unknown): err is Error => {
				return err instanceof Error;
			};

			if (isPostgrestError(error) && error.code === '23505') {
				setError(
					'У вас уже есть питомец. Вы можете добавить ещё одного в настройках.'
				);
			} else if (
				isPostgrestError(error) &&
				error.message.includes('duplicate key')
			) {
				setError(
					'У вас уже есть питомец. Вы можете добавить ещё одного в настройках.'
				);
			} else if (isError(error)) {
				setError(error.message);
			} else if (typeof error === 'string') {
				setError(error);
			} else {
				setError('Registration error');
			}
		} finally {
			setLoading(false);
		}
	};

	if (needsEmailConfirmation) {
		return (
			<div className={cls.confirmationContainer}>
				<h1>Почти готово! 🎉</h1>
				<p>
					На ваш email <strong>{email}</strong> отправлено письмо с
					подтверждением.
				</p>
				<p>
					Пожалуйста, перейдите по ссылке в письме, чтобы активировать аккаунт.
				</p>
				<button
					onClick={() => navigate('/login')}
					className={cls.loginButton}
				>
					Перейти к входу
				</button>
			</div>
		);
	}

	return (
		<div className={cls.container}>
			<div className={cls.card}>
				<h1 className={cls.title}>Регистрация</h1>

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

					<div className={cls.field}>
						<label htmlFor="petName">Имя питомца</label>
						<input
							id="petName"
							type="text"
							placeholder="Мурзик"
							value={petName}
							onChange={e => setPetName(e.target.value)}
							disabled={loading}
							required
						/>
					</div>

					<div className={cls.field}>
						<label htmlFor="photo">Фото питомца (необязательно)</label>
						<input
							id="photo"
							type="file"
							accept="image/*"
							onChange={e => {
								if (e.target.files?.[0]) {
									setPhoto(e.target.files[0]);
								}
							}}
							disabled={loading}
							className={cls.fileInput}
						/>
					</div>

					<button
						type="submit"
						className={cls.submitButton}
						disabled={loading}
					>
						{loading ? 'Регистрация...' : 'Зарегистрироваться'}
					</button>
				</form>

				<div className={cls.footer}>
					<p>Уже есть аккаунт?</p>
					<Link
						to="/login"
						className={cls.loginLink}
					>
						Войти
					</Link>
				</div>
			</div>
		</div>
	);
};
