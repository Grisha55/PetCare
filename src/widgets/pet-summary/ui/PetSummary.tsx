import cls from './PetSummary.module.scss';
import { getPet } from '../../../entities/pet/model/selectors'

export const PetSummary = () => {
  const pet = getPet();

  return (
    <section className={cls.card}>
      <img src={pet.avatar} alt={pet.name} className={cls.avatar} />

      <div className={cls.info}>
        <h2>{pet.name}</h2>
        <p>
          {pet.type === 'cat' ? 'Кот' : 'Пёс'}, {pet.age} года
        </p>
        <span className={cls.status}>Все показатели в норме</span>
      </div>
    </section>
  );
};