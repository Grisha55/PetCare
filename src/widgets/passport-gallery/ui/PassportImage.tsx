import { useState } from 'react'
import cls from './PassportGallery.module.scss';
import { PassportPreviewModal } from '../../../features/passport-preview'

interface Props {
  image: {
    id: string;
    url: string;
  };
  onDelete: (id: string) => void;
}

export const PassportImage = ({ image, onDelete }: Props) => {
  const [preview, setPreview] = useState<string | null>(null);

  return (
    <div className={cls.card}>
      <img src={image.url} alt="passport" />

      <div className={cls.overlay}>
        <button onClick={() => setPreview(image.url)}>🔍</button>
        <button onClick={() => onDelete(image.id)}>🗑</button>
      </div>

      <PassportPreviewModal image={preview} onClose={() => setPreview(null)} />
    </div>
  );
};