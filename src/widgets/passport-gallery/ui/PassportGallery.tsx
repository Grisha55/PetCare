import cls from './PassportGallery.module.scss';
import { passportImages } from '../../../entities/passport';
import { PassportImage } from './PassportImage';
import { PassportUploadButton } from '../../../features/passport-upload';
import { ExportPassportButton } from '../../../features/passport-export/ui/ExportPassportButton'
import { useState } from 'react'

export const PassportGallery = () => {
  const [images, setImages] = useState(passportImages);

  const handleDeleteBtn = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  }

  const handleAddPhoto = (file: File) => {
    const newImage = {
      id: String(Date.now()),
      url: URL.createObjectURL(file),
    };

    setImages((prev) => [...prev, newImage]);
  }

  return (
    <section className={cls.section}>
      <div className={cls.header}>
        <h2>Ветеринарный паспорт</h2>
        <PassportUploadButton addPhoto={handleAddPhoto} />
        <ExportPassportButton />
      </div>

      <div className={cls.grid}>
        {images.map((img) => (
          <PassportImage key={img.id} image={img} onDelete={handleDeleteBtn} />
        ))}
      </div>
    </section>
  );
};