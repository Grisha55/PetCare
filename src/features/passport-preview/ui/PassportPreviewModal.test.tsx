import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PassportPreviewModal } from './PassportPreviewModal';
import cls from './PassportPreviewModal.module.scss';

// Простой мок Modal с правильным путем
vi.mock('../../../../shared/ui/modal/Modal', () => ({
	Modal: ({
		isOpen,
		children
	}: {
		isOpen: boolean;
		children: React.ReactNode;
	}) => {
		if (!isOpen) return null;
		return <div data-testid="mock-modal">{children}</div>;
	}
}));

describe('PassportPreviewModal', () => {
	const mockOnClose = vi.fn();
	const mockImage = 'https://example.com/test-image.jpg';

	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('Рендер', () => {
		it('не должен рендериться, когда image = null', () => {
			render(
				<PassportPreviewModal
					image={null}
					onClose={mockOnClose}
				/>
			);

			expect(screen.queryByTestId('mock-modal')).not.toBeInTheDocument();
		});

		it('должен рендериться, когда image передан', () => {
			render(
				<PassportPreviewModal
					image={mockImage}
					onClose={mockOnClose}
				/>
			);

			// Проверяем что изображение отображается
			expect(screen.getByAltText('passport zoom')).toBeInTheDocument();
			expect(screen.getByAltText('passport zoom')).toHaveAttribute(
				'src',
				mockImage
			);

			// Проверяем что кнопки отображаются
			expect(screen.getByTitle('Увеличить')).toBeInTheDocument();
			expect(screen.getByTitle('Сбросить размер')).toBeInTheDocument();
			expect(screen.getByTitle('Закрыть')).toBeInTheDocument();
		});
	});

	describe('Кнопки управления', () => {
		it('кнопка закрытия должна вызывать onClose', async () => {
			const user = userEvent.setup();
			render(
				<PassportPreviewModal
					image={mockImage}
					onClose={mockOnClose}
				/>
			);

			const closeButton = screen.getByTitle('Закрыть');
			await user.click(closeButton);

			expect(mockOnClose).toHaveBeenCalledTimes(1);
		});

		it('кнопка закрытия должна иметь класс closeButton', () => {
			render(
				<PassportPreviewModal
					image={mockImage}
					onClose={mockOnClose}
				/>
			);

			const closeButton = screen.getByTitle('Закрыть');
			expect(closeButton).toHaveClass(cls.closeButton);
		});
	});

	describe('Увеличение/уменьшение размера', () => {
		it('должен увеличивать размер при нажатии на кнопку увеличения', async () => {
			const user = userEvent.setup();
			render(
				<PassportPreviewModal
					image={mockImage}
					onClose={mockOnClose}
				/>
			);

			const zoomInButton = screen.getByTitle('Увеличить');
			const imageContainer = screen.getByRole('img').parentElement;

			await user.click(zoomInButton);

			expect(imageContainer?.style.width).toBe('500px');
			expect(imageContainer?.style.height).toBe('400px');
		});

		it('должен уменьшать размер при нажатии на кнопку уменьшения', async () => {
			const user = userEvent.setup();
			render(
				<PassportPreviewModal
					image={mockImage}
					onClose={mockOnClose}
				/>
			);

			// Сначала увеличим, чтобы кнопка уменьшения была активна
			const zoomInButton = screen.getByTitle('Увеличить');
			await user.click(zoomInButton);

			const zoomOutButton = screen.getByTitle('Уменьшить');
			const imageContainer = screen.getByRole('img').parentElement;

			await user.click(zoomOutButton);

			expect(imageContainer?.style.width).toBe('400px');
			expect(imageContainer?.style.height).toBe('300px');
		});

		it('должен сбрасывать размер при нажатии на кнопку сброса', async () => {
			const user = userEvent.setup();
			render(
				<PassportPreviewModal
					image={mockImage}
					onClose={mockOnClose}
				/>
			);

			const zoomInButton = screen.getByTitle('Увеличить');
			const resetButton = screen.getByTitle('Сбросить размер');
			const imageContainer = screen.getByRole('img').parentElement;

			await user.click(zoomInButton);
			await user.click(zoomInButton);
			await user.click(resetButton);

			expect(imageContainer?.style.width).toBe('400px');
			expect(imageContainer?.style.height).toBe('300px');
		});

		it('должен отображать текущий размер', () => {
			render(
				<PassportPreviewModal
					image={mockImage}
					onClose={mockOnClose}
				/>
			);

			expect(screen.getByText('400 x 300')).toBeInTheDocument();
		});
	});

	describe('Граничные значения', () => {
		it('кнопка увеличения должна отключаться при достижении MAX_SIZE', async () => {
			const user = userEvent.setup();
			render(
				<PassportPreviewModal
					image={mockImage}
					onClose={mockOnClose}
				/>
			);

			const zoomInButton = screen.getByTitle('Увеличить');

			// Увеличиваем до максимума
			await user.click(zoomInButton);
			await user.click(zoomInButton);

			expect(zoomInButton).toBeDisabled();
			expect(zoomInButton).toHaveClass(cls.disabled);
		});

		it('кнопка уменьшения должна отключаться при достижении MIN_SIZE', async () => {
			const user = userEvent.setup();
			render(
				<PassportPreviewModal
					image={mockImage}
					onClose={mockOnClose}
				/>
			);

			// Сначала увеличим, чтобы кнопка уменьшения была активна
			const zoomInButton = screen.getByTitle('Увеличить');
			await user.click(zoomInButton);

			const zoomOutButton = screen.getByTitle('Уменьшить');

			// Уменьшаем до минимума
			await user.click(zoomOutButton);

			expect(zoomOutButton).toBeDisabled();
			expect(zoomOutButton).toHaveClass(cls.disabled);
		});

		it('должен показывать правильные лимиты', () => {
			render(
				<PassportPreviewModal
					image={mockImage}
					onClose={mockOnClose}
				/>
			);

			expect(screen.getByText('Мин: 400x300')).toBeInTheDocument();
			expect(screen.getByText('Макс: 600x800')).toBeInTheDocument();
		});
	});

	describe('Изображение', () => {
		it('должен устанавливать правильные стили для изображения', () => {
			render(
				<PassportPreviewModal
					image={mockImage}
					onClose={mockOnClose}
				/>
			);

			const img = screen.getByRole('img');
			expect(img).toHaveStyle({
				width: '100%',
				height: '100%',
				objectFit: 'fill'
			});
		});
	});

	describe('Стили и классы', () => {
		it('контейнер изображения должен иметь правильный класс', () => {
			render(
				<PassportPreviewModal
					image={mockImage}
					onClose={mockOnClose}
				/>
			);

			const imageContainer = screen.getByRole('img').parentElement;
			expect(imageContainer).toHaveClass(cls.imageContainer);
		});

		it('информация о размере должна иметь правильные классы', () => {
			render(
				<PassportPreviewModal
					image={mockImage}
					onClose={mockOnClose}
				/>
			);

			expect(screen.getByText('400 x 300').parentElement).toHaveClass(
				cls.sizeInfo
			);
			expect(screen.getByText('400 x 300')).toHaveClass(cls.sizeIndicator);
		});
	});
});
