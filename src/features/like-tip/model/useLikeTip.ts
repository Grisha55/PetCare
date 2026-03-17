import { useEffect, useState } from 'react';

export const useLikeTip = (id: string) => {
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('likedTips');
    const parsed = stored ? JSON.parse(stored) : [];
    setLiked(parsed.includes(id));
  }, [id]);

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