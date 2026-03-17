import { useRef, useState } from 'react';
import { Camera } from 'lucide-react';
import cls from './PhotoField.module.scss';

interface PhotoFieldProps {
	onChange: (file: File | null) => void;
	disabled: boolean;
}

export const PhotoField = ({ onChange, disabled }: PhotoFieldProps) => {
	const [preview, setPreview] = useState<string | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0] || null;
		onChange(file);

		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setPreview(reader.result as string);
			};
			reader.readAsDataURL(file);
		} else {
			setPreview(null);
		}
	};

	const handleButtonClick = () => {
		fileInputRef.current?.click();
	};

	return (
		<div className={cls.field}>
			<label>Фото питомца (необязательно)</label>
			<div className={cls.photoContainer}>
				{preview ? (
					<div
						className={cls.preview}
						onClick={handleButtonClick}
					>
						<img
							src={preview}
							alt="Preview"
						/>
						<div className={cls.overlay}>
							<Camera size={20} />
							<span>Изменить</span>
						</div>
					</div>
				) : (
					<button
						type="button"
						onClick={handleButtonClick}
						className={cls.uploadButton}
						disabled={disabled}
					>
						<Camera size={24} />
						<span>Выбрать фото</span>
					</button>
				)}
				<input
					ref={fileInputRef}
					type="file"
					accept="image/*"
					onChange={handleFileChange}
					disabled={disabled}
					className={cls.fileInput}
				/>
			</div>
		</div>
	);
};
