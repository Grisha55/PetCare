import { type FC, type PropsWithChildren } from 'react';
import styles from './Card.module.scss';

interface CardProps extends PropsWithChildren {
	title?: string;
	className?: string;
}

export const Card: FC<CardProps> = ({ children, title, className = '' }) => {
	return (
		<div className={`${styles.card} ${className}`}>
			{title && <h3 className={styles.title}>{title}</h3>}
			{children}
		</div>
	);
};