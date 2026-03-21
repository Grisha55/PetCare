import { useState } from 'react';
import {
	type CreateMedicalRecord,
	type MedicalRecordType
} from '../../../entities/medical-record/model/types';
import cls from './AddMedicalRecord.module.scss';

interface Props {
	onAdd: (data: CreateMedicalRecord) => Promise<void> | void;
}

export const AddMedicalRecord = ({ onAdd }: Props) => {
	const [type, setType] = useState<MedicalRecordType>('vaccine');
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [date, setDate] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleSubmit: React.FormEventHandler<HTMLFormElement> = async e => {
		e.preventDefault();

		if (isSubmitting) return;

		setIsSubmitting(true);
		setError(null);

		try {
			await onAdd({
				type,
				title,
				description,
				date
			});

			// Очищаем только при успехе
			setTitle('');
			setDescription('');
			setDate('');
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Произошла ошибка');
			console.error('Failed to add medical record:', err);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<form
			className={cls.form}
			onSubmit={handleSubmit}
		>
			{error && <div className={cls.error}>{error}</div>}

			<div className={cls.field}>
				<label htmlFor="record-type">Тип записи</label>
				<select
					id="record-type"
					value={type}
					onChange={e => setType(e.target.value as MedicalRecordType)}
					disabled={isSubmitting}
				>
					<option value="vaccine">Прививка</option>
					<option value="medicine">Лекарство</option>
					<option value="visit">Посещение врача</option>
				</select>
			</div>

			<div className={cls.field}>
				<label htmlFor="record-title">Название</label>
				<input
					id="record-title"
					placeholder="Название"
					value={title}
					onChange={e => setTitle(e.target.value)}
					required
					disabled={isSubmitting}
				/>
			</div>

			<div className={cls.field}>
				<label htmlFor="record-description">Описание</label>
				<textarea
					id="record-description"
					placeholder="Описание"
					value={description}
					onChange={e => setDescription(e.target.value)}
					disabled={isSubmitting}
				/>
			</div>

			<div className={cls.field}>
				<label htmlFor="record-date">Дата</label>
				<input
					id="record-date"
					type="date"
					value={date}
					onChange={e => setDate(e.target.value)}
					required
					disabled={isSubmitting}
				/>
			</div>

			<button
				type="submit"
				className={cls.submitButton}
				disabled={isSubmitting}
			>
				{isSubmitting ? 'Добавление...' : 'Добавить'}
			</button>
		</form>
	);
};
