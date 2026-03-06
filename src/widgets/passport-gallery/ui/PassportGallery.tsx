import cls from './PassportGallery.module.scss';
import { PassportImage } from './PassportImage';
import { PassportUploadButton } from '../../../features/passport-upload';
import { ExportPassportButton } from '../../../features/passport-export/ui/ExportPassportButton'

interface Props {
  images: { id: string; url: string }[]
  onUpload: (file: File) => void
  onDelete: (id: string, url: string) => void
}

export const PassportGallery = ({ images, onUpload, onDelete }: Props) => {
  return (
    <section className={cls.section}>
      <div className={cls.header}>
        <h2>Ветеринарный паспорт</h2>

        <PassportUploadButton addPhoto={onUpload} />

        <ExportPassportButton />
      </div>

      <div className={cls.grid}>
        {images.map((img) => (
          <PassportImage
            key={img.id}
            image={img}
            onDelete={() => onDelete(img.id, img.url)}
          />
        ))}
      </div>
    </section>
  );
};