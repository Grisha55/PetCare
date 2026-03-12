import cls from './TipsDecorations.module.scss';

export const TipsDecorations = () => {
	return (
		<div className={cls.decorations}>
			<div className={cls.blobTopRight} />
			<div className={cls.blobBottomLeft} />
		</div>
	);
};
