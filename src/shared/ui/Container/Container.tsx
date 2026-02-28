import cls from './Container.module.scss';
import type { ReactNode } from 'react';

interface ContainerProps {
  children: ReactNode;
  className?: string;
  as?: 'div' | 'section' | 'article' | 'main';
}

export const Container = ({ 
  children, 
  className = '', 
  as: Component = 'div' 
}: ContainerProps) => {
  return (
    <Component className={`${cls.container} ${className}`}>
      {children}
    </Component>
  );
};