import { type MedicalRecord } from '../../../entities/medical-record/model/types';
import cls from './PassportRecords.module.scss';

interface Props {
  records: MedicalRecord[];
}

export const PassportRecords = ({ records }: Props) => {
  return (
    <div className={cls.wrapper}>
      {records.map((record) => (
        <div key={record.id} className={`${cls.card} ${cls[record.type]}`}>
          <h3>{record.title}</h3>
          <p>{record.description}</p>
          <span>{record.date}</span>
        </div>
      ))}
    </div>
  );
};