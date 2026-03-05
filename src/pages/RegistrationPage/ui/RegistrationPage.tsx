import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import cls from './RegistrationPage.module.scss';
import { Input } from '../../../shared/ui/input/Input';
import { Button } from '../../../shared/ui/Button/Button'
import { useAuth } from '../../../app/providers/auth-provider/useAuth'


export const RegistrationPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    login({ name, email });
    navigate('/');
  };

  return (
    <div className={cls.page}>
      <form className={cls.form} onSubmit={handleSubmit}>
        <h1>Регистрация</h1>

        <Input
          placeholder="Имя"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Button type="submit">Создать аккаунт</Button>

        <p>
          Уже есть аккаунт? <Link to="/login">Войти</Link>
        </p>
      </form>
    </div>
  );
};