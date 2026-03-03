import cls from './TipsList.module.scss';
import { Tip } from '@/entities/tip/model/types';
import { TipCard } from '@/entities/tip/ui/TipCard';

interface Props {
  tips: Tip[];
}

export const TipsList = ({ tips }: Props) => {
  return (
    <div className={cls.grid}>
      {tips.map((tip) => (
        <TipCard key={tip.id} tip={tip} />
      ))}
    </div>
  );
};