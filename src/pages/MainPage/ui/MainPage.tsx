import { useMedicalRecords } from '../../../entities/medical-record/model/useMedicalRecords'
import { DailyTip } from '../../../widgets/daily-tip';
import { HealthStatus } from '../../../widgets/health-status';
import { Navbar } from '../../../widgets/navbar';
import { PetSummary } from '../../../widgets/pet-summary';
import { UpcomingEvents } from '../../../widgets/upcoming-events';
import cls from './MainPage.module.scss';

const PET_ID = '11111111-1111-1111-1111-111111111111'

const MainPage = () => {
	const { records, deleteRecord } = useMedicalRecords(PET_ID);

	return (
		<div className="container">
			<main className={cls.page}>
				<Navbar />
				<PetSummary />
				<UpcomingEvents records={records} onDelete={deleteRecord} />
				<HealthStatus />
				<DailyTip />
			</main>
		</div>
	);
};

export default MainPage;
