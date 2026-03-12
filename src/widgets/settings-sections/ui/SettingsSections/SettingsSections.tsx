import { type FC } from 'react';
import { ThemeSwitcher } from '../../../../features/settings/ThemeSwitcher/ThemeSwitcher';
import { DangerZone } from '../../../../features/settings/danger-zone';
import { Card } from '../../../../shared/ui/Card/Card';
import cls from './SettingsSections.module.scss';

export const SettingsSections: FC = () => {
	return (
		<div className={cls.sections}>
			<Card title="Оформление">
				<ThemeSwitcher />
			</Card>

			<Card
				title="Опасная зона"
				className={cls.dangerZoneCard}
			>
				<DangerZone />
			</Card>
		</div>
	);
};
