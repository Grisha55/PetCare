import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { TipsDecorations } from './TipsDecorations';
import cls from './TipsDecorations.module.scss';

describe('TipsDecorations', () => {
	it('рендерит контейнер декораций', () => {
		const { container } = render(<TipsDecorations />);

		const decorations = container.firstChild;
		expect(decorations).toBeInTheDocument();
		expect(decorations).toHaveClass(cls.decorations);
	});

	it('рендерит два блоба', () => {
		const { container } = render(<TipsDecorations />);

		const blobs = container.querySelectorAll(
			`.${cls.blobTopRight}, .${cls.blobBottomLeft}`
		);
		expect(blobs).toHaveLength(2);
	});

	it('рендерит верхний правый блоб', () => {
		const { container } = render(<TipsDecorations />);

		const topRightBlob = container.querySelector(`.${cls.blobTopRight}`);
		expect(topRightBlob).toBeInTheDocument();
	});

	it('рендерит нижний левый блоб', () => {
		const { container } = render(<TipsDecorations />);

		const bottomLeftBlob = container.querySelector(`.${cls.blobBottomLeft}`);
		expect(bottomLeftBlob).toBeInTheDocument();
	});

	it('имеет правильную структуру', () => {
		const { container } = render(<TipsDecorations />);

		const decorations = container.firstChild;
		const topRightBlob = decorations?.firstChild;
		const bottomLeftBlob = decorations?.lastChild;

		expect(topRightBlob).toHaveClass(cls.blobTopRight);
		expect(bottomLeftBlob).toHaveClass(cls.blobBottomLeft);
	});
});
