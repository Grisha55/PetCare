import { useState } from 'react';
import cls from './ProfileForm.module.scss';
import { useAuth } from '../../../app/providers/auth-provider';
import { useProfile } from '../../../entities/user/hooks/useProfile';

export const ProfileForm = () => {
	const { user } = useAuth();
	const {
		profile,
		updateUserData,
		loading,
		error: profileError
	} = useProfile();

	// Инициализируем состояние напрямую из пропсов
	// Так как компонент пересоздается при изменении key,
	// начальные значения всегда будут актуальными
	const [formData, setFormData] = useState({
		name: profile?.name || user?.user_metadata?.name || '',
		email: user?.email || '',
		password: '',
		confirmPassword: ''
	});

	const [formError, setFormError] = useState<string | null>(null);
	const [successMessage, setSuccessMessage] = useState<string | null>(null);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData(prev => ({ ...prev, [name]: value }));
		setFormError(null);
		setSuccessMessage(null);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setFormError(null);
		setSuccessMessage(null);

		// Валидация
		if (formData.password !== formData.confirmPassword) {
			setFormError('Пароли не совпадают');
			return;
		}

		if (formData.password && formData.password.length < 6) {
			setFormError('Пароль должен быть не менее 6 символов');
			return;
		}

		const updates: { name?: string; email?: string; password?: string } = {};

		if (formData.name !== (profile?.name || user?.user_metadata?.name)) {
			updates.name = formData.name;
		}

		if (formData.email !== user?.email) {
			updates.email = formData.email;
		}

		if (formData.password) {
			updates.password = formData.password;
		}

		if (Object.keys(updates).length === 0) {
			setSuccessMessage('Нет изменений для сохранения');
			return;
		}

		try {
			await updateUserData(updates);

			// Обновляем форму с новыми данными, но без пересоздания компонента
			setFormData(() => ({
				name: profile?.name || user?.user_metadata?.name || '', // Здесь данные уже должны быть обновлены
				email: user?.email || '',
				password: '',
				confirmPassword: ''
			}));

			setSuccessMessage('Профиль успешно обновлен');
		} catch (err) {
			setFormError(
				err instanceof Error ? err.message : 'Ошибка при обновлении профиля'
			);
		}
	};

	return (
		<form
			className={cls.form}
			onSubmit={handleSubmit}
		>
			<h2>Личные данные</h2>

			{profileError && <div className={cls.error}>{profileError}</div>}
			{formError && <div className={cls.error}>{formError}</div>}
			{successMessage && <div className={cls.success}>{successMessage}</div>}

			<label>
				Имя
				<input
					name="name"
					value={formData.name}
					onChange={handleChange}
					disabled={loading}
					placeholder="Введите ваше имя"
				/>
			</label>

			<label>
				Email
				<input
					name="email"
					type="email"
					value={formData.email}
					onChange={handleChange}
					disabled={loading}
					placeholder="Введите email"
				/>
			</label>

			<label>
				Новый пароль
				<input
					name="password"
					type="password"
					value={formData.password}
					onChange={handleChange}
					disabled={loading}
					placeholder="Оставьте пустым, если не хотите менять"
				/>
			</label>

			<label>
				Повторите пароль
				<input
					name="confirmPassword"
					type="password"
					value={formData.confirmPassword}
					onChange={handleChange}
					disabled={loading}
					placeholder="Повторите новый пароль"
				/>
			</label>

			<div className={cls.actions}>
				<button
					type="submit"
					disabled={loading}
				>
					{loading ? 'Сохранение...' : 'Сохранить изменения'}
				</button>
			</div>
		</form>
	);
};
