import { type FC, type ReactNode } from 'react';
import cls from './SettingsLayout.module.scss';

interface SettingsLayoutProps {
	children: ReactNode;
}

export const SettingsLayout: FC<SettingsLayoutProps> = ({ children }) => {
	return (
		<div className={cls.settingsPage}>
			<div className={cls.container}>{children}</div>
		</div>
	);
};
