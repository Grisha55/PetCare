import { memo, useRef, type RefObject } from 'react';
import { useInfiniteScroll } from '../../../../shared/lib/hooks/useInfiniteScroll/useInfiniteScroll';
import styles from './Page.module.scss';

interface PageProps {
	className?: string;
	children: React.ReactNode;
	onScrollEnd?: () => void;
}

export const Page = memo((props: PageProps) => {
	const { children, onScrollEnd } = props;
	const wrapperRef = useRef<HTMLDivElement>(null);
	const triggerRef = useRef<HTMLDivElement>(null);

	useInfiniteScroll({
		callback: onScrollEnd,
		triggerRef: triggerRef as RefObject<HTMLDivElement>,
		wrapperRef: wrapperRef as RefObject<HTMLDivElement>
	});

	return (
		<section
			ref={wrapperRef}
			className={styles.page}
		>
			{children}
			<div ref={triggerRef} />
		</section>
	);
});
