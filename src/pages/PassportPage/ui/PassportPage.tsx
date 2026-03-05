import { Navbar } from '../../../widgets/navbar'
import { PassportGallery } from '../../../widgets/passport-gallery';
import cls from './PassportPage.module.scss';
import { AddMedicalRecord } from '../../../features/add-medical-record/ui/AddMedicalRecord'
import { PassportRecords } from '../../../widgets/passport-records/ui/PassportRecords'
import type { CreateMedicalRecord } from '../../../entities/medical-record/model/types'
import { useMedicalRecords } from '../../../entities/medical-record/model/useMedicalRecords'

const PET_ID = '11111111-1111-1111-1111-111111111111';

const PassportPage = () => {
	const { records, addRecord, deleteRecord } = useMedicalRecords(PET_ID);

  const handleAdd = async (data: CreateMedicalRecord) => {
    await addRecord(data);
  };

	return (
		<div className="container">
			<main className={cls.page}>
				<Navbar />
				<PassportGallery />
				<AddMedicalRecord onAdd={handleAdd} />
				<PassportRecords records={records} onDelete={deleteRecord} />
			</main>
		</div>
	);
};

export default PassportPage;
