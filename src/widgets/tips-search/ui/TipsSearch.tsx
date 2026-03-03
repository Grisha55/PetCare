import cls from './TipsSearch.module.scss';

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export const TipsSearch = ({ value, onChange }: Props) => {
  return (
    <input
      className={cls.input}
      placeholder="Поиск советов..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};