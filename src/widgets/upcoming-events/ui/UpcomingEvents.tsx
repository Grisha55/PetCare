import cls from './UpcomingEvents.module.scss';
import { getUpcomingEvents } from '../../../entities/event/model/selectors'


export const UpcomingEvents = () => {
  const events = getUpcomingEvents();

  return (
    <section className={cls.section}>
      <h3>Ближайшие события</h3>

      <div className={cls.list}>
        {events.map((event) => (
          <div
            key={event.id}
            className={`${cls.item} ${cls[event.status]}`}
          >
            <strong>{event.title}</strong>
            <div>{event.date}</div>
          </div>
        ))}
      </div>
    </section>
  );
};