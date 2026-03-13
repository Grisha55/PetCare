import { useState, useEffect, type ReactNode } from 'react';
import type { PassportPhoto } from '../model/types';
import { getPassportPhotos } from '../../../shared/api/passportApi';
import { usePet } from '../../../app/providers/pet-provider/usePet';
import { PassportContext } from './PassportContext';

export const PassportProvider = ({ children }: { children: ReactNode }) => {
	const [photos, setPhotos] = useState<PassportPhoto[]>([]);
	const [loading, setLoading] = useState(true);
	const { pet } = usePet();

	const refreshPhotos = async () => {
		if (!pet?.id) {
			setPhotos([]);
			setLoading(false);
			return;
		}

		try {
			setLoading(true);
			const data = await getPassportPhotos(pet.id);
			setPhotos(data || []);
		} catch (error) {
			console.error('Failed to load passport photos:', error);
			setPhotos([]);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		refreshPhotos();
	}, [pet?.id]);

	const addPhoto = (photo: PassportPhoto) => {
		setPhotos(prev => [...prev, photo]);
	};

	const removePhoto = (photoId: string) => {
		setPhotos(prev => prev.filter(p => p.id !== photoId));
	};

	return (
		<PassportContext.Provider
			value={{ photos, loading, refreshPhotos, addPhoto, removePhoto }}
		>
			{children}
		</PassportContext.Provider>
	);
};
