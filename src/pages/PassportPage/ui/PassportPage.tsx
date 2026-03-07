// PassportPage.tsx - обновленная версия
import type { CreateMedicalRecord } from '../../../entities/medical-record/model/types';
import { useMedicalRecords } from '../../../entities/medical-record/model/useMedicalRecords';
import { usePassportPhotos } from '../../../entities/pasport-photo/model/usePassportPhotos';
import { AddMedicalRecord } from '../../../features/add-medical-record/ui/AddMedicalRecord';
import { Navbar } from '../../../widgets/navbar';
import { PassportGallery } from '../../../widgets/passport-gallery';
import { PassportRecords } from '../../../widgets/passport-records/ui/PassportRecords';
import { usePet } from '../../../app/providers/pet-provider/usePet';
import cls from './PassportPage.module.scss';

const PassportPage = () => {
	const { pet } = usePet();
	const { records, addRecord, deleteRecord } = useMedicalRecords(pet?.id ?? null);
	const { photos, addPhoto, deletePhoto } = usePassportPhotos(pet?.id ?? null);

	const handleAdd = async (data: CreateMedicalRecord) => {
		await addRecord(data);
	};

	if (!pet) {
		return (
			<div className="container">
				<main className={cls.page}>
					<Navbar />
					<div>Загрузка...</div>
				</main>
			</div>
		);
	}

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