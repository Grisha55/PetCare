import { Heart } from 'lucide-react';
import { useState } from 'react';
import { toggleTipLike } from '../api/tipsLikesApi';
import styles from './TipCard.module.scss';
import { useAuth } from '../../../app/providers/auth-provider'
import type { Tip } from '../model/types'

interface TipCardProps {
  tip: Tip;
  onLikeToggle?: (tipId: string, liked: boolean) => void;
}

export const TipCard = ({ tip, onLikeToggle }: TipCardProps) => {
  const [liked, setLiked] = useState(tip.liked || false);
  const [isLiking, setIsLiking] = useState(false);
  const { user } = useAuth();

  const handleLike = async () => {
    if (!user || isLiking) return;

    setIsLiking(true);
    try {
      await toggleTipLike(user.id, tip.id);
      setLiked(!liked);
      onLikeToggle?.(tip.id, !liked);
    } catch (error) {
      console.error('Failed to toggle like:', error);
    } finally {
      setIsLiking(false);
    }
  };

  const categoryColors = {
    health: '#16a34a',
    training: '#2563eb',
    nutrition: '#9333ea'
  };

  return (
    <div className={styles.card}>
      <div className={styles.categoryBadge} style={{ backgroundColor: categoryColors[tip.category] }}>
        {tip.category}
      </div>
      
      <h3 className={styles.title}>{tip.title}</h3>
      <p className={styles.content}>{tip.content}</p>
      
      <div className={styles.footer}>
        <button
          onClick={handleLike}
          disabled={!user || isLiking}
          className={`${styles.likeButton} ${liked ? styles.liked : ''}`}
        >
          <Heart 
            className={styles.heartIcon} 
            fill={liked ? '#ef4444' : 'none'}
          />
          <span>{liked ? 'Saved' : 'Save'}</span>
        </button>
        
        {tip.link && (
          <a href={tip.link} target="_blank" rel="noopener noreferrer" className={styles.readMore}>
            Read more →
          </a>
        )}
      </div>
    </div>
  );
};