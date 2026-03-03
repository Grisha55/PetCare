import cls from './TipsFilters.module.scss';

interface Props {
  selected: string;
  onChange: (category: string) => void;
}

export const TipsFilters = ({ selected, onChange }: Props) => {
  const categories = ['all', 'health', 'training', 'nutrition'];

  return (
    <div className={cls.filters}>
      {categories.map((cat) => (
        <button
          key={cat}
          className={selected === cat ? cls.active : ''}
          onClick={() => onChange(cat)}
        >
          {cat}
        </button>
      ))}
    </div>
  );
};