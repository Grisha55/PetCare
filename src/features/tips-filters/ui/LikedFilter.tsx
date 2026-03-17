import { Heart } from 'lucide-react';
import { type LikedFilterProps } from '../model/types';
import styles from './LikedFilter.module.scss';

export const LikedFilter = ({ 
  showOnlyLiked, 
  onToggle, 
  likedCount, 
  isAuthenticated 
}: LikedFilterProps) => {
  if (!isAuthenticated) return null;

  return (
    <div className={styles.likedFilter}>
      <button
        className={`${styles.likedButton} ${
          showOnlyLiked ? styles.active : ''
        }`}
        onClick={onToggle}
      >
        <Heart 
          fill={showOnlyLiked ? '#ef4444' : 'none'}
          className={styles.heartIcon}
        />
        <span>
          {showOnlyLiked ? 'Все советы' : 'Только понравившиеся'}
        </span>
        {showOnlyLiked && (
          <span className={styles.likedCount}>
            ({likedCount})
          </span>
        )}
      </button>
    </div>
  );
};