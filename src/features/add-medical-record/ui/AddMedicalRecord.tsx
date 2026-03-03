import { useState } from 'react';
import { type CreateMedicalRecord, type MedicalRecordType } from '../../../entities/medical-record/model/types';
import cls from './AddMedicalRecord.module.scss';

interface Props { 
  onAdd: (data: CreateMedicalRecord) => void;
 }

export const AddMedicalRecord = ({ onAdd }: Props) => {
  const [type, setType] = useState<MedicalRecordType>('vaccine');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    onAdd({
      type,
      title,
      description,
      date,
    });

    setTitle('');
    setDescription('');
    setDate('');
  };

  return (
    <form className={cls.form} onSubmit={handleSubmit}>
      <select value={type} onChange={(e) => setType(e.target.value as MedicalRecordType)}>
        <option value="vaccine">Прививка</option>
        <option value="medicine">Лекарство</option>
        <option value="visit">Посещение врача</option>
      </select>

      <input
        placeholder="Название"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <textarea
        placeholder="Описание"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />

      <button type="submit">Добавить</button>
    </form>
  );
};