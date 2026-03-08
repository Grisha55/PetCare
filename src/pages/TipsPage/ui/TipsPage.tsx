import {
	Cat,
	Dog,
	Heart,
	PawPrint,
	Sparkles,
	X
} from 'lucide-react';
import { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { fetchTips } from '../../../entities/tip/api/tipsApi';
import { getLikedTips } from '../../../entities/tip/api/tipsLikesApi';
import { TipSkeleton } from '../../../entities/tip/ui/TipSkeleton';
import { Navbar } from '../../../widgets/navbar';
import styles from './TipsPage.module.scss';
import { useAuth } from '../../../app/providers/auth-provider'
import type { Tip } from '../../../entities/tip/model/types'
import { TipCard } from '../../../entities/tip/ui/TipCard'

type Category = 'health' | 'training' | 'nutrition' | 'all';

const TipsPage = () => {
	const [tips, setTips] = useState<Tip[]>([]);
	const [filteredTips, setFilteredTips] = useState<Tip[]>([]);
	const [loading, setLoading] = useState(false);
	const [initialLoading, setInitialLoading] = useState(true);
	const [selectedCategory, setSelectedCategory] = useState<Category>('all');
	const [likedTipIds, setLikedTipIds] = useState<Set<string>>(new Set());
	const [, setPage] = useState(1);
	const [showOnlyLiked, setShowOnlyLiked] = useState(false);
	
	const { user } = useAuth();
	const initialLoadRef = useRef(false);

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

	useEffect(() => {
		if (likedTipIds.size > 0 || user === null) {
			setTips(prev => prev.map(tip => ({
				...tip,
				liked: likedTipIds.has(tip.id)
			})));
		}
	}, [likedTipIds, user]);

	useEffect(() => {
		if (initialLoadRef.current) return;
		initialLoadRef.current = true;

		const loadInitialTips = async () => {
			setInitialLoading(true);
			try {
				const newTips = await fetchTips(6);
				const tipsWithLikes = newTips.map(tip => ({
					...tip,
					liked: likedTipIds.has(tip.id)
				}));
				setTips(tipsWithLikes);
			} catch (error) {
				console.error('Failed to load tips:', error);
			} finally {
				setInitialLoading(false);
			}
		};

		loadInitialTips();
	}, []);

	const loadMoreTips = async () => {
		if (loading) return;
		
		setLoading(true);
		try {
			const newTips = await fetchTips(6);
			const tipsWithLikes = newTips.map(tip => ({
				...tip,
				liked: likedTipIds.has(tip.id)
			}));
			setTips(prev => [...prev, ...tipsWithLikes]);
			setPage(prev => prev + 1);
		} catch (error) {
			console.error('Failed to load more tips:', error);
		} finally {
			setLoading(false);
		}
	};

	const handleLikeToggle = useCallback(async (tipId: string, liked: boolean) => {
		setLikedTipIds(prev => {
			const newSet = new Set(prev);
			if (liked) {
				newSet.add(tipId);
			} else {
				newSet.delete(tipId);
			}
			return newSet;
		});

		setTips(prev => 
			prev.map(tip => 
				tip.id === tipId ? { ...tip, liked } : tip
			)
		);
	}, []);

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

	const categories = useMemo(() => [
		{ value: 'all' as const, label: 'Все советы', icon: <Sparkles /> },
		{ value: 'health' as const, label: 'Здоровье', icon: <Heart /> },
		{ value: 'training' as const, label: 'Дрессировка', icon: <Dog /> },
		{ value: 'nutrition' as const, label: 'Питание', icon: <Cat /> }
	], []);

	return (
		<div className="container">
			<div className={styles.page}>
				<Navbar />
				<div className={styles.decorations}>
					<div className={styles.blobTopRight} />
					<div className={styles.blobBottomLeft} />
				</div>

				<div className={styles.container}>
					<div className={styles.header}>
						<div className={styles.iconWrapper}>
							<PawPrint />
						</div>
						<h1 className={styles.title}>Veterinary Tips</h1>
						<p className={styles.subtitle}>
							Профессиональные советы ветеринаров для здоровья и счастья ваших
							питомцев
						</p>

						{/* Фильтры */}
						<div className={styles.filters}>
							{categories.map(({ value, label, icon }) => (
								<button
									key={value}
									className={`${styles.filterButton} ${
										selectedCategory === value ? styles.active : ''
									}`}
									onClick={() => setSelectedCategory(value)}
								>
									{icon}
									<span>{label}</span>
								</button>
							))}
						</div>

						{/* Кнопка показа только понравившихся */}
						{user && (
							<div className={styles.likedFilter}>
								<button
									className={`${styles.likedButton} ${
										showOnlyLiked ? styles.active : ''
									}`}
									onClick={() => setShowOnlyLiked(!showOnlyLiked)}
								>
									<Heart 
										fill={showOnlyLiked ? '#ef4444' : 'none'}
										className={styles.heartIcon}
									/>
									<span>
										{showOnlyLiked ? 'Все советы' : 'Только понравившиеся'}
									</span>
									{showOnlyLiked && (
										<span className={styles.likedCount}>
											({filteredTips.length})
										</span>
									)}
								</button>
							</div>
						)}

						{/* Информация о текущем фильтре */}
						{selectedCategory !== 'all' && (
							<div className={styles.activeFilter}>
								<span>Категория: {selectedCategory}</span>
								<button
									onClick={() => setSelectedCategory('all')}
									className={styles.clearFilter}
								>
									<X size={16} />
								</button>
							</div>
						)}
					</div>

					{/* Сетка советов */}
					<div className={styles.grid}>
						{filteredTips.map((tip, index) => (
							<div
								key={tip.id}
								className={styles.cardWrapper}
								style={{ animationDelay: `${index * 100}ms` }}
							>
								<TipCard 
									tip={tip} 
									onLikeToggle={handleLikeToggle}
								/>
							</div>
						))}

						{(initialLoading || loading) &&
							Array.from({ length: 3 }).map((_, i) => (
								<div
									key={i}
									className={styles.skeletonWrapper}
									style={{ animationDelay: `${i * 100}ms` }}
								>
									<TipSkeleton />
								</div>
							))}
					</div>

					{/* Кнопка загрузки */}
					{!initialLoading && !loading && tips.length > 0 && !showOnlyLiked && (
						<div className={styles.buttonContainer}>
							<button
								onClick={loadMoreTips}
								className={styles.loadButton}
							>
								<span className={styles.buttonGradient} />
								<Sparkles className={styles.buttonIcon} />
								<span className={styles.buttonText}>Показать еще советы</span>
								<span className={styles.buttonCount}>
									({tips.length} загружено)
								</span>
							</button>
						</div>
					)}

					{/* Пустое состояние */}
					{!initialLoading && !loading && filteredTips.length === 0 && (
						<div className={styles.emptyState}>
							<div className={styles.emptyIconWrapper}>
								{showOnlyLiked ? <Heart /> : <PawPrint />}
							</div>
							<h3 className={styles.emptyTitle}>
								{showOnlyLiked 
									? 'У вас пока нет сохраненных советов' 
									: 'Советы не найдены'}
							</h3>
							<p className={styles.emptyText}>
								{showOnlyLiked
									? 'Нажимайте на сердечко у советов, чтобы сохранить их'
									: 'Попробуйте выбрать другую категорию'}
							</p>
							{showOnlyLiked && (
								<button
									onClick={() => setShowOnlyLiked(false)}
									className={styles.showAllButton}
								>
									Показать все советы
								</button>
							)}
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default TipsPage;