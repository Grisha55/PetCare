import { useState } from 'react'

export const useLikeTip = (id: string) => {
  const [liked, setLiked] = useState(() => {
    const stored = localStorage.getItem('likedTips');
    const parsed = stored ? JSON.parse(stored) : [];
    return parsed.includes(id);
  });

  const toggleLike = () => {
    const stored = localStorage.getItem('likedTips');
    const parsed: string[] = stored ? JSON.parse(stored) : [];

    let updated;

    if (parsed.includes(id)) {
      updated = parsed.filter((item) => item !== id);
      setLiked(false);
    } else {
      updated = [...parsed, id];
      setLiked(true);
    }

    localStorage.setItem('likedTips', JSON.stringify(updated));
  };

  return { liked, toggleLike };
};