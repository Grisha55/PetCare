import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DeleteAccount } from './DeleteAccount';

// Создаем моки с помощью vi.hoisted
const { mockRpc, mockSignOut } = vi.hoisted(() => {
	return {
		mockRpc: vi.fn(),
		mockSignOut: vi.fn()
	};
});

// Мокаем supabase, используя переменные из vi.hoisted
vi.mock('../../../shared/api/supabase', () => ({
	supabase: {
		rpc: mockRpc,
		auth: {
			signOut: mockSignOut
		}
	}
}));

// Мокаем Button компонент
vi.mock('../../../shared/ui/Button/Button', () => ({
	Button: ({
		children,
		onClick,
		disabled,
		variant
	}: {
		children: React.ReactNode;
		onClick?: () => void;
		disabled?: boolean;
		variant?: string;
	}) => (
		<button
			onClick={onClick}
			disabled={disabled}
			data-variant={variant}
			data-testid={variant === 'danger' ? 'danger-button' : 'outline-button'}
		>
			{children}
		</button>
	)
}));

describe('DeleteAccount', () => {
	const originalLocation = window.location;

	beforeEach(() => {
		vi.clearAllMocks();

		// Мокаем window.location
		Object.defineProperty(window, 'location', {
			value: { href: '' },
			writable: true,
			configurable: true
		});
	});

	afterEach(() => {
		Object.defineProperty(window, 'location', {
			value: originalLocation,
			writable: true,
			configurable: true
		});
	});

	it('рендерит кнопку "Удалить аккаунт"', () => {
		render(<DeleteAccount />);

		const button = screen.getByTestId('danger-button');
		expect(button).toBeInTheDocument();
		expect(button).toHaveTextContent('Удалить аккаунт');
	});

	it('показывает подтверждение при клике на кнопку', () => {
		render(<DeleteAccount />);

		const deleteButton = screen.getByTestId('danger-button');
		fireEvent.click(deleteButton);

		expect(screen.getByText(/Вы уверены?/)).toBeInTheDocument();
		expect(screen.getByText('Отмена')).toBeInTheDocument();
		expect(screen.getByText('Да, удалить аккаунт')).toBeInTheDocument();
	});

	it('скрывает подтверждение при клике на "Отмена"', () => {
		render(<DeleteAccount />);

		// Открываем подтверждение
		fireEvent.click(screen.getByTestId('danger-button'));
		expect(screen.getByText(/Вы уверены?/)).toBeInTheDocument();

		// Нажимаем "Отмена"
		fireEvent.click(screen.getByTestId('outline-button'));
		expect(screen.queryByText(/Вы уверены?/)).not.toBeInTheDocument();
	});

	it('показывает ошибку при неудачном удалении', async () => {
		const errorMessage = 'Ошибка удаления';
		mockRpc.mockRejectedValueOnce(new Error(errorMessage));

		render(<DeleteAccount />);

		// Открываем подтверждение
		fireEvent.click(screen.getByTestId('danger-button'));

		// Подтверждаем удаление
		const confirmButton = screen.getByText('Да, удалить аккаунт');
		fireEvent.click(confirmButton);

		await waitFor(() => {
			expect(screen.getByText(errorMessage)).toBeInTheDocument();
		});
	});

	it('успешно удаляет аккаунт и выходит из системы', async () => {
		mockRpc.mockResolvedValueOnce({ error: null });
		mockSignOut.mockResolvedValueOnce({ error: null });

		render(<DeleteAccount />);

		// Открываем подтверждение
		fireEvent.click(screen.getByTestId('danger-button'));

		// Подтверждаем удаление
		const confirmButton = screen.getByText('Да, удалить аккаунт');
		fireEvent.click(confirmButton);

		await waitFor(() => {
			expect(mockRpc).toHaveBeenCalledWith('delete_my_account');
			expect(mockSignOut).toHaveBeenCalled();
			expect(window.location.href).toBe('/');
		});
	});

	it('блокирует кнопки во время удаления', async () => {
		let resolvePromise: () => void = () => {};
		const promise = new Promise<void>(resolve => {
			resolvePromise = resolve;
		});

		mockRpc.mockImplementationOnce(() => promise);

		render(<DeleteAccount />);

		// Открываем подтверждение
		fireEvent.click(screen.getByTestId('danger-button'));

		// Подтверждаем удаление
		const confirmButton = screen.getByText('Да, удалить аккаунт');
		fireEvent.click(confirmButton);

		// Проверяем, что кнопки заблокированы
		expect(screen.getByText('Отмена')).toBeDisabled();
		expect(screen.getByText('Удаление...')).toBeDisabled();

		resolvePromise();
	});
});
