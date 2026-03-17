import { useState } from 'react';
import type { Tip } from '../model/types';
import type { CategoryFilterValue } from '../../../features/tips-filters';

export const useTipsFilter = (tips: Tip[]) => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilterValue>('all');
  const [showOnlySaved, setShowOnlySaved] = useState(false);

  const filteredTips = tips.filter(tip => {
    const matchesCategory = selectedCategory === 'all' || tip.category === selectedCategory;
    const matchesSaved = !showOnlySaved || tip.saved;
    return matchesCategory && matchesSaved;
  });

  const savedCount = filteredTips.filter(tip => tip.saved).length;

  return {
    filteredTips,
    selectedCategory,
    setSelectedCategory,
    showOnlySaved,
    setShowOnlySaved,
    savedCount
  };
};