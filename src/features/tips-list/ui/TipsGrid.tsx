import { TipCard, TipSkeleton } from '../../../entities/tip';
import { type TipsListProps } from '../model/types';
import styles from './TipsGrid.module.scss';

export const TipsGrid = ({ tips, loading, onLikeToggle, className }: TipsListProps) => {
  return (
    <div className={`${styles.grid} ${className || ''}`}>
      {tips.map((tip, index) => (
        <div
          key={tip.id}
          className={styles.cardWrapper}
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <TipCard tip={tip} onLikeToggle={onLikeToggle} />
        </div>
      ))}

      {loading && Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className={styles.skeletonWrapper}
          style={{ animationDelay: `${i * 100}ms` }}
        >
          <TipSkeleton />
        </div>
      ))}
    </div>
  );
};