import { Link } from 'react-router-dom';
import cls from './AuthFooter.module.scss';

interface AuthFooterProps {
	text: string;
	linkText: string;
	linkTo: string;
}

export const AuthFooter = ({ text, linkText, linkTo }: AuthFooterProps) => {
	return (
		<div className={cls.footer}>
			<p>{text}</p>
			<Link
				to={linkTo}
				className={cls.link}
			>
				{linkText}
			</Link>
		</div>
	);
};
