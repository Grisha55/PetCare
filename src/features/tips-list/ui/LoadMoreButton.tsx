import { Sparkles } from 'lucide-react';
import { type LoadMoreProps } from '../model/types';
import styles from './LoadMoreButton.module.scss';

export const LoadMoreButton = ({ onLoadMore, loading, totalCount, disabled }: LoadMoreProps) => {
  if (loading) {
    return (
      <div className={styles.buttonContainer}>
        <button disabled className={styles.loadingButton}>
          <div className={styles.loadingSpinner} />
          <span>Загрузка...</span>
        </button>
      </div>
    );
  }

  if (disabled) return null;

  return (
    <div className={styles.buttonContainer}>
      <button onClick={onLoadMore} className={styles.loadButton}>
        <span className={styles.buttonGradient} />
        <Sparkles className={styles.buttonIcon} />
        <span className={styles.buttonText}>Показать еще советы</span>
        <span className={styles.buttonCount}>({totalCount} загружено)</span>
      </button>
    </div>
  );
};