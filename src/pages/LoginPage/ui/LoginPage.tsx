import { useState  } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import cls from './LoginPage.module.scss';
import { Input } from '../../../shared/ui/input/Input';
import { Button } from '../../../shared/ui/Button/Button'
import { useAuth } from '../../../app/providers/auth-provider'


export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    login({ name: 'User', email });
    navigate('/');
  };

  return (
    <div className={cls.page}>
      <form className={cls.form} onSubmit={handleSubmit}>
        <h1>Вход</h1>

        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Button type="submit">Войти</Button>

        <p>
          Нет аккаунта? <Link to="/registration">Регистрация</Link>
        </p>
      </form>
    </div>
  );
};