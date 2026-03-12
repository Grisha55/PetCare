import { useState } from 'react';
import cls from './LoginForm.module.scss';
import { LoginField } from '../../../login-field/ui/LoginField/LoginField';
import { SubmitButton } from '../../../submit-button/ui/SubmitButton/SubmitButton';

interface LoginFormProps {
	onSubmit: (email: string, password: string) => Promise<void>;
	loading: boolean;
	error: string | null;
}

export const LoginForm = ({ onSubmit, loading, error }: LoginFormProps) => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		await onSubmit(email, password);
	};

	return (
		<form
			onSubmit={handleSubmit}
			className={cls.form}
		>
			{error && <div className={cls.error}>{error}</div>}

			<LoginField
				id="email"
				label="Email"
				type="email"
				placeholder="your@email.com"
				value={email}
				onChange={setEmail}
				disabled={loading}
				required
			/>

			<LoginField
				id="password"
				label="Пароль"
				type="password"
				placeholder="••••••••"
				value={password}
				onChange={setPassword}
				disabled={loading}
				required
			/>

			<SubmitButton loading={loading} />
		</form>
	);
};
