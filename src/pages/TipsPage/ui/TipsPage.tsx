import { Heart, PawPrint } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useAuth } from '../../../app/providers/auth-provider';
import { fetchTips, type Tip } from '../../../entities/tip';
import type { CategoryFilterValue } from '../../../features/tips-filters';
import { LoadMoreButton, TipsGrid } from '../../../features/tips-list';
import { getSavedTips, toggleSaveTip } from '../../../shared/api/savedTipsApi';
import { EmptyState } from '../../../shared/ui/EmptyState';
import { Navbar } from '../../../widgets/navbar';
import { TipsHeader } from '../../../widgets/tips-header';
import styles from './TipsPage.module.scss';

const TipsPage = () => {
	const [tips, setTips] = useState<Tip[]>([]);
	const [filteredTips, setFilteredTips] = useState<Tip[]>([]);
	const [loading, setLoading] = useState(false);
	const [initialLoading, setInitialLoading] = useState(true);
	const [selectedCategory, setSelectedCategory] =
		useState<CategoryFilterValue>('all');
	const [savedTipIds, setSavedTipIds] = useState<Set<string>>(new Set());
	const [showOnlySaved, setShowOnlySaved] = useState(false);

	const { user } = useAuth();
	const initialLoadRef = useRef(false);

	// Загрузка сохраненных советов
	useEffect(() => {
		const loadSavedTips = async () => {
			if (!user) {
				setSavedTipIds(new Set());
				return;
			}

			try {
				const savedTips = await getSavedTips(user.id);
				const savedIds = new Set(savedTips.map(tip => tip.id));
				setSavedTipIds(savedIds);
				console.log('Loaded saved tips:', savedIds);
			} catch (error) {
				console.error('Failed to load saved tips:', error);
			}
		};

		loadSavedTips();
	}, [user]);

	// Обновление статуса saved в tips
	useEffect(() => {
		setTips(prev =>
			prev.map(tip => ({
				...tip,
				saved: savedTipIds.has(tip.id)
			}))
		);
	}, [savedTipIds]);

	// Первоначальная загрузка
	useEffect(() => {
		if (initialLoadRef.current) return;
		initialLoadRef.current = true;

		const loadInitialTips = async () => {
			setInitialLoading(true);
			try {
				const newTips = await fetchTips(6);
				setTips(
					newTips.map(tip => ({
						...tip,
						saved: savedTipIds.has(tip.id)
					}))
				);
			} catch (error) {
				console.error('Failed to load tips:', error);
			} finally {
				setInitialLoading(false);
			}
		};

		loadInitialTips();
	}, [savedTipIds]);

	// Загрузка дополнительных советов
	const loadMoreTips = async () => {
		if (loading) return;

		setLoading(true);
		try {
			const newTips = await fetchTips(6);
			setTips(prev => [
				...prev,
				...newTips.map(tip => ({
					...tip,
					saved: savedTipIds.has(tip.id)
				}))
			]);
		} catch (error) {
			console.error('Failed to load more tips:', error);
		} finally {
			setLoading(false);
		}
	};

	// Обработчик сохранения/удаления
	const handleSaveToggle = useCallback(
		async (tip: Tip) => {
			if (!user) {
				console.log('Please login to save tips');
				return;
			}

			console.log('Toggling save for tip:', {
				id: tip.id,
				title: tip.title,
				category: tip.category
			});

			try {
				const isNowSaved = await toggleSaveTip(user.id, tip);
				console.log('Save toggle result:', isNowSaved);

				setSavedTipIds(prev => {
					const newSet = new Set(prev);
					if (isNowSaved) {
						newSet.add(tip.id);
					} else {
						newSet.delete(tip.id);
					}
					return newSet;
				});
			} catch (error) {
				console.error('Failed to toggle save:', error);
			}
		},
		[user]
	);

	// Фильтрация
	useEffect(() => {
		let filtered = tips;

		if (selectedCategory !== 'all') {
			filtered = filtered.filter(tip => tip.category === selectedCategory);
		}

		if (showOnlySaved) {
			filtered = filtered.filter(tip => tip.saved);
		}

		setFilteredTips(filtered);
	}, [tips, selectedCategory, showOnlySaved]);

	const savedCount = filteredTips.filter(t => t.saved).length;

	return (
		<div className={styles.page}>
			<Navbar />
			<div className={styles.decorations}>
				<div className={styles.blobTopRight} />
				<div className={styles.blobBottomLeft} />
			</div>

			<div className={styles.container}>
				<TipsHeader
					selectedCategory={selectedCategory}
					onCategoryChange={setSelectedCategory}
					showOnlySaved={showOnlySaved}
					onSavedToggle={() => setShowOnlySaved(!showOnlySaved)}
					savedCount={savedCount}
					isAuthenticated={!!user}
				/>

				<TipsGrid
					tips={filteredTips}
					loading={initialLoading || loading}
					onSaveToggle={handleSaveToggle}
				/>

				{!initialLoading && !loading && tips.length > 0 && !showOnlySaved && (
					<LoadMoreButton
						onLoadMore={loadMoreTips}
						loading={loading}
						totalCount={tips.length}
					/>
				)}

				{!initialLoading && !loading && filteredTips.length === 0 && (
					<EmptyState
						icon={showOnlySaved ? <Heart /> : <PawPrint />}
						title={
							showOnlySaved
								? 'У вас пока нет сохраненных советов'
								: 'Советы не найдены'
						}
						description={
							showOnlySaved
								? 'Нажимайте на сердечко у советов, чтобы сохранить их'
								: 'Попробуйте выбрать другую категорию'
						}
						action={
							showOnlySaved ? (
								<button
									onClick={() => setShowOnlySaved(false)}
									className={styles.showAllButton}
								>
									Показать все советы
								</button>
							) : undefined
						}
					/>
				)}
			</div>
		</div>
	);
};

export default TipsPage;
