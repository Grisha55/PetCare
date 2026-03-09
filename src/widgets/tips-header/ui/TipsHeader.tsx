import { PawPrint } from 'lucide-react';
import { 
  CategoryFilter, 
  LikedFilter, 
  ActiveFilter,
  type CategoryFilterValue 
} from '../../../features/tips-filters';
import styles from './TipsHeader.module.scss';

interface TipsHeaderProps {
  selectedCategory: CategoryFilterValue;
  onCategoryChange: (category: CategoryFilterValue) => void;
  showOnlyLiked: boolean;
  onLikedToggle: () => void;
  likedCount: number;
  isAuthenticated: boolean;
}

export const TipsHeader = ({
  selectedCategory,
  onCategoryChange,
  showOnlyLiked,
  onLikedToggle,
  likedCount,
  isAuthenticated
}: TipsHeaderProps) => {
  return (
    <div className={styles.header}>
      <div className={styles.iconWrapper}>
        <PawPrint />
      </div>
      <h1 className={styles.title}>Veterinary Tips</h1>
      <p className={styles.subtitle}>
        Профессиональные советы ветеринаров для здоровья и счастья ваших питомцев
      </p>

      <CategoryFilter 
        selectedCategory={selectedCategory} 
        onCategoryChange={onCategoryChange} 
      />

      <LikedFilter
        showOnlyLiked={showOnlyLiked}
        onToggle={onLikedToggle}
        likedCount={likedCount}
        isAuthenticated={isAuthenticated}
      />

      <ActiveFilter
        selectedCategory={selectedCategory}
        onClear={() => onCategoryChange('all')}
      />
    </div>
  );
};