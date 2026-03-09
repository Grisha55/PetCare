import { useEffect, useState, useCallback, useRef } from 'react';
import { PawPrint, Heart } from 'lucide-react';
import { fetchTips, type Tip } from '../../../entities/tip';
import { getLikedTips } from '../../../entities/tip';
import { useAuth } from '../../../app/providers/auth-provider';
import { Navbar } from '../../../widgets/navbar';
import { TipsHeader } from '../../../widgets/tips-header';
import { TipsGrid, LoadMoreButton } from '../../../features/tips-list';
import { EmptyState } from '../../../shared/ui/EmptyState';
import type { CategoryFilterValue } from '../../../features/tips-filters';
import styles from './TipsPage.module.scss';

const TipsPage = () => {
	const [tips, setTips] = useState<Tip[]>([]);
	const [filteredTips, setFilteredTips] = useState<Tip[]>([]);
	const [loading, setLoading] = useState(false);
	const [initialLoading, setInitialLoading] = useState(true);
	const [selectedCategory, setSelectedCategory] =
		useState<CategoryFilterValue>('all');
	const [likedTipIds, setLikedTipIds] = useState<Set<string>>(new Set());
	const [showOnlyLiked, setShowOnlyLiked] = useState(false);

	const { user } = useAuth();
	const initialLoadRef = useRef(false);

	// Загрузка лайков
	useEffect(() => {
		const loadUserLikes = async () => {
			if (!user) {
				setLikedTipIds(new Set());
				return;
			}

			try {
				const likedIds = await getLikedTips(user.id);
				setLikedTipIds(new Set(likedIds));
			} catch (error) {
				console.error('Failed to load likes:', error);
			}
		};

		loadUserLikes();
	}, [user]);

	// Обновление лайков в tips
	useEffect(() => {
		setTips(prev =>
			prev.map(tip => ({
				...tip,
				liked: likedTipIds.has(tip.id)
			}))
		);
	}, [likedTipIds]);

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
						liked: likedTipIds.has(tip.id)
					}))
				);
			} catch (error) {
				console.error('Failed to load tips:', error);
			} finally {
				setInitialLoading(false);
			}
		};

		loadInitialTips();
	}, []);

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
					liked: likedTipIds.has(tip.id)
				}))
			]);
		} catch (error) {
			console.error('Failed to load more tips:', error);
		} finally {
			setLoading(false);
		}
	};

	// Обработчик лайка
	const handleLikeToggle = useCallback((tipId: string, liked: boolean) => {
		setLikedTipIds(prev => {
			const newSet = new Set(prev);
			if (liked) {
				newSet.add(tipId);
			} else {
				newSet.delete(tipId);
			}
			return newSet;
		});
	}, []);

	// Фильтрация
	useEffect(() => {
		let filtered = tips;

		if (selectedCategory !== 'all') {
			filtered = filtered.filter(tip => tip.category === selectedCategory);
		}

		if (showOnlyLiked) {
			filtered = filtered.filter(tip => tip.liked);
		}

		setFilteredTips(filtered);
	}, [tips, selectedCategory, showOnlyLiked]);

	const likedCount = filteredTips.filter(t => t.liked).length;

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
					showOnlyLiked={showOnlyLiked}
					onLikedToggle={() => setShowOnlyLiked(!showOnlyLiked)}
					likedCount={likedCount}
					isAuthenticated={!!user}
				/>

				<TipsGrid
					tips={filteredTips}
					loading={initialLoading || loading}
					onLikeToggle={handleLikeToggle}
				/>

				{!initialLoading && !loading && tips.length > 0 && !showOnlyLiked && (
					<LoadMoreButton
						onLoadMore={loadMoreTips}
						loading={loading}
						totalCount={tips.length}
					/>
				)}

				{!initialLoading && !loading && filteredTips.length === 0 && (
					<EmptyState
						icon={showOnlyLiked ? <Heart /> : <PawPrint />}
						title={
							showOnlyLiked
								? 'У вас пока нет сохраненных советов'
								: 'Советы не найдены'
						}
						description={
							showOnlyLiked
								? 'Нажимайте на сердечко у советов, чтобы сохранить их'
								: 'Попробуйте выбрать другую категорию'
						}
						action={
							showOnlyLiked ? (
								<button
									onClick={() => setShowOnlyLiked(false)}
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
