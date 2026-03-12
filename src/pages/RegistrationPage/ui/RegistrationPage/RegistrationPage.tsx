import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPet, uploadPetAvatar } from '../../../../entities/pet';
import { AuthFooter } from '../../../../features/auth-footer';
import { RegistrationForm } from '../../../../features/registration-form';
import { supabase } from '../../../../shared/api/supabase';
import { getRegistrationErrorMessage } from '../../../../shared/lib/error-handlers';
import { ConfirmationScreen } from '../../../../widgets/confirmation-screen';
import cls from './RegistrationPage.module.scss';

export const RegistrationPage = () => {
	const navigate = useNavigate();

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [needsEmailConfirmation, setNeedsEmailConfirmation] = useState(false);
	const [registeredEmail, setRegisteredEmail] = useState('');

	const handleSubmit = async ({
		email,
		password,
		petName,
		photo
	}: {
		email: string;
		password: string;
		petName: string;
		photo: File | null;
	}) => {
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
				setRegisteredEmail(email);
				setNeedsEmailConfirmation(true);
				return;
			}

			if (data.session) {
				const user = data.user;
				if (!user) throw new Error('User not found');

				const pet = await createPet(user.id, { name: petName });

				if (photo && pet) {
					await uploadPetAvatar(pet.id, photo);
				}

				navigate('/');
			}
		} catch (error) {
			console.error('Registration error:', error);
			setError(getRegistrationErrorMessage(error));
		} finally {
			setLoading(false);
		}
	};

	if (needsEmailConfirmation) {
		return (
			<ConfirmationScreen
				email={registeredEmail}
				onLoginClick={() => navigate('/login')}
			/>
		);
	}

	return (
		<div className={cls.container}>
			<div className={cls.card}>
				<h1 className={cls.title}>Регистрация</h1>

				<RegistrationForm
					onSubmit={handleSubmit}
					loading={loading}
					error={error}
				/>

				<AuthFooter
					text="Уже есть аккаунт?"
					linkText="Войти"
					linkTo="/login"
				/>
			</div>
		</div>
	);
};
