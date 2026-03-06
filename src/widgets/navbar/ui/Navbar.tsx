import { FaHome, FaDog, FaLightbulb } from 'react-icons/fa';
import cls from './Navbar.module.scss';
import { NavLink } from './NavLink';
import { Container } from '../../../shared/ui/Container/Container';
import { BurgerMenu } from '../../../shared/ui/BurgerMenu/BurgerMenu';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import { usePet } from '../../../entities/pet/model/usePet'

const DEFAULT_AVATAR = '/images/passport-1';

export const Navbar = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 820);
  const navigate = useNavigate();
  const { pet } = usePet();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 820);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const links = [
    { to: '/', icon: <FaHome />, label: 'Дом' },
    { to: '/passport', icon: <FaDog />, label: 'Паспорт' },
    { to: '/tips', icon: <FaLightbulb />, label: 'Советы' },
  ];

  return (
    <header className={cls.navbar}>
      <Container className={cls.navbarContainer}>
        <div className={cls.leftSection}>
          {isMobile && <BurgerMenu links={links} />}
          <div className={cls.logo}>
            <h1>🐾</h1>
          </div>
        </div>

        {!isMobile && (
          <nav className={cls.links}>
            {links.map((link, index) => (
              <NavLink
                key={index}
                to={link.to}
                icon={link.icon}
                label={link.label}
              />
            ))}
          </nav>
        )}

        <div className={cls.profile} onClick={() => navigate('/profile')}>
          <div className={cls.image_block}>
            <img src={pet?.avatar_url || DEFAULT_AVATAR} alt="profile" />
          </div>
          <div className={cls.info}>
            <span>Альфа</span>
            <span>grishavinyar@gmail.com</span>
          </div>
        </div>
      </Container>
    </header>
  );
};