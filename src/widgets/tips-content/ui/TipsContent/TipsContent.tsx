import { TipsHeader } from '../../../tips-header';
import { TipsGrid, LoadMoreButton } from '../../../../features/tips-list';
import { TipsEmptyState } from '../../../../features/tips-empty-state';
import type { Tip } from '../../../../entities/tip';
import type { CategoryFilterValue } from '../../../../features/tips-filters';
import cls from './TipsContent.module.scss';

interface TipsContentProps {
	tips: Tip[];
	filteredTips: Tip[];
	loading: boolean;
	initialLoading: boolean;
	selectedCategory: CategoryFilterValue;
	onCategoryChange: (category: CategoryFilterValue) => void;
	showOnlySaved: boolean;
	onSavedToggle: () => void;
	savedCount: number;
	isAuthenticated: boolean;
	onSaveToggle: (tip: Tip) => Promise<void>;
	onLoadMore: () => Promise<void>;
	onShowAllClick: () => void;
}

export const TipsContent = ({
	tips,
	filteredTips,
	loading,
	initialLoading,
	selectedCategory,
	onCategoryChange,
	showOnlySaved,
	onSavedToggle,
	savedCount,
	isAuthenticated,
	onSaveToggle,
	onLoadMore,
	onShowAllClick
}: TipsContentProps) => {
	const shouldShowLoadMore =
		!initialLoading && !loading && tips.length > 0 && !showOnlySaved;

	return (
		<div className={cls.container}>
			<TipsHeader
				selectedCategory={selectedCategory}
				onCategoryChange={onCategoryChange}
				showOnlySaved={showOnlySaved}
				onSavedToggle={onSavedToggle}
				savedCount={savedCount}
				isAuthenticated={isAuthenticated}
			/>

			<TipsGrid
				tips={filteredTips}
				loading={initialLoading || loading}
				onSaveToggle={onSaveToggle}
			/>

			{shouldShowLoadMore && (
				<LoadMoreButton
					onLoadMore={onLoadMore}
					loading={loading}
					totalCount={tips.length}
				/>
			)}

			{!initialLoading && !loading && filteredTips.length === 0 && (
				<TipsEmptyState
					showOnlySaved={showOnlySaved}
					onShowAllClick={onShowAllClick}
				/>
			)}
		</div>
	);
};
