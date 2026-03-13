import type { CreateMedicalRecord } from '../../../entities/medical-record/model/types';
import { useMedicalRecords } from '../../../entities/medical-record/model/useMedicalRecords';
import { usePassport } from '../../../entities/passport/context'; // 👈 Используем контекст
import { AddMedicalRecord } from '../../../features/add-medical-record/ui/AddMedicalRecord';
import { Navbar } from '../../../widgets/navbar';
import { PassportGallery } from '../../../widgets/passport-gallery';
import { PassportRecords } from '../../../widgets/passport-records/ui/PassportRecords';
import { usePet } from '../../../app/providers/pet-provider/usePet';
import { deletePassportPhoto } from '../../../shared/api/passportApi';
import cls from './PassportPage.module.scss';

const PassportPage = () => {
	const { pet } = usePet();
	const { records, addRecord, deleteRecord } = useMedicalRecords(
		pet?.id ?? null
	);
	const { photos, addPhoto, removePhoto } = usePassport(); // 👈 Используем контекст

	const handleAdd = async (data: CreateMedicalRecord) => {
		await addRecord(data);
	};

	const handleDeletePhoto = async (id: string, url: string) => {
		try {
			await deletePassportPhoto(id, url);
			removePhoto(id);
		} catch (error) {
			console.error('Failed to delete photo:', error);
		}
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
				<PassportGallery
					images={photos}
					onUpload={addPhoto}
					onDelete={handleDeletePhoto}
				/>
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
