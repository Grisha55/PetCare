import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { BackButton } from './BackButton';
import cls from './BackButton.module.scss';

// Мокаем useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
	useNavigate: () => mockNavigate
}));

// Мокаем иконку
vi.mock('lucide-react', () => ({
	ArrowLeft: () => <div data-testid="arrow-icon" />
}));

describe('BackButton', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('рендерит кнопку с текстом "Назад"', () => {
		render(<BackButton />);

		expect(screen.getByText('Назад')).toBeInTheDocument();
		expect(screen.getByRole('button')).toBeInTheDocument();
	});

	it('рендерит иконку стрелки', () => {
		render(<BackButton />);

		expect(screen.getByTestId('arrow-icon')).toBeInTheDocument();
	});

	it('имеет правильный aria-label', () => {
		render(<BackButton />);

		const button = screen.getByRole('button');
		expect(button).toHaveAttribute('aria-label', 'Вернуться назад');
	});

	it('вызывает navigate(-1) при клике', () => {
		render(<BackButton />);

		const button = screen.getByRole('button');
		fireEvent.click(button);

		expect(mockNavigate).toHaveBeenCalledTimes(1);
		expect(mockNavigate).toHaveBeenCalledWith(-1);
	});

	it('применяет переданный className', () => {
		render(<BackButton className="custom-class" />);

		const button = screen.getByRole('button');
		expect(button).toHaveClass('custom-class');
	});

	it('имеет правильный CSS класс по умолчанию', () => {
		render(<BackButton />);

		const button = screen.getByRole('button');
		expect(button).toHaveClass(cls.backButton);
	});

	it('объединяет className с классом по умолчанию', () => {
		render(<BackButton className="custom-class" />);

		const button = screen.getByRole('button');
		expect(button).toHaveClass(cls.backButton);
		expect(button).toHaveClass('custom-class');
	});
});
