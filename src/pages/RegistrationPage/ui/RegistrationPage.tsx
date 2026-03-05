import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../app/providers/auth-provider';

export const RegistrationPage = () => {
	const { register, login } = useAuth();
	const navigate = useNavigate();

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const handleSubmit: React.FormEventHandler<HTMLFormElement> = async e => {
		e.preventDefault();

		try {
			await register(email, password);
			await login(email, password);

			navigate('/');
		} catch {
			alert('Registration error');
		}
	};

	return (
		<form onSubmit={handleSubmit}>
      <h1>Registration</h1>
			<input
				placeholder="Email"
				onChange={e => setEmail(e.target.value)}
			/>

			<input
				type="password"
				placeholder="Password"
				onChange={e => setPassword(e.target.value)}
			/>

			<button type="submit">Register</button>
		</form>
	);
};
