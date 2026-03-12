import { Link } from 'react-router-dom';
import cls from './RegisterLink.module.scss';

export const RegisterLink = () => {
	return (
		<div className={cls.footer}>
			<p>Нет аккаунта?</p>
			<Link
				to="/registration"
				className={cls.registerLink}
			>
				Зарегистрироваться
			</Link>
		</div>
	);
};
