import type { CreateMedicalRecord } from '../../../entities/medical-record/model/types';
import { useMedicalRecords } from '../../../entities/medical-record/model/useMedicalRecords';
import { usePassportPhotos } from '../../../entities/pasport-photo/model/usePassportPhotos';
import { AddMedicalRecord } from '../../../features/add-medical-record/ui/AddMedicalRecord';
import { Navbar } from '../../../widgets/navbar';
import { PassportGallery } from '../../../widgets/passport-gallery';
import { PassportRecords } from '../../../widgets/passport-records/ui/PassportRecords';
import cls from './PassportPage.module.scss';

const PET_ID = '11111111-1111-1111-1111-111111111111';

const PassportPage = () => {
	const { records, addRecord, deleteRecord } = useMedicalRecords(PET_ID);
	const { photos, addPhoto, deletePhoto } = usePassportPhotos(PET_ID);

	const handleAdd = async (data: CreateMedicalRecord) => {
		await addRecord(data);
	};

	return (
		<div className="container">
			<main className={cls.page}>
				<Navbar />
				<PassportGallery images={photos} onUpload={addPhoto} onDelete={deletePhoto} />
				<AddMedicalRecord onAdd={handleAdd} />
				<PassportRecords
					records={records}
					onDelete={deleteRecord}
				/>
			</main>
		</div>
	);
};

export default PassportPage;
