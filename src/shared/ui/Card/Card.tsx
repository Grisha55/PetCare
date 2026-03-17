import { type FC, type ReactNode } from 'react';
import cls from './Card.module.scss';

interface CardProps {
	title?: string;
	children: ReactNode;
	className?: string;
}

export const Card: FC<CardProps> = ({ title, children, className }) => {
	return (
		<div className={`${cls.card} ${className || ''}`}>
			{title && <h2 className={cls.title}>{title}</h2>}
			<div className={cls.content}>{children}</div>
		</div>
	);
};
