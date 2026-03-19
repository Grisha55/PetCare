import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PhotoField } from './PhotoField';

// Мокаем иконку Camera
vi.mock('lucide-react', () => ({
	Camera: () => <div data-testid="mock-camera-icon" />
}));

describe('PhotoField', () => {
	const mockOnChange = vi.fn();

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('рендерит кнопку выбора фото, когда нет превью', () => {
		render(
			<PhotoField
				onChange={mockOnChange}
				disabled={false}
			/>
		);

		expect(
			screen.getByText('Фото питомца (необязательно)')
		).toBeInTheDocument();
		expect(screen.getByText('Выбрать фото')).toBeInTheDocument();
		expect(screen.getByTestId('mock-camera-icon')).toBeInTheDocument();
	});

	it('кнопка выбора фото может быть отключена', () => {
		render(
			<PhotoField
				onChange={mockOnChange}
				disabled={true}
			/>
		);

		const button = screen.getByText('Выбрать фото').closest('button');
		expect(button).toBeDisabled();
	});

	it('отображает превью после выбора файла', async () => {
		render(
			<PhotoField
				onChange={mockOnChange}
				disabled={false}
			/>
		);

		// Находим input по классу, так как label не связан
		const fileInput = document.querySelector(
			'input[type="file"]'
		) as HTMLInputElement;
		expect(fileInput).toBeInTheDocument();

		const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

		// Симулируем выбор файла
		fireEvent.change(fileInput, { target: { files: [file] } });

		// Ждем появления превью
		await waitFor(() => {
			expect(screen.getByAltText('Preview')).toBeInTheDocument();
			expect(screen.getByText('Изменить')).toBeInTheDocument();
		});
	});

	it('вызывает onChange с выбранным файлом', async () => {
		render(
			<PhotoField
				onChange={mockOnChange}
				disabled={false}
			/>
		);

		const fileInput = document.querySelector(
			'input[type="file"]'
		) as HTMLInputElement;
		const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

		fireEvent.change(fileInput, { target: { files: [file] } });

		expect(mockOnChange).toHaveBeenCalledWith(file);
	});

	it('сбрасывает превью, если выбранный файл null', async () => {
		render(
			<PhotoField
				onChange={mockOnChange}
				disabled={false}
			/>
		);

		const fileInput = document.querySelector(
			'input[type="file"]'
		) as HTMLInputElement;

		// Сначала выбираем файл
		const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
		fireEvent.change(fileInput, { target: { files: [file] } });

		await waitFor(() => {
			expect(screen.getByAltText('Preview')).toBeInTheDocument();
		});

		// Теперь выбираем null
		fireEvent.change(fileInput, { target: { files: null } });

		await waitFor(() => {
			expect(screen.queryByAltText('Preview')).not.toBeInTheDocument();
			expect(screen.getByText('Выбрать фото')).toBeInTheDocument();
		});

		expect(mockOnChange).toHaveBeenCalledWith(null);
	});

	it('имеет правильные атрибуты для input', () => {
		render(
			<PhotoField
				onChange={mockOnChange}
				disabled={false}
			/>
		);

		const fileInput = document.querySelector(
			'input[type="file"]'
		) as HTMLInputElement;

		expect(fileInput).toHaveAttribute('type', 'file');
		expect(fileInput).toHaveAttribute('accept', 'image/*');
		expect(fileInput).not.toBeDisabled();
	});

	it('дизейблит input, когда disabled=true', () => {
		render(
			<PhotoField
				onChange={mockOnChange}
				disabled={true}
			/>
		);

		const fileInput = document.querySelector(
			'input[type="file"]'
		) as HTMLInputElement;

		expect(fileInput).toBeDisabled();
	});
});
