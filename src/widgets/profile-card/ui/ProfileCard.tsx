import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePet } from '../../../entities/pet/model/usePet';
import { useAuth } from '../../../app/providers/auth-provider';
import cls from './ProfileCard.module.scss';

const DEFAULT_AVATAR = '/images/passport-1';

export const ProfileCard = () => {
  const { pet, changeAvatar, loading, error } = usePet();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
	const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    changeAvatar(e.target.files[0]);
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

	const handleSettingsClick = () => {
		navigate('/settings');
	}

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

	const avatarUrl = pet.avatar_url || DEFAULT_AVATAR;

  return (
    <div className={cls.card}>
      <div
        className={cls.avatarContainer}
        onClick={handleAvatarClick}
      >
        <img
          src={avatarUrl}
          className={cls.avatar}
          alt={pet.name}
					onError={(e) => {
						e.currentTarget.src = DEFAULT_AVATAR;
					}}
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