import { RATIO_UPDATED, RATIO_ERROR, RATIO_CLEAR, RATIO_LOADING } from '../types.js';
import axios from 'axios';
import { tokenConfig } from './authAction.js';

export const loadingRatio = () => (dispatch, getState) => {
	dispatch({
		type: RATIO_LOADING
	});
};

export const clearRatio = () => (dispatch, getState) => {
	dispatch({
		type: RATIO_CLEAR
	});
};

export const loadRatio = () => (dispatch, getState) => {
	dispatch({
		type: RATIO_LOADING
	});
	if (tokenConfig(getState).headers.Authorization) {
		axios
			.get('https://free.currconv.com/api/v7/convert?q=USD_INR&compact=ultra&apiKey=30b70a4db3f30dac36bf')
			.then((res) => {
				console.log(res.data.USD_INR);
				dispatch({
					type: RATIO_UPDATED,
					payload: res.data.USD_INR
				});
			})
			.catch((err) => {
				dispatch({
					type: RATIO_ERROR,
					payload: err
				});
			});
	}
};
