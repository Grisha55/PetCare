import type { PassportPhoto } from '../../../entities/passport';
import { ExportPassportButton } from '../../../features/passport-export/ui/ExportPassportButton';
import { PhotoUploader } from '../../../features/passport-upload/ui/PhotoUpploader/PhotoUploader';
import cls from './PassportGallery.module.scss';
import { PassportImage } from './PassportImage';

interface Props {
	images: { id: string; url: string }[];
	onUpload: (photo: PassportPhoto) => void;
	onDelete: (id: string, url: string) => void;
}

export const PassportGallery = ({ images, onDelete }: Props) => {
	return (
		<section className={cls.section}>
			<div className={cls.header}>
				<h2>Ветеринарный паспорт</h2>

				<PhotoUploader />

				<ExportPassportButton />
			</div>

			<div className={cls.grid}>
				{images.map(img => (
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
