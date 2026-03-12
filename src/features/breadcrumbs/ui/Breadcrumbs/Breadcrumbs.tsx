import { useNavigate } from 'react-router-dom';
import cls from './Breadcrumbs.module.scss';
import { Fragment } from 'react';

interface BreadcrumbsProps {
	items: Array<{
		label: string;
		path?: string;
	}>;
}

export const Breadcrumbs = ({ items }: BreadcrumbsProps) => {
	const navigate = useNavigate();

	return (
		<div className={cls.breadcrumbs}>
			{items.map((item, index) => (
				<Fragment key={index}>
					{index > 0 && <span className={cls.separator}>/</span>}
					<span
						className={index === items.length - 1 ? cls.current : ''}
						onClick={() => item.path && navigate(item.path)}
					>
						{item.label}
					</span>
				</Fragment>
			))}
		</div>
	);
};
