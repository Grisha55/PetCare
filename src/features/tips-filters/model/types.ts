import { type TipCategory } from '../../../entities/tip';

export type CategoryFilterValue = TipCategory | 'all';

export interface CategoryFilterProps {
  selectedCategory: CategoryFilterValue;
  onCategoryChange: (category: CategoryFilterValue) => void;
}

export interface LikedFilterProps {
  showOnlyLiked: boolean;
  onToggle: () => void;
  likedCount: number;
  isAuthenticated: boolean;
}

export interface ActiveFilterProps {
  selectedCategory: CategoryFilterValue;
  onClear: () => void;
}