import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../app/providers/auth-provider';
import cls from './ProfileCard.module.scss';
import { usePet } from '../../../app/providers/pet-provider/usePet'

const DEFAULT_AVATAR = '/images/passport-1';

export const ProfileCard = () => {
  const { pet, changeAvatar, loading, error } = usePet();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    // Сбрасываем ошибку при загрузке нового файла
    setImgError(false);
    changeAvatar(e.target.files[0]);
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleSettingsClick = () => {
    navigate('/settings');
  }

  const handleImageError = () => {
    console.log('ProfileCard - image failed to load:', pet?.avatar_url);
    setImgError(true);
  };

  if (loading) {
    return (
      <div className={cls.card}>
        <div className={cls.loading}>Загрузка профиля...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cls.card}>
        <div className={cls.error}>Ошибка: {error.message}</div>
      </div>
    );
  }

  if (!pet) {
    return (
      <div className={cls.card}>
        <div className={cls.error}>Питомец не найден</div>
      </div>
    );
  }

  // Определяем URL с учетом ошибки
  const avatarUrl = imgError || !pet.avatar_url 
    ? DEFAULT_AVATAR 
    : pet.avatar_url;

  return (
    <div className={cls.card}>
      <div
        className={cls.avatarContainer}
        onClick={handleAvatarClick}
      >
        <img
          key={pet.avatar_url} // Ключ меняется при изменении URL
          src={avatarUrl}
          className={cls.avatar}
          alt={pet.name}
          onError={handleImageError}
        />
        <div className={cls.avatarOverlay}>
          <span>Изменить фото</span>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={handleChange}
        />
      </div>

      <h2>{pet.name}</h2>
      <p>{user?.email || 'Email не указан'}</p>

      <button className={cls.settings} onClick={handleSettingsClick}>Настройки</button>
    </div>
  );
};