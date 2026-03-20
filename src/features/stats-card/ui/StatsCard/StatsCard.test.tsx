import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { StatsCard } from './StatsCard';
import cls from './StatsCard.module.scss';

describe('StatsCard', () => {
	const defaultProps = {
		daysWithPet: 365,
		savedTipsCount: 42,
		achievementsCount: 15
	};

	it('рендерит заголовок "Статистика"', () => {
		render(<StatsCard {...defaultProps} />);

		expect(screen.getByText('Статистика')).toBeInTheDocument();
	});

	it('отображает количество дней с питомцем', () => {
		render(<StatsCard {...defaultProps} />);

		expect(screen.getByText('365')).toBeInTheDocument();
		expect(screen.getByText('Дней с питомцем')).toBeInTheDocument();
	});

	it('отображает количество сохраненных советов', () => {
		render(<StatsCard {...defaultProps} />);

		expect(screen.getByText('42')).toBeInTheDocument();
		expect(screen.getByText('Сохраненных советов')).toBeInTheDocument();
	});

	it('отображает количество достижений', () => {
		render(<StatsCard {...defaultProps} />);

		expect(screen.getByText('15')).toBeInTheDocument();
		expect(screen.getByText('Достижений')).toBeInTheDocument();
	});

	it('отображает нулевые значения', () => {
		render(
			<StatsCard
				daysWithPet={0}
				savedTipsCount={0}
				achievementsCount={0}
			/>
		);

		const zeroValues = screen.getAllByText('0');
		expect(zeroValues).toHaveLength(3);
		expect(zeroValues[0]).toBeInTheDocument();
	});

	it('отображает большие числа', () => {
		render(
			<StatsCard
				daysWithPet={1000}
				savedTipsCount={999}
				achievementsCount={123456}
			/>
		);

		expect(screen.getByText('1000')).toBeInTheDocument();
		expect(screen.getByText('999')).toBeInTheDocument();
		expect(screen.getByText('123456')).toBeInTheDocument();
	});

	it('имеет правильный CSS класс для карточки', () => {
		const { container } = render(<StatsCard {...defaultProps} />);

		const card = container.firstChild;
		expect(card).toHaveClass(cls.statsCard);
	});

	it('имеет правильную структуру сетки', () => {
		const { container } = render(<StatsCard {...defaultProps} />);

		const grid = container.querySelector(`.${cls.statsGrid}`);
		expect(grid).toBeInTheDocument();

		const items = container.querySelectorAll(`.${cls.statItem}`);
		expect(items).toHaveLength(3);
	});
});
