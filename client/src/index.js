import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import Apindex from './apindex';

ReactDOM.render(
	<React.StrictMode>
		<BrowserRouter>
			<Apindex />
		</BrowserRouter>
	</React.StrictMode>,
	document.getElementById('root')
);
