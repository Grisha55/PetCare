import cls from './PassportUploadButton.module.scss';

export const PassportUploadButton = () => {
  return (
    <label className={cls.button}>
      ➕ Добавить фото
      <input type="file" hidden />
    </label>
  );
};