import axios from 'axios';
import {
	MANAGEBUNDLES_LOADING,
	MANAGEBUNDLES_LOADDED,
	MANAGEBUNDLES_SEARCH,
	MANAGEBUNDLES_LOAD_ERROR,
	MANAGEBUNDLES_SORT_NAME,
	MANAGEBUNDLES_PAGINATION
} from '../types.js';
import { tokenConfig } from './authAction.js';
import { orderSetter } from './manageadsAction.js';

export const loadingBundles = () => (dispatch, getState) => {
	dispatch({
		type: MANAGEBUNDLES_LOADING
	});
};

export const storepaginationBundles = (pagination, rpp) => (dispatch, getState) => {
	dispatch({
		type: MANAGEBUNDLES_PAGINATION,
		payload: {
			pagination: pagination,
			rowspp: rpp
		}
	});
};

export const searchBundles = (val) => (dispatch, getState) => {
	var match = [];
	var mads = getState().managebundles.managebundles;
	if (val) {
		mads.map((ads) => {
			if (ads.Adtitle.toLowerCase().indexOf(val.toLowerCase()) > -1) {
				match.push(ads);
			}
		});
		dispatch({
			type: MANAGEBUNDLES_SEARCH,
			payload: {
				ads: match,
				value: val
			}
		});
	} else {
		dispatch({
			type: MANAGEBUNDLES_SEARCH,
			payload: {
				ads: mads,
				value: val
			}
		});
	}
};

export const loadBundles = () => (dispatch, getState) => {
	dispatch({
		type: MANAGEBUNDLES_LOADING
	});
	if (tokenConfig(getState).headers.Authorization) {
		axios
			.get(`/bundles/`, tokenConfig(getState))
			.then((res) => {
				var data = res.data;
				data.forEach((ad) => {
					var remainingdays = 0;
					var d1 = new Date(ad.endDate);
					var d2 = new Date(Date.now());
					// console.log(d1,d2)
					var show = d1.getTime() - d2.getTime();
					remainingdays = show / (1000 * 3600 * 24);
					if (remainingdays < 0) {
						remainingdays = 'completed campaign';
					}
					ad.remainingDays = remainingdays;
				});
				console.log(data);
				dispatch({
					type: MANAGEBUNDLES_LOADDED,
					payload: data
				});
				dispatch(orderManagerBundles('asc', 'remainingDays', 'number'));
			})
			.catch((err) => {
				dispatch({
					type: MANAGEBUNDLES_LOAD_ERROR,
					payload: err
				});
			});
	}
};

export const loadClientBundles = () => (dispatch, getState) => {
	dispatch({
		type: MANAGEBUNDLES_LOADING
	});
	if (tokenConfig(getState).headers.Authorization) {
		axios
			.get(`/bundles/bun/bundlesClient`, tokenConfig(getState))
			.then((res) => {
				var data = res.data;
				console.log(res);
				data.forEach((ad) => {
					var remainingdays = 0;
					var d1 = new Date(ad.endDate);
					var d2 = new Date(Date.now());
					// console.log(d1,d2)
					var show = d1.getTime() - d2.getTime();
					remainingdays = show / (1000 * 3600 * 24);
					if (remainingdays < 0) {
						remainingdays = 'completed campaign';
					}
					ad.remainingDays = remainingdays;
				});
				console.log(data);
				dispatch({
					type: MANAGEBUNDLES_LOADDED,
					payload: data
				});
				dispatch(orderManagerBundles('asc', 'remainingDays', 'number'));
			})
			.catch((err) => {
				dispatch({
					type: MANAGEBUNDLES_LOAD_ERROR,
					payload: err
				});
			});
	}
};

export const orderManagerBundles = (order, name, type) => (dispatch, getState) => {
	var ads = getState().managebundles.managebundles;
	var searchads = getState().managebundles.searchedmanagebundles;
	ads = ads && orderSetter(order, name, ads, type);
	searchads = searchads && orderSetter(order, name, searchads, type);
	dispatch({
		type: MANAGEBUNDLES_SORT_NAME,
		payload: {
			name: name,
			direction: order,
			adss: ads,
			searchadss: searchads
		}
	});
};
