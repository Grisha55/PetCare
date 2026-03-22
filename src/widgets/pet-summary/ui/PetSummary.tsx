import { useState } from 'react';
import type { MedicalRecord } from '../../../entities/medical-record/model/types';
import cls from './PetSummary.module.scss';

interface PetSummaryProps {
	petImg: string | null;
	petName: string | null;
	records: MedicalRecord[];
	isLoading?: boolean; // Добавляем пропс для состояния загрузки
}

export const PetSummary = ({
	petImg,
	petName,
	records,
	isLoading = false
}: PetSummaryProps) => {
	const petStatus =
		records.length === 0 ? 'Все супер!!!' : 'Необходимо сделать визит к врачу';
	const [imgError, setImgError] = useState(false);

	// Получаем первую букву имени для fallback
	const firstLetter = petName?.[0]?.toUpperCase() || '?';

	// Определяем, что показывать в аватаре
	const renderAvatar = () => {
		if (isLoading) {
			return <div className={cls.avatarSkeleton}>...</div>;
		}

		// Если есть URL и не было ошибки загрузки
		if (petImg && !imgError) {
			return (
				<img
					src={petImg}
					alt={`${petName || 'NoName'}'s avatar`}
					className={cls.avatar}
					onError={() => setImgError(true)}
				/>
			);
		}

		// Fallback с первой буквой имени
		return <div className={cls.avatarFallback}>{firstLetter}</div>;
	};

	return (
		<section className={cls.card}>
			{renderAvatar()}

			<div className={cls.info}>
				<h2>{petName || 'NoName'}</h2>
				<span className={cls.status}>{petStatus}</span>
			</div>
		</section>
	);
};
