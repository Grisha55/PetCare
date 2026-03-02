import cls from './ProfileCard.module.scss';
import { mockUser } from '../../../entities/user/mock/user';
import { useNavigate } from 'react-router-dom';

export const ProfileCard = () => {
  const navigate = useNavigate();

  return (
    <div className={cls.card}>
      <img src={mockUser.avatar} className={cls.avatar} />

      <h2>{mockUser.name}</h2>
      <p>{mockUser.email}</p>

      <button
        className={cls.settings}
        onClick={() => navigate('/settings')}
      >
        Настройки
      </button>
    </div>
  );
};