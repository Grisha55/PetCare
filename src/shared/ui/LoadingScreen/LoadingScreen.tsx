import { useEffect, useState } from 'react';
import styles from './LoadingScreen.module.scss';

export const LoadingScreen = () => {
	const [progress, setProgress] = useState(0);

	useEffect(() => {
		const interval = setInterval(() => {
			setProgress(prev => {
				if (prev >= 100) {
					clearInterval(interval);
					return 100;
				}
				return prev + 2;
			});
		}, 20);

		return () => clearInterval(interval);
	}, []);

	return (
		<div className={styles.loadingContainer}>
			<div className={styles.loadingContent}>
				<div className={styles.pawWrapper}>
					<div className={styles.pawPrint}>🐾</div>
					<div className={styles.pawRing}></div>
					<div className={styles.pawRingDelayed}></div>
				</div>

				<div className={styles.loadingText}>
					<span>З</span>
					<span>а</span>
					<span>г</span>
					<span>р</span>
					<span>у</span>
					<span>з</span>
					<span>к</span>
					<span>а</span>
				</div>

				<div className={styles.progressBarContainer}>
					<div
						className={styles.progressBarFill}
						style={{ width: `${progress}%` }}
					></div>
				</div>

				<div className={styles.loadingPercentage}>{progress}%</div>
			</div>
		</div>
	);
};
