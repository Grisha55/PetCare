import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../../shared/api/supabase';
import { createPet, uploadPetAvatar } from '../../../shared/api/petApi';

interface PostgrestError {
	code: string;
	message: string;
	details?: string;
	hint?: string;
}

export const RegistrationPage = () => {
	//const { register } = useAuth() // убрали login
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
			// 1. Регистрируем пользователя
			const { data, error: signUpError } = await supabase.auth.signUp({
				email,
				password,
				options: {
					// Опционально: можно сразу подтверждать email (если отключено в настройках)
					emailRedirectTo: window.location.origin
				}
			});

			if (signUpError) throw signUpError;

			// 2. Проверяем, нужно ли подтверждение email
			if (data.user && !data.session) {
				// Пользователь создан, но не аутентифицирован - нужно подтвердить email
				setNeedsEmailConfirmation(true);
				setError(
					`На email ${email} отправлено письмо с подтверждением. Подтвердите email и войдите в приложение.`
				);
				setLoading(false);
				return;
			}

			// 3. Если есть сессия (email confirmation отключен), создаем питомца
			if (data.session) {
				const user = data.user;
				if (!user) throw new Error('User not found');

				// Создаем питомца
				const pet = await createPet(user.id, {
					name: petName
				});

				// Загружаем фото если есть
				if (photo && pet) {
					await uploadPetAvatar(pet.id, photo);
				}

				// Перенаправляем на главную
				navigate('/');
			}
		} catch (error: unknown) {
			console.error('Registration error:', error);

			// Type guard for PostgrestError
			const isPostgrestError = (err: unknown): err is PostgrestError => {
				return (
					typeof err === 'object' &&
					err !== null &&
					'code' in err &&
					'message' in err
				);
			};

			// Type guard for Error
			const isError = (err: unknown): err is Error => {
				return err instanceof Error;
			};

			// Обработка ошибки уникальности питомца
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

	// Если нужно подтверждение email, показываем специальное сообщение
	if (needsEmailConfirmation) {
		return (
			<div style={{ textAlign: 'center', padding: '2rem' }}>
				<h1>Почти готово! 🎉</h1>
				<p style={{ color: '#666', margin: '1rem 0' }}>
					На ваш email <strong>{email}</strong> отправлено письмо с
					подтверждением.
				</p>
				<p style={{ color: '#666' }}>
					Пожалуйста, перейдите по ссылке в письме, чтобы активировать аккаунт.
				</p>
				<button
					onClick={() => navigate('/login')}
					style={{
						marginTop: '2rem',
						padding: '0.75rem 2rem',
						background: '#4CAF50',
						color: 'white',
						border: 'none',
						borderRadius: '4px',
						cursor: 'pointer'
					}}
				>
					Перейти к входу
				</button>
			</div>
		);
	}

	return (
		<form onSubmit={handleSubmit}>
			<h1>Registration</h1>

			{error && (
				<div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>
			)}

			<input
				placeholder="Email"
				value={email}
				onChange={e => setEmail(e.target.value)}
				disabled={loading}
				required
			/>

			<input
				type="password"
				placeholder="Password"
				value={password}
				onChange={e => setPassword(e.target.value)}
				disabled={loading}
				required
			/>

			<input
				placeholder="Pet name"
				value={petName}
				onChange={e => setPetName(e.target.value)}
				disabled={loading}
				required
			/>

			<input
				type="file"
				accept="image/*"
				onChange={e => {
					if (e.target.files?.[0]) {
						setPhoto(e.target.files[0]);
					}
				}}
				disabled={loading}
			/>

			<button
				type="submit"
				disabled={loading}
			>
				{loading ? 'Registering...' : 'Register'}
			</button>
		</form>
	);
};
