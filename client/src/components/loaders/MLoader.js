import React from 'react';
import styles from './MLoader.module.css';

function MLoader() {
	return (
		<div className={styles.body}>
			<div className={styles.container}>
				<div className={styles.box1} />
				<div className={styles.box2} />
				<div className={styles.box3} />
			</div>
		</div>
	);
}

export default MLoader;
