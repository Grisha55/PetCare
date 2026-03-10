import type { MedicalRecord } from '../../../entities/medical-record/model/types';
import cls from './PetSummary.module.scss';

interface PetSummaryProps {
	petImg: string | null;
	petName: string | null;
	records: MedicalRecord[];
}

export const PetSummary = ({ petImg, petName, records }: PetSummaryProps) => {
	const DEFAULT_AVATAR_URL = '/passport-1';
	const petStatus =
		records.length === 0 ? 'Все супер!!!' : 'Необходимо сделать визит к врачу';

	return (
		<section className={cls.card}>
			<img
				src={petImg || DEFAULT_AVATAR_URL}
				alt={petName || 'NoName'}
				className={cls.avatar}
			/>

			<div className={cls.info}>
				<h2>{petName || 'NoName'}</h2>
				<span className={cls.status}>{petStatus}</span>
			</div>
		</section>
	);
};
