import cls from './SubmitButton.module.scss';

interface SubmitButtonProps {
	loading: boolean;
}

export const SubmitButton = ({ loading }: SubmitButtonProps) => {
	return (
		<button
			type="submit"
			className={cls.submitButton}
			disabled={loading}
		>
			{loading ? 'Вход...' : 'Войти'}
		</button>
	);
};
