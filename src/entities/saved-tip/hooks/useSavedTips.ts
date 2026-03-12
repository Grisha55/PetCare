import { useState, useEffect, useCallback } from 'react';
import type { SavedTip } from '../model/types';
import { getSavedTips, unsaveTip } from '../../../shared/api/savedTipsApi'

interface UseSavedTipsProps {
  userId: string | undefined;
}

export const useSavedTips = ({ userId }: UseSavedTipsProps) => {
  const [savedTipIds, setSavedTipIds] = useState<Set<string>>(new Set());
  const [savedTips, setSavedTips] = useState<SavedTip[]>([]);
  const [loading, setLoading] = useState(false);

  // Загрузка ID сохраненных советов
  useEffect(() => {
    const loadSavedTipIds = async () => {
      if (!userId) {
        setSavedTipIds(new Set());
        setSavedTips([]);
        return;
      }

      setLoading(true);
      try {
        const tips = await getSavedTips(userId);
        const ids = new Set(tips.map(tip => tip.id));
        setSavedTipIds(ids);
        setSavedTips(tips);
      } catch (error) {
        console.error('Failed to load saved tips:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSavedTipIds();
  }, [userId]);

  // Переключение сохранения совета
  const toggleSave = useCallback(async (tipId: string) => {
    if (!userId) return false;

    try {
      const isNowSaved = !savedTipIds.has(tipId);
      
      if (isNowSaved) {
        // Здесь нужно получить полные данные совета
        // Пока просто обновляем Set
        setSavedTipIds(prev => new Set(prev).add(tipId));
      } else {
        await unsaveTip(userId, tipId);
        setSavedTipIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(tipId);
          return newSet;
        });
      }
      
      return isNowSaved;
    } catch (error) {
      console.error('Failed to toggle save:', error);
      return false;
    }
  }, [userId, savedTipIds]);

  const isSaved = useCallback((tipId: string) => savedTipIds.has(tipId), [savedTipIds]);

  return {
    savedTipIds,
    savedTips,
    loading,
    toggleSave,
    isSaved
  };
};