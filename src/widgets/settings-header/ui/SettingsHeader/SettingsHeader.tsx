import { type FC } from 'react';
import { BackButton } from '../../../../features/settings/back-button';
import { Settings } from 'lucide-react';
import cls from './SettingsHeader.module.scss';

export const SettingsHeader: FC = () => {
	return (
		<div className={cls.header}>
			<BackButton />
			<div className={cls.titleWrapper}>
				<Settings
					size={28}
					className={cls.icon}
				/>
				<h1 className={cls.title}>Настройки</h1>
			</div>
		</div>
	);
};
