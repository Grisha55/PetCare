import { useMedicalRecords } from '../../../app/providers/medical-records-provider/model/useMedicalRecords'
import { DailyTip } from '../../../widgets/daily-tip';
import { HealthStatus } from '../../../widgets/health-status';
import { Navbar } from '../../../widgets/navbar';
import { PetSummary } from '../../../widgets/pet-summary';
import { UpcomingEvents } from '../../../widgets/upcoming-events';
import cls from './MainPage.module.scss';

const MainPage = () => {
	const { records, deleteRecord } = useMedicalRecords();

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
