import { useState } from 'react';
import { Upload } from 'lucide-react';
import cls from './PhotoUploader.module.scss';
import { usePet } from '../../../../app/providers/pet-provider/usePet';
import { usePassport } from '../../../../entities/passport/context';
import { uploadPassportPhoto } from '../../../../shared/api/passportApi';

export const PhotoUploader = () => {
	const [uploading, setUploading] = useState(false);
	const { pet } = usePet();
	const { addPhoto } = usePassport();

	const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = Array.from(e.target.files || []);
		if (!pet?.id || files.length === 0) return;

		setUploading(true);

		try {
			for (const file of files) {
				const uploadedPhotos = await uploadPassportPhoto(pet.id, file);
				// Добавляем каждое фото в контекст
				uploadedPhotos.forEach(photo => addPhoto(photo));
			}

			// Или просто обновляем весь список
			// await refreshPhotos();
		} catch (error) {
			console.error('Failed to upload photos:', error);
		} finally {
			setUploading(false);
			// Очищаем input
			e.target.value = '';
		}
	};

	return (
		<div className={cls.uploader}>
			<label
				className={`${cls.uploadButton} ${uploading ? cls.uploading : ''}`}
			>
				<Upload
					size={20}
					className={uploading ? cls.spinning : ''}
				/>
				<span>{uploading ? 'Загрузка...' : 'Выбрать фотографии'}</span>
				<input
					type="file"
					accept="image/*"
					multiple
					onChange={handleFileSelect}
					disabled={uploading}
					className={cls.fileInput}
				/>
			</label>
		</div>
	);
};
