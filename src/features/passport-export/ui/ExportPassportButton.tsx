import { jsPDF } from 'jspdf';
import { Download } from 'lucide-react';
import { useState } from 'react';
import cls from './ExportPassportButton.module.scss';
import { usePassport } from '../../../entities/passport/context';

export const ExportPassportButton = () => {
	const [isExporting, setIsExporting] = useState(false);
	const { photos, loading } = usePassport();

	const exportPdf = async () => {
		if (isExporting || photos.length === 0) return;

		setIsExporting(true);

		try {
			const pdf = new jsPDF();

			for (let i = 0; i < photos.length; i++) {
				const photo = photos[i];

				if (i > 0) pdf.addPage();

				// Загружаем изображение по URL
				const img = new Image();
				img.crossOrigin = 'Anonymous';

				await new Promise<void>((resolve, reject) => {
					img.onload = () => resolve();
					img.onerror = reject;
					img.src = photo.url;
				});

				pdf.addImage(img, 'JPEG', 10, 10, 180, 250);
			}

			pdf.save(`pet-passport-${new Date().toISOString().split('T')[0]}.pdf`);
		} catch (error) {
			console.error('Failed to export PDF:', error);
		} finally {
			setIsExporting(false);
		}
	};

	const photoCount = photos.length;

	return (
		<button
			className={`${cls.exportButton} ${isExporting ? cls.exporting : ''} ${photoCount === 0 ? cls.disabled : ''}`}
			onClick={exportPdf}
			disabled={isExporting || photoCount === 0 || loading}
			aria-label={loading ? 'Загрузка фотографий' : 'Экспорт в PDF'}
		>
			<span className={cls.buttonContent}>
				<Download
					size={20}
					className={`${cls.icon} ${isExporting ? cls.spinning : ''}`}
				/>
				<span className={cls.text}>
					{loading
						? 'Загрузка...'
						: isExporting
							? 'Экспорт...'
							: photoCount === 0
								? 'Нет фото'
								: `Экспорт в PDF (${photoCount})`}
				</span>
			</span>

			<span className={cls.waveEffect} />
		</button>
	);
};
