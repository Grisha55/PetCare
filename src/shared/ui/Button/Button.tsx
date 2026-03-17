import { type ButtonHTMLAttributes, type FC } from 'react';
import styles from './Button.module.scss';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: 'primary' | 'danger' | 'outline';
	fullWidth?: boolean;
}

export const Button: FC<ButtonProps> = ({
	children,
	variant = 'primary',
	fullWidth = false,
	className = '',
	...props
}) => {
	return (
		<button
			className={`${styles.button} ${styles[variant]} ${fullWidth ? styles.fullWidth : ''} ${className}`}
			{...props}
		>
			{children}
		</button>
	);
};