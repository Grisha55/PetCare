import cls from './TipCard.module.scss';
import { Tip } from '../model/types';
import { LikeButton } from '../../../features/like-tip/ui/LikeButton';

interface Props {
  tip: Tip;
}

export const TipCard = ({ tip }: Props) => {
  return (
    <div className={cls.card}>
      <img src={tip.image} alt={tip.title} />

      <div className={cls.content}>
        <div className={cls.header}>
          <h3>{tip.title}</h3>
          <LikeButton id={tip.id} />
        </div>

        <p>{tip.description}</p>
      </div>
    </div>
  );
};