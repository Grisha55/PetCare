import cls from './ConfirmationScreen.module.scss';

interface ConfirmationScreenProps {
	email: string;
	onLoginClick: () => void;
}

export const ConfirmationScreen = ({
	email,
	onLoginClick
}: ConfirmationScreenProps) => {
	return (
		<div className={cls.container}>
			<h1>Почти готово! 🎉</h1>
			<p>
				На ваш email <strong>{email}</strong> отправлено письмо с
				подтверждением.
			</p>
			<p>
				Пожалуйста, перейдите по ссылке в письме, чтобы активировать аккаунт.
			</p>
			<button
				onClick={onLoginClick}
				className={cls.loginButton}
			>
				Перейти к входу
			</button>
		</div>
	);
};
