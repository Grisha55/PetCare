import cls from './DailyTip.module.scss';

export const DailyTip = () => {
  return (
    <section className={cls.card}>
      <div className={cls.title}>Совет дня</div>
      <div className={cls.text}>
        Регулярно мой миски питомца — это снижает риск инфекций.
      </div>
    </section>
  );
};