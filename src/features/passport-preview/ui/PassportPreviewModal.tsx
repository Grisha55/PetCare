import { useState, useRef, useEffect } from 'react';
import { Modal } from '../../../shared/ui/modal';
import cls from './PassportPreviewModal.module.scss';

interface Props {
	image: string | null;
	onClose: () => void;
}

// Константы для ограничений
const MIN_WIDTH = 400;
const MIN_HEIGHT = 300;
const MAX_WIDTH = 600;
const MAX_HEIGHT = 800;
const STEP = 100;

export const PassportPreviewModal = ({ image, onClose }: Props) => {
	const [size, setSize] = useState({ width: 400, height: 300 });
	const imgRef = useRef<HTMLImageElement>(null);

	useEffect(() => {
		if (image && imgRef.current) {
			imgRef.current.style.width = '100%';
			imgRef.current.style.height = '100%';
		}
	}, [image, size]);

	const handleZoomIn = () => {
		setSize(prev => ({
			width: Math.min(prev.width + STEP, MAX_WIDTH),
			height: Math.min(prev.height + STEP, MAX_HEIGHT)
		}));
	};

	const handleZoomOut = () => {
		setSize(prev => ({
			width: Math.max(prev.width - STEP, MIN_WIDTH),
			height: Math.max(prev.height - STEP, MIN_HEIGHT)
		}));
	};

	const handleReset = () => {
		setSize({ width: 400, height: 300 });
	};

	// Проверяем, достигнуты ли пределы
	const isMaxSize = size.width >= MAX_WIDTH || size.height >= MAX_HEIGHT;
	const isMinSize = size.width <= MIN_WIDTH || size.height <= MIN_HEIGHT;

	return (
		<Modal
			isOpen={!!image}
			onClose={onClose}
		>
			<div className={cls.container}>
				<div className={cls.controls}>
					<button
						onClick={handleZoomIn}
						className={`${cls.controlButton} ${isMaxSize ? cls.disabled : ''}`}
						disabled={isMaxSize}
						title={isMaxSize ? 'Достигнут максимальный размер' : 'Увеличить'}
					>
						<span className={cls.icon}>🔍</span>
						<span className={cls.iconSmall}>➕</span>
					</button>
					<button
						onClick={handleZoomOut}
						className={`${cls.controlButton} ${isMinSize ? cls.disabled : ''}`}
						disabled={isMinSize}
						title={isMinSize ? 'Достигнут минимальный размер' : 'Уменьшить'}
					>
						<span className={cls.icon}>🔍</span>
						<span className={cls.iconSmall}>➖</span>
					</button>
					<button
						onClick={handleReset}
						className={cls.controlButton}
						title="Сбросить размер"
					>
						<span className={cls.icon}>🔄</span>
					</button>
					<button
						onClick={onClose}
						className={cls.closeButton}
						title="Закрыть"
					>
						<span className={cls.icon}>✖️</span>
					</button>
				</div>

				<div
					className={cls.imageContainer}
					style={{
						width: `${size.width}px`,
						height: `${size.height}px`
					}}
				>
					<img
						ref={imgRef}
						src={image ?? ''}
						alt="passport zoom"
						className={cls.image}
						style={{
							width: '100%',
							height: '100%',
							objectFit: 'fill'
						}}
					/>
				</div>

				<div className={cls.sizeInfo}>
					<div className={cls.sizeIndicator}>
						{size.width} x {size.height}
					</div>
					<div className={cls.limits}>
						<span>
							Мин: {MIN_WIDTH}x{MIN_HEIGHT}
						</span>
						<span>
							Макс: {MAX_WIDTH}x{MAX_HEIGHT}
						</span>
					</div>
				</div>
			</div>
		</Modal>
	);
};
