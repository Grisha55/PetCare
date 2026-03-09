import { useCallback } from 'react';
import { toggleTipLike } from '../../../entities/tip';
import { useAuth } from '../../../app/providers/auth-provider';

export const useLikeTip = (onLikeToggle?: (tipId: string, liked: boolean) => void) => {
  const { user } = useAuth();

  const handleLikeToggle = useCallback(async (tipId: string, liked: boolean) => {
    if (!user) return;

    try {
      await toggleTipLike(user.id, tipId);
      onLikeToggle?.(tipId, liked);
    } catch (error) {
      console.error('Failed to toggle like:', error);
    }
  }, [user, onLikeToggle]);

  return { handleLikeToggle, isAuthenticated: !!user };
};