import React from 'react';
import PreLoaders from './PreLoader.module.css';

function PreLoader() {
	return (
		<div className={PreLoaders.gooey}>
			<span className={PreLoaders.dot} />
			<div className={PreLoaders.dots}>
				<span />
				<span />
				<span />
			</div>
		</div>
	);
}

export default PreLoader;
