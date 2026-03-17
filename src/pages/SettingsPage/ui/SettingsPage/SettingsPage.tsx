import { type FC } from 'react';
import { SettingsHeader } from '../../../../widgets/settings-header';
import { SettingsLayout } from '../../../../widgets/settings-layout';
import { SettingsSections } from '../../../../widgets/settings-sections';

const SettingsPage: FC = () => {
	return (
		<div className="container">
			<SettingsLayout>
				<SettingsHeader />
				<SettingsSections />
			</SettingsLayout>
		</div>
	);
};

export default SettingsPage;
