import React from 'react';
import App from './App';
import store from './redux';
import { Provider } from 'react-redux';

function Apindex() {
	return (
		<Provider store={store}>
			<App />
		</Provider>
	);
}

export default Apindex;
