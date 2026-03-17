import { useEffect, useState } from 'react';
import { usePet } from '../../../app/providers/pet-provider/usePet';
import { useMedicalRecords } from '../../../entities/medical-record/model/useMedicalRecords';
import { fetchTips, type Tip } from '../../../entities/tip';
import { useProfile } from '../../../entities/user/hooks/useProfile';
import { DailyTip } from '../../../widgets/daily-tip';
import { HealthStatus } from '../../../widgets/health-status';
import { Navbar } from '../../../widgets/navbar';
import { PetSummary } from '../../../widgets/pet-summary';
import { UpcomingEvents } from '../../../widgets/upcoming-events';
import cls from './MainPage.module.scss';

const MainPage = () => {
	const { pet } = usePet();
	const { profile } = useProfile();
	const { records, deleteRecord } = useMedicalRecords(pet?.id || null);
	const [tips, setTips] = useState<Tip[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const loadTips = async () => {
			setIsLoading(true);
			try {
				const data = await fetchTips(3);
				setTips(data);
			} catch (error) {
				console.error('Failed to load tips:', error);
			} finally {
				setIsLoading(false);
			}
		};

		loadTips();
	}, []);

	return (
		<div className="container">
			<main className={cls.page}>
				<Navbar />
				<PetSummary
					petImg={pet?.avatar_url || ''}
					petName={profile?.name || ''}
					records={records}
				/>
				<UpcomingEvents
					records={records}
					onDelete={deleteRecord}
				/>
				<HealthStatus records={records} />
				<DailyTip
					tips={tips}
					isLoading={isLoading}
				/>
			</main>
		</div>
	);
};

export default MainPage;
