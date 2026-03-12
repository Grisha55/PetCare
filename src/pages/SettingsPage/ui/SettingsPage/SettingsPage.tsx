import { type FC } from 'react';
import { SettingsLayout } from '../../../../widgets/settings-layout';
import { SettingsHeader } from '../../../../widgets/settings-header';
import { SettingsSections } from '../../../../widgets/settings-sections';

const SettingsPage: FC = () => {
	return (
		<SettingsLayout>
			<SettingsHeader />
			<SettingsSections />
		</SettingsLayout>
	);
};

export default SettingsPage;
