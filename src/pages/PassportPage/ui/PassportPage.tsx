import { Navbar } from '../../../widgets/navbar'
import { PassportGallery } from '../../../widgets/passport-gallery';
import cls from './PassportPage.module.scss';

const PassportPage = () => {
	return (
		<div className="container">
			<main className={cls.page}>
				<Navbar />
				<PassportGallery />
			</main>
		</div>
	);
};

export default PassportPage;
