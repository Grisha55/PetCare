import cls from './PassportGallery.module.scss';
import { passportImages } from '../../../entities/passport';
import { PassportImage } from './PassportImage';
import { PassportUploadButton } from '../../../features/passport-upload';
import { ExportPassportButton } from '../../../features/passport-export/ui/ExportPassportButton'

export const PassportGallery = () => {
  return (
    <section className={cls.section}>
      <div className={cls.header}>
        <h2>Ветеринарный паспорт</h2>
        <PassportUploadButton />
        <ExportPassportButton />
      </div>

      <div className={cls.grid}>
        {passportImages.map((img) => (
          <PassportImage key={img.id} image={img} />
        ))}
      </div>
    </section>
  );
};