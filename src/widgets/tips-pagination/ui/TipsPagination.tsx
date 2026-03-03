import cls from './TipsPagination.module.scss';

interface Props {
  current: number;
  total: number;
  onChange: (page: number) => void;
}

export const TipsPagination = ({ current, total, onChange }: Props) => {
  return (
    <div className={cls.pagination}>
      {Array.from({ length: total }, (_, i) => (
        <button
          key={i}
          className={current === i + 1 ? cls.active : ''}
          onClick={() => onChange(i + 1)}
        >
          {i + 1}
        </button>
      ))}
    </div>
  );
};