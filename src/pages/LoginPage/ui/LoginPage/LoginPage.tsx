import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../app/providers/auth-provider';
import { LoginForm } from '../../../../features/auth/login-form/ui/LoginForm/LoginForm';
import { AuthLayout } from '../../../../widgets/auth-layout/ui/AuthLayout/AuthLayout';
import { RegisterLink } from '../../../../features/auth/register-link/ui/RegisterLink/RegisterLink';

const LoginPage = () => {
	const { login } = useAuth();
	const navigate = useNavigate();

	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (email: string, password: string) => {
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
		<AuthLayout title="Вход в аккаунт">
			<LoginForm
				onSubmit={handleSubmit}
				loading={loading}
				error={error}
			/>
			<RegisterLink />
		</AuthLayout>
	);
};

export default LoginPage;
