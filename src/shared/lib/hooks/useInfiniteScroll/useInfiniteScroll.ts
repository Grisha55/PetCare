import { useEffect, type RefObject } from 'react'

export interface UseInfiniteScroll {
	callback?: () => void;
	triggerRef: RefObject<HTMLElement>;
	wrapperRef: RefObject<HTMLElement>;
}

export function useInfiniteScroll({ callback, triggerRef, wrapperRef }: UseInfiniteScroll) {

	useEffect(() => {
		let observer: IntersectionObserver | null = null;
		const options = {
			root: wrapperRef.current,
			rootMargin: '0px',
			threshold: 1.0,
		};

		if (callback) {
			observer = new IntersectionObserver(([entry]) => {
				if (entry.isIntersecting) {
					callback();
				}
			}, options);

			observer.observe(triggerRef.current);
		}

		return () => {
			if (observer) {
				observer.unobserve(triggerRef.current);
			}
		}
	}, [triggerRef, wrapperRef, callback]);
}