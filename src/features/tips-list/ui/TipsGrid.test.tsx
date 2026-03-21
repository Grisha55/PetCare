import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Tip } from '../../../entities/tip';
import { TipsGrid } from './TipsGrid';
import styles from './TipsGrid.module.scss';

describe('TipsGrid', () => {
	const mockTips: Tip[] = [
		{ id: '1', title: 'Совет 1', content: 'Контент 1', category: 'health' },
		{ id: '2', title: 'Совет 2', content: 'Контент 2', category: 'training' },
		{ id: '3', title: 'Совет 3', content: 'Контент 3', category: 'nutrition' }
	];

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('показывает состояние загрузки', () => {
		render(
			<TipsGrid
				tips={[]}
				loading={true}
			/>
		);

		expect(screen.getByText('Загрузка советов...')).toBeInTheDocument();
		expect(screen.getByText('Загрузка советов...').parentElement).toHaveClass(
			styles.loading
		);
	});

	it('показывает спиннер во время загрузки', () => {
		const { container } = render(
			<TipsGrid
				tips={[]}
				loading={true}
			/>
		);

		const spinner = container.querySelector(`.${styles.spinner}`);
		expect(spinner).toBeInTheDocument();
	});

	it('показывает сообщение "Советы не найдены" когда нет советов', () => {
		render(
			<TipsGrid
				tips={[]}
				loading={false}
			/>
		);

		expect(screen.getByText('Советы не найдены')).toBeInTheDocument();
		expect(screen.getByText('Советы не найдены').parentElement).toHaveClass(
			styles.empty
		);
	});

	it('отображает список советов', () => {
		render(
			<TipsGrid
				tips={mockTips}
				loading={false}
			/>
		);

		expect(screen.getByText('Совет 1')).toBeInTheDocument();
		expect(screen.getByText('Совет 2')).toBeInTheDocument();
		expect(screen.getByText('Совет 3')).toBeInTheDocument();
	});

	it('отображает категории советов', () => {
		render(
			<TipsGrid
				tips={mockTips}
				loading={false}
			/>
		);

		expect(screen.getByText('Здоровье')).toBeInTheDocument();
		expect(screen.getByText('Дрессировка')).toBeInTheDocument();
		expect(screen.getByText('Питание')).toBeInTheDocument();
	});

	it('имеет правильную сетку для списка советов', () => {
		const { container } = render(
			<TipsGrid
				tips={mockTips}
				loading={false}
			/>
		);

		const grid = container.querySelector(`.${styles.grid}`);
		expect(grid).toBeInTheDocument();
	});

	it('отображает правильное количество карточек', () => {
		render(
			<TipsGrid
				tips={mockTips}
				loading={false}
			/>
		);

		const cards = screen.getAllByRole('heading', { level: 3 });
		expect(cards).toHaveLength(3);
	});

	it('работает с пустым onSaveToggle', () => {
		render(
			<TipsGrid
				tips={mockTips}
				loading={false}
			/>
		);

		expect(screen.getByText('Совет 1')).toBeInTheDocument();
	});
});
