import cls from './ProfileForm.module.scss';
import { mockUser } from '../../../entities/user/mock/user';

export const ProfileForm = () => {
  return (
    <form className={cls.form}>
      <h2>Личные данные</h2>

      <label>
        Имя
        <input defaultValue={mockUser.name} />
      </label>

      <label>
        Email
        <input type="email" defaultValue={mockUser.email} />
      </label>

      <label>
        Новый пароль
        <input type="password" />
      </label>

      <label>
        Повторите пароль
        <input type="password" />
      </label>

      <div className={cls.actions}>
        <button type="submit">Сохранить</button>
      </div>
    </form>
  );
};