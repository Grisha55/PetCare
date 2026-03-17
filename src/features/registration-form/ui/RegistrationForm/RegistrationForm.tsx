import { useState } from 'react';
import { RegistrationField } from '../RegistrationField/RegistrationField';
import { PhotoField } from '../PhotoField/PhotoField';
import cls from './RegistrationForm.module.scss';

interface RegistrationFormProps {
	onSubmit: (data: {
		email: string;
		password: string;
		petName: string;
		photo: File | null;
	}) => Promise<void>;
	loading: boolean;
	error: string | null;
}

export const RegistrationForm = ({
	onSubmit,
	loading,
	error
}: RegistrationFormProps) => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [petName, setPetName] = useState('');
	const [photo, setPhoto] = useState<File | null>(null);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		await onSubmit({ email, password, petName, photo });
	};

	return (
		<form
			onSubmit={handleSubmit}
			className={cls.form}
		>
			{error && <div className={cls.error}>{error}</div>}

			<RegistrationField
				id="email"
				label="Email"
				type="email"
				placeholder="your@email.com"
				value={email}
				onChange={setEmail}
				disabled={loading}
				required
			/>

			<RegistrationField
				id="password"
				label="Пароль"
				type="password"
				placeholder="••••••••"
				value={password}
				onChange={setPassword}
				disabled={loading}
				required
			/>

			<RegistrationField
				id="petName"
				label="Имя питомца"
				type="text"
				placeholder="Мурзик"
				value={petName}
				onChange={setPetName}
				disabled={loading}
				required
			/>

			<PhotoField
				onChange={setPhoto}
				disabled={loading}
			/>

			<button
				type="submit"
				className={cls.submitButton}
				disabled={loading}
			>
				{loading ? 'Регистрация...' : 'Зарегистрироваться'}
			</button>
		</form>
	);
};
