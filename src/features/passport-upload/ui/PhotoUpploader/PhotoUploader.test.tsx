import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { PassportContextType } from '../../../../entities/passport/context/types';
import type { PassportPhoto } from '../../../../entities/passport/model/types';
import { PhotoUploader } from './PhotoUploader';

// Мокаем только то, что реально нужно
vi.mock('lucide-react', () => ({
	Upload: () => <div data-testid="mock-icon" />
}));

vi.mock('../../../../app/providers/pet-provider/usePet', () => ({
	usePet: vi.fn()
}));

vi.mock('../../../../entities/passport/context', () => ({
	usePassport: vi.fn()
}));

vi.mock('../../../../shared/api/passportApi', () => ({
	uploadPassportPhoto: vi.fn()
}));

import type { PetContextType } from '../../../../app/providers/pet-provider/PetContext';
import { usePet } from '../../../../app/providers/pet-provider/usePet';
import { usePassport } from '../../../../entities/passport/context';
import { uploadPassportPhoto } from '../../../../shared/api/passportApi';

describe('PhotoUploader', () => {
	const mockUpload = vi.mocked(uploadPassportPhoto);
	const mockAddPhoto = vi.fn();

	// Создаем мок фото с правильным типом
	const mockPhoto: PassportPhoto = {
		id: '1',
		url: 'test.jpg',
		pet_id: '123',
		created_at: new Date().toISOString()
	};

	// Создаем мок контекста питомца
	const mockPetContext: PetContextType = {
		pet: {
			id: '123',
			name: 'Test Pet',
			avatar_url: null,
			user_id: 'user-123'
		},
		loading: false,
		error: null,
		changeAvatar: vi.fn(),
		refreshPet: vi.fn(),
		setPet: vi.fn()
	};

	// Создаем мок контекста паспорта
	const mockPassportContext: PassportContextType = {
		photos: [],
		loading: false,
		refreshPhotos: vi.fn(),
		addPhoto: mockAddPhoto,
		removePhoto: vi.fn()
	};

	beforeEach(() => {
		vi.clearAllMocks();
		vi.mocked(usePet).mockReturnValue(mockPetContext);
		vi.mocked(usePassport).mockReturnValue(mockPassportContext);
	});

	it('рендерит кнопку с иконкой', () => {
		render(<PhotoUploader />);
		expect(screen.getByText('Выбрать фотографии')).toBeInTheDocument();
		expect(screen.getByTestId('mock-icon')).toBeInTheDocument();
	});

	it('загружает файл при выборе', async () => {
		const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
		mockUpload.mockResolvedValue([mockPhoto]);

		render(<PhotoUploader />);

		const input = screen.getByLabelText(
			'Выбрать фотографии'
		) as HTMLInputElement;

		// Симулируем выбор файла
		fireEvent.change(input, { target: { files: [file] } });

		await waitFor(() => {
			expect(mockUpload).toHaveBeenCalledWith('123', file);
			expect(mockAddPhoto).toHaveBeenCalledWith(mockPhoto);
		});
	});

	it('показывает "Загрузка..." во время загрузки', async () => {
		// Создаем промис, который никогда не резолвится
		mockUpload.mockReturnValue(new Promise<PassportPhoto[]>(() => {}));

		render(<PhotoUploader />);

		const input = screen.getByLabelText(
			'Выбрать фотографии'
		) as HTMLInputElement;
		const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

		fireEvent.change(input, { target: { files: [file] } });

		// Ждем появления текста "Загрузка..."
		await waitFor(() => {
			expect(screen.getByText('Загрузка...')).toBeInTheDocument();
		});
	});

	it('обрабатывает ошибки при загрузке', async () => {
		const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
		const error = new Error('Upload failed');

		mockUpload.mockRejectedValue(error);

		render(<PhotoUploader />);

		const input = screen.getByLabelText(
			'Выбрать фотографии'
		) as HTMLInputElement;
		const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

		fireEvent.change(input, { target: { files: [file] } });

		// Ждем обработки ошибки
		await waitFor(() => {
			expect(consoleSpy).toHaveBeenCalledWith(
				'Failed to upload photos:',
				error
			);
		});

		// Проверяем, что UI вернулся в исходное состояние
		expect(screen.getByText('Выбрать фотографии')).toBeInTheDocument();

		consoleSpy.mockRestore();
	});
});
