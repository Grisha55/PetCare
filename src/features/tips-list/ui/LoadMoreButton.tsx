import { ChevronDown } from 'lucide-react';
import cls from './LoadMoreButton.module.scss';

interface LoadMoreButtonProps {
	onLoadMore: () => void;
	loading: boolean;
	totalCount: number;
}

export const LoadMoreButton = ({
	onLoadMore,
	loading,
	totalCount
}: LoadMoreButtonProps) => {
	console.log('🔘 LoadMoreButton render:', { loading, totalCount });

	return (
		<div className={cls.container}>
			<button
				onClick={onLoadMore}
				disabled={loading}
				className={cls.button}
			>
				{loading ? (
					<>
						<span className={cls.spinner} />
						<span>Загрузка...</span>
					</>
				) : (
					<>
						<span>Показать еще</span>
						<ChevronDown size={20} />
					</>
				)}
			</button>
			<p className={cls.count}>Загружено {totalCount} советов</p>
		</div>
	);
};
