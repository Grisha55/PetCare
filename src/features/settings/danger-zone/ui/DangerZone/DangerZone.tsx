import { type FC } from 'react';
import { AlertTriangle } from 'lucide-react';
import cls from './DangerZone.module.scss';
import { DeleteAccount } from '../../../DeleteAccount/DeleteAccount';

export const DangerZone: FC = () => {
	return (
		<div className={cls.dangerZone}>
			<div className={cls.warning}>
				<AlertTriangle size={20} />
				<p>
					Удаление аккаунта приведет к потере всех данных. Это действие
					необратимо.
				</p>
			</div>
			<DeleteAccount />
		</div>
	);
};
