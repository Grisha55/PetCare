import cls from './QuickActions.module.scss';

export const QuickActions = () => {
  return (
    <section className={cls.section}>
      <button className={cls.button}>➕ Событие</button>
      <button className={cls.button}>📄 Паспорт</button>
      <button className={cls.button}>💡 Совет</button>
    </section>
  );
};