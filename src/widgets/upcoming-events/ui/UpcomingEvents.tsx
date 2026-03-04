import cls from './UpcomingEvents.module.scss';
import { getUpcomingEvents } from '../../../entities/event/model/selectors';
import type { MedicalRecord } from '../../../entities/medical-record/model/types';

interface Props {
  records: MedicalRecord[];
  onDelete: (id: string) => void;
}

export const UpcomingEvents = ({ records, onDelete }: Props) => {
  const events = getUpcomingEvents(records); // ✅ передаем records

  return (
    <section className={cls.section}>
      <h3>Ближайшие события</h3>

      <div className={cls.list}>
        {events.length === 0 && <p>Нет событий</p>}

        {events.map((event) => (
          <div
            key={event.id}
            className={`${cls.item} ${cls[event.status]}`}
          >
            <strong>{event.title}</strong>
            <div>{event.date}</div>
            <button className={cls.deleteButton} onClick={() => onDelete(event.id)}>
              🗑️
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};