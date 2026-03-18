import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AddMedicalRecord } from './AddMedicalRecord';

describe('AddMedicalRecord', () => {
	const mockOnAdd = vi.fn();

	beforeEach(() => {
		mockOnAdd.mockClear();
	});

	describe('Рендер', () => {
		it('должен отображать все поля формы', () => {
			render(<AddMedicalRecord onAdd={mockOnAdd} />);

			// Проверяем наличие полей по label
			expect(screen.getByLabelText('Тип записи')).toBeInTheDocument();
			expect(screen.getByLabelText('Название')).toBeInTheDocument();
			expect(screen.getByLabelText('Описание')).toBeInTheDocument();
			expect(screen.getByLabelText('Дата')).toBeInTheDocument();

			// Проверяем кнопку
			expect(
				screen.getByRole('button', { name: /добавить/i })
			).toBeInTheDocument();
		});

		it('должен иметь правильные опции в селекте', () => {
			render(<AddMedicalRecord onAdd={mockOnAdd} />);

			const select = screen.getByLabelText('Тип записи');
			expect(select).toBeInTheDocument();

			// Проверяем опции
			expect(screen.getByRole('option', { name: 'Прививка' })).toHaveValue(
				'vaccine'
			);
			expect(screen.getByRole('option', { name: 'Лекарство' })).toHaveValue(
				'medicine'
			);
			expect(
				screen.getByRole('option', { name: 'Посещение врача' })
			).toHaveValue('visit');
		});

		it('по умолчанию должен быть выбран тип vaccine', () => {
			render(<AddMedicalRecord onAdd={mockOnAdd} />);

			const select = screen.getByLabelText('Тип записи') as HTMLSelectElement;
			expect(select.value).toBe('vaccine');
		});
	});

	describe('Ввод данных', () => {
		it('должен обновлять значение title при вводе', async () => {
			const user = userEvent.setup();
			render(<AddMedicalRecord onAdd={mockOnAdd} />);

			const titleInput = screen.getByLabelText('Название');
			await user.type(titleInput, 'Прививка от бешенства');

			expect(titleInput).toHaveValue('Прививка от бешенства');
		});

		it('должен обновлять значение description при вводе', async () => {
			const user = userEvent.setup();
			render(<AddMedicalRecord onAdd={mockOnAdd} />);

			const descInput = screen.getByLabelText('Описание');
			await user.type(descInput, 'Ежегодная вакцинация');

			expect(descInput).toHaveValue('Ежегодная вакцинация');
		});

		it('должен обновлять значение date при вводе', async () => {
			const user = userEvent.setup();
			render(<AddMedicalRecord onAdd={mockOnAdd} />);

			const dateInput = screen.getByLabelText('Дата') as HTMLInputElement;
			await user.type(dateInput, '2024-12-31');

			expect(dateInput).toHaveValue('2024-12-31');
		});

		it('должен обновлять тип записи при выборе', async () => {
			const user = userEvent.setup();
			render(<AddMedicalRecord onAdd={mockOnAdd} />);

			const select = screen.getByLabelText('Тип записи') as HTMLSelectElement;
			await user.selectOptions(select, 'visit');

			expect(select).toHaveValue('visit');
		});
	});

	describe('Сабмит формы', () => {
		it('должен вызывать onAdd с правильными данными при отправке', async () => {
			const user = userEvent.setup();
			render(<AddMedicalRecord onAdd={mockOnAdd} />);

			// Заполняем форму
			await user.type(screen.getByLabelText('Название'), 'Прививка');
			await user.type(screen.getByLabelText('Описание'), 'Описание прививки');
			await user.type(screen.getByLabelText('Дата'), '2024-12-31');

			// Отправляем
			await user.click(screen.getByRole('button', { name: /добавить/i }));

			// Проверяем, что onAdd вызван с правильными данными
			expect(mockOnAdd).toHaveBeenCalledTimes(1);
			expect(mockOnAdd).toHaveBeenCalledWith({
				type: 'vaccine',
				title: 'Прививка',
				description: 'Описание прививки',
				date: '2024-12-31'
			});
		});

		it('должен вызывать onAdd с выбранным типом записи', async () => {
			const user = userEvent.setup();
			render(<AddMedicalRecord onAdd={mockOnAdd} />);

			// Выбираем другой тип
			await user.selectOptions(screen.getByLabelText('Тип записи'), 'visit');

			// Заполняем обязательные поля
			await user.type(screen.getByLabelText('Название'), 'Визит к врачу');
			await user.type(screen.getByLabelText('Дата'), '2024-12-31');

			await user.click(screen.getByRole('button', { name: /добавить/i }));

			expect(mockOnAdd).toHaveBeenCalledWith(
				expect.objectContaining({ type: 'visit' })
			);
		});

		it('должен очищать поля после успешной отправки', async () => {
			const user = userEvent.setup();
			render(<AddMedicalRecord onAdd={mockOnAdd} />);

			// Заполняем форму
			await user.type(screen.getByLabelText('Название'), 'Прививка');
			await user.type(screen.getByLabelText('Описание'), 'Описание');
			await user.type(screen.getByLabelText('Дата'), '2024-12-31');

			await user.click(screen.getByRole('button', { name: /добавить/i }));

			// Проверяем, что поля очистились
			await waitFor(() => {
				expect(screen.getByLabelText('Название')).toHaveValue('');
				expect(screen.getByLabelText('Описание')).toHaveValue('');
				expect(screen.getByLabelText('Дата')).toHaveValue('');
			});
		});

		it('не должен очищать поля, если onAdd выбросил ошибку', async () => {
			// Мокаем onAdd, чтобы он выбрасывал ошибку
			const errorMock = vi.fn().mockRejectedValue(new Error('Ошибка'));
			render(<AddMedicalRecord onAdd={errorMock} />);

			const user = userEvent.setup();

			// Заполняем поля
			await user.type(screen.getByLabelText('Название'), 'Прививка');
			await user.type(screen.getByLabelText('Дата'), '2024-12-31');

			// Отправляем форму
			await user.click(screen.getByRole('button', { name: /добавить/i }));

			// Ждем немного для обработки ошибки
			await waitFor(() => {
				// Проверяем, что появилось сообщение об ошибке
				expect(screen.getByText('Ошибка')).toBeInTheDocument();
			});

			// Проверяем, что поля НЕ очистились
			expect(screen.getByLabelText('Название')).toHaveValue('Прививка');
			expect(screen.getByLabelText('Дата')).toHaveValue('2024-12-31');

			// Проверяем, что кнопка снова активна
			expect(
				screen.getByRole('button', { name: /добавить/i })
			).not.toBeDisabled();
		});
	});

	describe('Валидация', () => {
		it('должен требовать заполнения названия', () => {
			render(<AddMedicalRecord onAdd={mockOnAdd} />);

			const titleInput = screen.getByLabelText('Название');
			expect(titleInput).toBeRequired();
		});

		it('должен требовать заполнения даты', () => {
			render(<AddMedicalRecord onAdd={mockOnAdd} />);

			const dateInput = screen.getByLabelText('Дата');
			expect(dateInput).toBeRequired();
		});

		it('не должен требовать заполнения описания', () => {
			render(<AddMedicalRecord onAdd={mockOnAdd} />);

			const descInput = screen.getByLabelText('Описание');
			expect(descInput).not.toBeRequired();
		});

		it('не должен отправлять форму, если не заполнены обязательные поля', async () => {
			const user = userEvent.setup();
			render(<AddMedicalRecord onAdd={mockOnAdd} />);

			// Пытаемся отправить пустую форму
			await user.click(screen.getByRole('button', { name: /добавить/i }));

			// Проверяем, что onAdd не был вызван
			expect(mockOnAdd).not.toHaveBeenCalled();
		});
	});

	describe('Edge cases', () => {
		it('должен работать с очень длинным текстом', async () => {
			const user = userEvent.setup();
			render(<AddMedicalRecord onAdd={mockOnAdd} />);

			const longText = 'a'.repeat(1000);
			await user.type(screen.getByLabelText('Описание'), longText);

			expect(screen.getByLabelText('Описание')).toHaveValue(longText);
		});

		it('должен работать с минимальной датой', async () => {
			const user = userEvent.setup();
			render(<AddMedicalRecord onAdd={mockOnAdd} />);

			const minDate = '1900-01-01';
			await user.type(screen.getByLabelText('Дата'), minDate);

			expect(screen.getByLabelText('Дата')).toHaveValue(minDate);
		});

		it('должен правильно обрабатывать последовательное добавление записей', async () => {
			const user = userEvent.setup();
			render(<AddMedicalRecord onAdd={mockOnAdd} />);

			// Первая запись
			await user.type(screen.getByLabelText('Название'), 'Запись 1');
			await user.type(screen.getByLabelText('Дата'), '2024-01-01');
			await user.click(screen.getByRole('button', { name: /добавить/i }));

			expect(mockOnAdd).toHaveBeenCalledWith(
				expect.objectContaining({ title: 'Запись 1' })
			);

			// Вторая запись (снова заполняем поля)
			await user.type(screen.getByLabelText('Название'), 'Запись 2');
			await user.type(screen.getByLabelText('Дата'), '2024-02-01');
			await user.click(screen.getByRole('button', { name: /добавить/i }));

			expect(mockOnAdd).toHaveBeenLastCalledWith(
				expect.objectContaining({ title: 'Запись 2' })
			);
			expect(mockOnAdd).toHaveBeenCalledTimes(2);
		});
	});

	describe('Accessibility', () => {
		it('должен иметь доступные метки для полей', () => {
			render(<AddMedicalRecord onAdd={mockOnAdd} />);

			// Проверяем, что поля имеют соответствующие label
			expect(screen.getByLabelText('Тип записи')).toBeInTheDocument();
			expect(screen.getByLabelText('Название')).toBeInTheDocument();
			expect(screen.getByLabelText('Описание')).toBeInTheDocument();
			expect(screen.getByLabelText('Дата')).toBeInTheDocument();
		});

		it('должен иметь кнопку с доступным именем', () => {
			render(<AddMedicalRecord onAdd={mockOnAdd} />);

			const button = screen.getByRole('button', { name: /добавить/i });
			expect(button).toHaveAccessibleName();
		});
	});
});
