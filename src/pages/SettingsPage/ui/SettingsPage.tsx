import { type FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { DeleteAccount } from '../../../features/settings/DeleteAccount/DeleteAccount';
import { ThemeSwitcher } from '../../../features/settings/ThemeSwitcher/ThemeSwitcher';
import { Card } from '../../../shared/ui/Card/Card';
import styles from './SettingsPage.module.scss';

const SettingsPage: FC = () => {
	const navigate = useNavigate();

	const handleGoBack = () => {
		navigate(-1);
	};

	return (
		<div className="container">
			<div className={styles.settingsPage}>
				<div className={styles.container}>
					<div className={styles.header}>
						<button
							onClick={handleGoBack}
							className={styles.backButton}
						>
							← Назад
						</button>
						<h1 className={styles.title}>Настройки</h1>
					</div>

					<div className={styles.sections}>
						<Card title="Оформление">
							<ThemeSwitcher />
						</Card>

						<Card
							title="Опасная зона"
							className={styles.dangerZone}
						>
							<p className={styles.description}>
								Удаление аккаунта приведет к потере всех данных. Это действие
								необратимо.
							</p>
							<DeleteAccount />
						</Card>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SettingsPage;
