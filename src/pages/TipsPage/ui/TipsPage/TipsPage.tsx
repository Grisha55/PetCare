import { useAuth } from '../../../../app/providers/auth-provider';
import { toggleSaveTip, useSavedTips } from '../../../../entities/saved-tip';
import type { Tip } from '../../../../entities/tip';
import { useTips, useTipsFilter } from '../../../../entities/tip';
import { TipsDecorations } from '../../../../features/tips-decorations';
import { Navbar } from '../../../../widgets/navbar';
import { TipsContent } from '../../../../widgets/tips-content';
import styles from './TipsPage.module.scss';

const TipsPage = () => {
	const { user } = useAuth();

	const { savedTipIds } = useSavedTips({ userId: user?.id });
	const { tips, loading, initialLoading, loadMore } = useTips({
		initialLimit: 6,
		savedTipIds
	});

	const {
		filteredTips,
		selectedCategory,
		setSelectedCategory,
		showOnlySaved,
		setShowOnlySaved,
		savedCount
	} = useTipsFilter(tips);

	const handleSaveToggle = async (tip: Tip) => {
		if (!user) {
			console.log('Please login to save tips');
			return;
		}

		try {
			await toggleSaveTip(user.id, tip);
		} catch (error) {
			console.error('Failed to toggle save:', error);
		}
	};

	return (
		<div className="container">
			<div className={styles.page}>
				<Navbar />
				<TipsDecorations />

				<TipsContent
					tips={tips}
					filteredTips={filteredTips}
					loading={loading}
					initialLoading={initialLoading}
					selectedCategory={selectedCategory}
					onCategoryChange={setSelectedCategory}
					showOnlySaved={showOnlySaved}
					onSavedToggle={() => setShowOnlySaved(!showOnlySaved)}
					savedCount={savedCount}
					isAuthenticated={!!user}
					onSaveToggle={handleSaveToggle}
					onLoadMore={loadMore}
					onShowAllClick={() => setShowOnlySaved(false)}
				/>
			</div>
		</div>
	);
};

export default TipsPage;
