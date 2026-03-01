import cls from './PassportDropzone.module.scss';

export const PassportDropzone = () => {
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    console.log('Загружены:', files);
  };

  return (
    <div
      className={cls.dropzone}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <span>📥 Перетащите фото паспорта сюда</span>
    </div>
  );
};