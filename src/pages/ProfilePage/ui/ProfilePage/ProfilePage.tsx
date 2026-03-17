import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../app/providers/auth-provider';
import {
	getSavedTips,
	unsaveTip,
	type SavedTip
} from '../../../../entities/saved-tip';
import { useProfile } from '../../../../entities/user/hooks/useProfile';
import { Breadcrumbs } from '../../../../features/breadcrumbs';
import { ProfileHeader } from '../../../../features/profile-header';
import { SavedTipsList } from '../../../../features/saved-tips-list';
import { StatsCard } from '../../../../features/stats-card';
import { LogoutModal } from '../../../../widgets/logout-modal';
import { Navbar } from '../../../../widgets/navbar';
import { ProfileCard } from '../../../../widgets/profile-card';
import { ProfileForm } from '../../../../widgets/profile-form';
import cls from './ProfilePage.module.scss';

const ProfilePage = () => {
	const { user, logout } = useAuth();
	const { profile } = useProfile();
	const navigate = useNavigate();

	const [isLoggingOut, setIsLoggingOut] = useState(false);
	const [savedTips, setSavedTips] = useState<SavedTip[]>([]);
	const [loadingSaved, setLoadingSaved] = useState(false);
	const [deletingTipId, setDeletingTipId] = useState<string | null>(null);

	const formKey = `${user?.id}-${profile?.name}-${user?.email}`;

	useEffect(() => {
		const loadSavedTips = async () => {
			if (!user) return;

			setLoadingSaved(true);
			try {
				const tips = await getSavedTips(user.id);
				setSavedTips(tips);
			} catch (error) {
				console.error('Failed to load saved tips:', error);
				setSavedTips([]);
			} finally {
				setLoadingSaved(false);
			}
		};

		loadSavedTips();
	}, [user]);

	const handleDeleteTip = async (tipId: string) => {
		if (!user || deletingTipId) return;

		try {
			setDeletingTipId(tipId);
			await unsaveTip(user.id, tipId);
			setSavedTips(prev => prev.filter(tip => tip.id !== tipId));
		} catch (error) {
			console.error('Failed to delete tip:', error);
		} finally {
			setDeletingTipId(null);
		}
	};

	const handleSettingsClick = () => navigate('/settings');
	const handleLogoutClick = async () => {
		try {
			setIsLoggingOut(true);
			if (logout) await logout();
			navigate('/login', { replace: true, state: { from: 'logout' } });
		} catch (error) {
			console.error('Failed to logout:', error);
		} finally {
			setIsLoggingOut(false);
		}
	};
	const handleViewAllTips = () => navigate('/tips');

	const getCategoryName = (category: string) => {
		const categories: Record<string, string> = {
			health: 'Здоровье',
			training: 'Дрессировка',
			nutrition: 'Питание'
		};
		return categories[category] || category;
	};

	const truncateContent = (content: string | undefined, maxLength: number) => {
		if (!content || typeof content !== 'string') return '';
		if (content.length <= maxLength) return content;
		return content.substring(0, maxLength) + '...';
	};

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleDateString('ru-RU', {
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		});
	};

	if (!user) {
		navigate('/login', { replace: true });
		return null;
	}

	const breadcrumbsItems = [
		{ label: 'Главная', path: '/' },
		{ label: 'Профиль' }
	];

	return (
		<div className="container">
			<div className={cls.pageWrapper}>
				<Navbar />

				<main className={cls.main}>
					<div className={cls.container}>
						<Breadcrumbs items={breadcrumbsItems} />

						<ProfileHeader
							onSettingsClick={handleSettingsClick}
							onLogoutClick={handleLogoutClick}
							isLoggingOut={isLoggingOut}
						/>

						<div className={cls.content}>
							<div className={cls.grid}>
								<div className={cls.cardColumn}>
									<ProfileCard />
									<StatsCard
										daysWithPet={156}
										savedTipsCount={savedTips.length}
										achievementsCount={8}
									/>
								</div>

								<div className={cls.formColumn}>
									<ProfileForm key={formKey} />

									<SavedTipsList
										savedTips={savedTips}
										loading={loadingSaved}
										deletingTipId={deletingTipId}
										onDeleteTip={handleDeleteTip}
										onViewAllTips={handleViewAllTips}
										getCategoryName={getCategoryName}
										truncateContent={truncateContent}
										formatDate={formatDate}
									/>
								</div>
							</div>
						</div>
					</div>
				</main>

				<LogoutModal isOpen={isLoggingOut} />
			</div>
		</div>
	);
};

export default ProfilePage;
