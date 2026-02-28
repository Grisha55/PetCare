import { NavLink as RouterNavLink } from 'react-router-dom';
import cls from './Navbar.module.scss';

interface NavLinkProps {
  to: string;
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
}

export const NavLink = ({ to, label, icon, onClick }: NavLinkProps) => {
  return (
    <RouterNavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        isActive ? `${cls.link} ${cls.linkActive}` : cls.link
      }
    >
      <span className={cls.linkContent}>
        {icon && <span className={cls.icon}>{icon}</span>}
        <span>{label}</span>
      </span>
    </RouterNavLink>
  );
};