import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { RegistrationForm } from './RegistrationForm';

interface MockFieldProps {
	id: string;
	value: string;
	onChange: (value: string) => void;
	disabled: boolean;
}

interface MockPhotoProps {
	onChange: (file: File | null) => void;
	disabled: boolean;
}

// Простые моки
vi.mock('../RegistrationField/RegistrationField', () => ({
	RegistrationField: ({ id, value, onChange, disabled }: MockFieldProps) => (
		<input
			data-testid={`input-${id}`}
			value={value}
			onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
				onChange(e.target.value)
			}
			disabled={disabled}
		/>
	)
}));

vi.mock('../PhotoField/PhotoField', () => ({
	PhotoField: ({ onChange, disabled }: MockPhotoProps) => (
		<button
			data-testid="photo-button"
			onClick={() => onChange(new File([''], 'test.jpg'))}
			disabled={disabled}
		>
			Фото
		</button>
	)
}));

describe('RegistrationForm', () => {
	const mockOnSubmit = vi.fn();

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('рендерит все поля', () => {
		render(
			<RegistrationForm
				onSubmit={mockOnSubmit}
				loading={false}
				error={null}
			/>
		);

		expect(screen.getByTestId('input-email')).toBeInTheDocument();
		expect(screen.getByTestId('input-password')).toBeInTheDocument();
		expect(screen.getByTestId('input-petName')).toBeInTheDocument();
		expect(screen.getByTestId('photo-button')).toBeInTheDocument();
		expect(
			screen.getByRole('button', { name: /зарегистрироваться/i })
		).toBeInTheDocument();
	});

	it('показывает ошибку', () => {
		render(
			<RegistrationForm
				onSubmit={mockOnSubmit}
				loading={false}
				error="Ошибка"
			/>
		);
		expect(screen.getByText('Ошибка')).toBeInTheDocument();
	});

	it('блокирует поля при loading=true', () => {
		render(
			<RegistrationForm
				onSubmit={mockOnSubmit}
				loading={true}
				error={null}
			/>
		);

		expect(screen.getByTestId('input-email')).toBeDisabled();
		expect(screen.getByTestId('input-password')).toBeDisabled();
		expect(screen.getByTestId('input-petName')).toBeDisabled();
		expect(screen.getByTestId('photo-button')).toBeDisabled();
		expect(
			screen.getByRole('button', { name: /регистрация\.\.\./i })
		).toBeDisabled();
	});

	it('вызывает onSubmit при сабмите когда loading=false', () => {
		render(
			<RegistrationForm
				onSubmit={mockOnSubmit}
				loading={false}
				error={null}
			/>
		);

		fireEvent.change(screen.getByTestId('input-email'), {
			target: { value: 'test@test.com' }
		});
		fireEvent.submit(document.querySelector('form')!);

		expect(mockOnSubmit).toHaveBeenCalledTimes(1);
	});

	// Этот тест проверяет, что форма не сабмитится когда loading=true
	it('кнопка отправки заблокирована при loading=true', () => {
		render(
			<RegistrationForm
				onSubmit={mockOnSubmit}
				loading={true}
				error={null}
			/>
		);

		const submitButton = screen.getByRole('button', {
			name: /регистрация\.\.\./i
		});
		expect(submitButton).toBeDisabled();

		fireEvent.click(submitButton);
		expect(mockOnSubmit).not.toHaveBeenCalled();
	});
});
