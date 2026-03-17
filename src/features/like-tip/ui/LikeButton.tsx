import cls from './LikeButton.module.scss';
import { useLikeTip } from '../model/useLikeTip';

interface Props {
  id: string;
}

export const LikeButton = ({ id }: Props) => {
  const { liked, toggleLike } = useLikeTip(id);

  return (
    <button
      className={`${cls.button} ${liked ? cls.liked : ''}`}
      onClick={toggleLike}
    >
      ♥
    </button>
  );
};