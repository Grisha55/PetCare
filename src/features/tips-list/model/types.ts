import { type Tip } from '../../../entities/tip';

export interface TipsListProps {
  tips: Tip[];
  loading?: boolean;
  onLikeToggle: (tipId: string, liked: boolean) => void;
  className?: string;
}

export interface LoadMoreProps {
  onLoadMore: () => void;
  loading: boolean;
  totalCount: number;
  disabled?: boolean;
}