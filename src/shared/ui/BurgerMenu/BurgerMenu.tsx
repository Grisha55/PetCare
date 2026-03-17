import { useState } from 'react';
import cls from './BurgerMenu.module.scss';
import { NavLink } from '../../../widgets/navbar/ui/NavLink';

interface BurgerMenuProps {
  links: Array<{
    to: string;
    label: string;
    icon?: React.ReactNode;
  }>;
}

export const BurgerMenu = ({ links }: BurgerMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <button 
        className={`${cls.burgerButton} ${isOpen ? cls.open : ''}`} 
        onClick={toggleMenu}
        aria-label="Menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <div className={`${cls.menuOverlay} ${isOpen ? cls.open : ''}`} onClick={toggleMenu}>
        <nav className={cls.menuContent} onClick={(e) => e.stopPropagation()}>
          {links.map((link, index) => (
            <NavLink
              key={index}
              to={link.to}
              icon={link.icon}
              label={link.label}
              onClick={toggleMenu}
            />
          ))}
        </nav>
      </div>
    </>
  );
};