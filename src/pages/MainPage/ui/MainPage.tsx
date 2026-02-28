import cls from './MainPage.module.scss'
import { DailyTip } from '../../../widgets/daily-tip'
import { HealthStatus } from '../../../widgets/health-status'
import { Navbar } from '../../../widgets/navbar'
import { PetSummary } from '../../../widgets/pet-summary'
import { QuickActions } from '../../../widgets/quick-actions'
import { UpcomingEvents } from '../../../widgets/upcoming-events'

const MainPage = () => {
	return (
		<main className={cls.page}>
			<Navbar />
			<PetSummary />
			<QuickActions />
			<UpcomingEvents />
			<HealthStatus />
			<DailyTip />
		</main>
	)
}

export default MainPage