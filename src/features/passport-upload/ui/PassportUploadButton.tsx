import cls from './PassportUploadButton.module.scss';

interface Props {
  addPhoto: (file: File) => void;
}

export const PassportUploadButton = ({ addPhoto }: Props) => {
  return (
    <label className={cls.button}>
      ➕ Добавить фото
      <input type="file" hidden onChange={(e) => e.target.files && addPhoto(e.target.files[0])} />
    </label>
  );
};