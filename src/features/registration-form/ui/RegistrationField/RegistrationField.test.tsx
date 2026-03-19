import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { RegistrationField } from './RegistrationField';
import cls from './RegistrationField.module.scss';

describe('RegistrationField', () => {
	const mockOnChange = vi.fn();
	const defaultProps = {
		id: 'test-id',
		label: 'Тестовое поле',
		type: 'text',
		placeholder: 'Введите текст',
		value: '',
		onChange: mockOnChange,
		disabled: false,
		required: false
	};

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('рендерит поле с правильными атрибутами', () => {
		render(<RegistrationField {...defaultProps} />);

		const label = screen.getByText('Тестовое поле');
		const input = screen.getByLabelText('Тестовое поле');

		expect(label).toBeInTheDocument();
		expect(label).toHaveAttribute('for', 'test-id');

		expect(input).toBeInTheDocument();
		expect(input).toHaveAttribute('id', 'test-id');
		expect(input).toHaveAttribute('type', 'text');
		expect(input).toHaveAttribute('placeholder', 'Введите текст');
		expect(input).not.toBeDisabled();
		expect(input).not.toBeRequired();
	});

	it('отображает переданное значение', () => {
		render(
			<RegistrationField
				{...defaultProps}
				value="тестовое значение"
			/>
		);

		const input = screen.getByLabelText('Тестовое поле');
		expect(input).toHaveValue('тестовое значение');
	});

	it('вызывает onChange при вводе текста', () => {
		render(<RegistrationField {...defaultProps} />);

		const input = screen.getByLabelText('Тестовое поле');
		fireEvent.change(input, { target: { value: 'новый текст' } });

		expect(mockOnChange).toHaveBeenCalledTimes(1);
		expect(mockOnChange).toHaveBeenCalledWith('новый текст');
	});

	it('дизейблит поле, когда disabled=true', () => {
		render(
			<RegistrationField
				{...defaultProps}
				disabled={true}
			/>
		);

		const input = screen.getByLabelText('Тестовое поле');
		expect(input).toBeDisabled();
	});

	it('делает поле обязательным, когда required=true', () => {
		render(
			<RegistrationField
				{...defaultProps}
				required={true}
			/>
		);

		const input = screen.getByLabelText('Тестовое поле');
		expect(input).toBeRequired();
	});

	it('рендерит поле с правильным типом', () => {
		const { rerender } = render(
			<RegistrationField
				{...defaultProps}
				type="email"
			/>
		);

		let input = screen.getByLabelText('Тестовое поле');
		expect(input).toHaveAttribute('type', 'email');

		rerender(
			<RegistrationField
				{...defaultProps}
				type="password"
			/>
		);
		input = screen.getByLabelText('Тестовое поле');
		expect(input).toHaveAttribute('type', 'password');
	});

	it('имеет правильный CSS класс', () => {
		const { container } = render(<RegistrationField {...defaultProps} />);

		const fieldDiv = container.firstChild;
		expect(fieldDiv).toHaveClass(cls.field);
	});
});
