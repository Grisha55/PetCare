import { type ReactNode } from 'react';
import cls from './AuthLayout.module.scss';

interface AuthLayoutProps {
	children: ReactNode;
	title: string;
}

export const AuthLayout = ({ children, title }: AuthLayoutProps) => {
	return (
		<div className={cls.container}>
			<div className={cls.card}>
				<h1 className={cls.title}>{title}</h1>
				{children}
			</div>
		</div>
	);
};
