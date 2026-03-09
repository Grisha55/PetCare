import { X } from 'lucide-react';
import { type ActiveFilterProps } from '../model/types';
import styles from './ActiveFilter.module.scss';

export const ActiveFilter = ({ selectedCategory, onClear }: ActiveFilterProps) => {
  if (selectedCategory === 'all') return null;

  return (
    <div className={styles.activeFilter}>
      <span>Категория: {selectedCategory}</span>
      <button onClick={onClear} className={styles.clearFilter}>
        <X size={16} />
      </button>
    </div>
  );
};