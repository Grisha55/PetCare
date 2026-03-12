import { useState, useEffect, useCallback, useRef } from 'react';
import type { Tip } from '../model/types';
import { fetchTips } from '../api/tipsApi'

interface UseTipsProps {
  initialLimit?: number;
  savedTipIds?: Set<string>;
}

export const useTips = ({ initialLimit = 6, savedTipIds = new Set() }: UseTipsProps = {}) => {
  const [tips, setTips] = useState<Tip[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const initialLoadRef = useRef(false);

  // Обновление статуса saved при изменении savedTipIds
  useEffect(() => {
    console.log('🔄 Updating saved status with:', savedTipIds);
    setTips(prev =>
      prev.map(tip => ({
        ...tip,
        saved: savedTipIds.has(tip.id)
      }))
    );
  }, [savedTipIds]);

  // Первоначальная загрузка
  useEffect(() => {
    if (initialLoadRef.current) return;
    initialLoadRef.current = true;

    const loadInitialTips = async () => {
      setInitialLoading(true);
      try {
        const newTips = await fetchTips(initialLimit);
        console.log('📥 Initial tips loaded:', newTips.length);
        
        setTips(
          newTips.map(tip => ({
            ...tip,
            saved: savedTipIds.has(tip.id)
          }))
        );
      } catch (error) {
        console.error('Failed to load tips:', error);
      } finally {
        setInitialLoading(false);
      }
    };

    loadInitialTips();
  }, [initialLimit, savedTipIds]);

  // Загрузка дополнительных советов
  const loadMore = useCallback(async () => {
    if (loading) return;

    setLoading(true);
    try {
      const newTips = await fetchTips(initialLimit);
      console.log('📥 More tips loaded:', newTips.length);
      
      setTips(prev => [
        ...prev,
        ...newTips.map(tip => ({
          ...tip,
          saved: savedTipIds.has(tip.id)
        }))
      ]);
    } catch (error) {
      console.error('Failed to load more tips:', error);
    } finally {
      setLoading(false);
    }
  }, [loading, initialLimit, savedTipIds]);

  return {
    tips,
    loading,
    initialLoading,
    loadMore
  };
};