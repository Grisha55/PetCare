import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ExportPassportButton } from './ExportPassportButton';
import cls from './ExportPassportButton.module.scss';

// Простые моки
vi.mock('jspdf', () => ({
	jsPDF: vi.fn(() => ({
		addPage: vi.fn(),
		addImage: vi.fn(),
		save: vi.fn()
	}))
}));

vi.mock('lucide-react', () => ({
	Download: () => <div data-testid="mock-download-icon">Download</div>
}));

// Мок для usePassport
vi.mock('../../../entities/passport/context', () => ({
	usePassport: vi.fn(() => ({
		photos: [],
		loading: false
	}))
}));

describe('ExportPassportButton', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('должен отображать кнопку', () => {
		render(<ExportPassportButton />);

		const button = screen.getByRole('button');
		expect(button).toBeInTheDocument();
		expect(button).toHaveClass(cls.exportButton);
	});

	it('должен отображать иконку Download', () => {
		render(<ExportPassportButton />);

		expect(screen.getByTestId('mock-download-icon')).toBeInTheDocument();
	});

	it('должен отображать текст "Нет фото" когда нет фотографий', () => {
		render(<ExportPassportButton />);

		expect(screen.getByText('Нет фото')).toBeInTheDocument();
		expect(screen.getByRole('button')).toBeDisabled();
	});
});
