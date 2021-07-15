// import React from 'react';
import axios from 'axios';
import {
	USER_LOADING,
	USER_LOADED,
	LOAD_USER_FAIL,
	AUTH_ERROR,
	LOGIN_SUCCESS,
	LOGOUT_SUCCESS,
	NETWORK_ERROR
} from '../types';

export const loadinguser = () => (dispatch, getState) => {
	dispatch({
		type: USER_LOADING
	});
};

export const networkError = () => (dispatch) => {
	dispatch({
		type: NETWORK_ERROR
	});
};

export const loadUser = () => (dispatch, getState) => {
	dispatch({
		type: USER_LOADING
	});
	if (tokenConfig(getState).headers.Authorization) {
		axios
			.get(`/auth/loggedUser`, tokenConfig(getState))
			.then((res) => {
				console.log(res);
				dispatch({
					type: USER_LOADED,
					payload: res.data
				});
			})
			.catch((err) => {
				//dispatch(returnErrors(err.response.data, err.response.status));
				dispatch({
					type: LOAD_USER_FAIL
				});
			});
	} else {
		dispatch({
			type: AUTH_ERROR
		});
	}
};

export const loginUser = (user) => (dispatch) => {
	// console.log(user);
	fetch('/auth/signin', {
		method: 'post',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			email: user.email,
			password: user.password
		})
	})
		.then((res) => res.json())
		.then((res) => {
			// console.log(res)
			dispatch({
				type: LOGIN_SUCCESS,
				payload: res
			});
		})
		.catch((err) => {
			console.log(err);
			dispatch({
				type: AUTH_ERROR
			});
		});
};

export const logoutUser = () => (dispatch) => {
	dispatch({
		type: LOGOUT_SUCCESS
	});
};

export const tokenConfig = (getState) => {
	const token = getState().auth.token;
	const config = {
		headers: {
			'Content-type': 'application/json'
		}
	};
	if (token) {
		config.headers['Authorization'] = 'Bearer ' + token;
	}
	return config;
};
