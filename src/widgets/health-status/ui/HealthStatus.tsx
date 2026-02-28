import cls from './HealthStatus.module.scss';

export const HealthStatus = () => {
  return (
    <section className={cls.section}>
      <h3>Здоровье</h3>

      <div className={cls.row}>
        <span>Прививки</span>
        <span>✅</span>
      </div>
      <div className={cls.row}>
        <span>Паразиты</span>
        <span>🟡 скоро</span>
      </div>
      <div className={cls.row}>
        <span>Ветеринар</span>
        <span>❌ не посещался</span>
      </div>
    </section>
  );
};