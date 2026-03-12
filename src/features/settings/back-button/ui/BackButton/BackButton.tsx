import { type FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import cls from './BackButton.module.scss';

interface BackButtonProps {
	className?: string;
}

export const BackButton: FC<BackButtonProps> = ({ className }) => {
	const navigate = useNavigate();

	const handleGoBack = () => {
		navigate(-1);
	};

	return (
		<button
			onClick={handleGoBack}
			className={`${cls.backButton} ${className || ''}`}
			aria-label="Вернуться назад"
		>
			<ArrowLeft size={20} />
			<span>Назад</span>
		</button>
	);
};
