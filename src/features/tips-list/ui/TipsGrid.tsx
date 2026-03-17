import { TipCard, type Tip } from '../../../entities/tip';
import styles from './TipsGrid.module.scss';

interface TipsGridProps {
	tips: Tip[];
	loading: boolean;
	onSaveToggle?: (tip: Tip) => Promise<void>;
}

export const TipsGrid = ({ tips, loading, onSaveToggle }: TipsGridProps) => {
	if (loading) {
		return (
			<div className={styles.loading}>
				<div className={styles.spinner} />
				<p>Загрузка советов...</p>
			</div>
		);
	}

	if (tips.length === 0) {
		return (
			<div className={styles.empty}>
				<p>Советы не найдены</p>
			</div>
		);
	}

	return (
		<div className={styles.grid}>
			{tips.map(tip => (
				<TipCard
					key={tip.id}
					tip={tip}
					onSaveToggle={onSaveToggle}
				/>
			))}
		</div>
	);
};
