import { Navbar } from '../../../widgets/navbar'
import { PassportGallery } from '../../../widgets/passport-gallery';
import cls from './PassportPage.module.scss';
import { AddMedicalRecord } from '../../../features/add-medical-record/ui/AddMedicalRecord'
import { PassportRecords } from '../../../widgets/passport-records/ui/PassportRecords'
import type { CreateMedicalRecord } from '../../../entities/medical-record/model/types'
import { useMedicalRecords } from '../../../app/providers/medical-records-provider/model/useMedicalRecords'

const PassportPage = () => {
	const { records, addRecord } = useMedicalRecords();

  const handleAdd = (data: CreateMedicalRecord) => {
    addRecord(data);
  };

	return (
		<div className="container">
			<main className={cls.page}>
				<Navbar />
				<PassportGallery />
				<AddMedicalRecord onAdd={handleAdd} />
				<PassportRecords records={records} />
			</main>
		</div>
	);
};

export default PassportPage;
