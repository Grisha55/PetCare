import cls from './Modal.module.scss';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const Modal = ({ isOpen, onClose, children }: Props) => {
  if (!isOpen) return null;

  return (
    <div className={cls.backdrop} onClick={onClose}>
      <div className={cls.content} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};