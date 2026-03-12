import type { Tip } from '../../tip';

export interface SavedTip extends Tip {
  saved_at: string;
  user_id: string;
}

export interface SavedTipsStats {
  totalCount: number;
}