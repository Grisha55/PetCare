import { type MedicalRecord } from '../../../entities/medical-record/model/types';
import cls from './PassportRecords.module.scss';

interface Props {
	records: MedicalRecord[];
	onDelete: (id: string) => void;
}

export const PassportRecords = ({ records, onDelete }: Props) => {
	console.log('Records to display:', records);

	if (!records || records.length === 0) {
		return <div className={cls.empty}>Нет записей</div>;
	}

	return (
		<div className={cls.wrapper}>
			{records.map(record => {
				if (!record || !record.id) return null;

				return (
					<div
						key={record.id}
						className={`${cls.card} ${cls[record.type] || ''}`}
					>
						<h3>{record.title || 'Без названия'}</h3>
						{record.description && <p>{record.description}</p>}
						<span>{record.date || 'Дата не указана'}</span>
						<button
							className={cls.deleteButton}
							onClick={() => onDelete(record.id)}
						>
							🗑
						</button>
					</div>
				);
			})}
		</div>
	);
};
