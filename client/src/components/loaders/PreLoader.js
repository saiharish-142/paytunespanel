import React from 'react';
import PreLoaders from './PreLoader.module.css';

function PreLoader() {
	return (
		<div class={PreLoaders.gooey}>
			<span class={PreLoaders.dot} />
			<div class={PreLoaders.dots}>
				<span />
				<span />
				<span />
			</div>
		</div>
	);
}

export default PreLoader;
