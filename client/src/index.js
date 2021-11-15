import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import Apindex from './apindex';

ReactDOM.render(
	<BrowserRouter>
		<React.StrictMode>
			<Apindex />
		</React.StrictMode>
	</BrowserRouter>,
	document.getElementById('root')
);
