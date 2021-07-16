import axios from 'axios';
import {
	MANAGEADS_LOADING,
	MANAGEADS_LOADDED,
	MANAGEADS_SEARCH,
	MANAGEADS_PAGINATION,
	MANAGEADS_LOAD_ERROR,
	MANAGEADS_SORT_NAME
} from '../types.js';
import { tokenConfig } from './authAction.js';

export const loadingAds = () => (dispatch, getState) => {
	dispatch({
		type: MANAGEADS_LOADING
	});
};

export const storepagination = (pagination, rpp) => (dispatch, getState) => {
	// console.log({
	// 	pagination: pagination,
	// 	rowspp: rpp
	// });
	dispatch({
		type: MANAGEADS_PAGINATION,
		payload: {
			pagination: pagination,
			rowspp: rpp
		}
	});
};

export const searchads = (val) => (dispatch, getState) => {
	var match = [];
	var mads = getState().manageads.manageads;
	if (val) {
		mads.map((ads) => {
			if (ads.Adtitle.toLowerCase().indexOf(val.toLowerCase()) > -1) {
				match.push(ads);
			}
		});
		dispatch({
			type: MANAGEADS_SEARCH,
			payload: {
				ads: match,
				value: val
			}
		});
	} else {
		dispatch({
			type: MANAGEADS_SEARCH,
			payload: {
				ads: mads,
				value: val
			}
		});
	}
};

export const loadAds = () => (dispatch, getState) => {
	dispatch({
		type: MANAGEADS_LOADING
	});
	if (tokenConfig(getState).headers.Authorization) {
		axios
			.get(`/streamingads/groupedMod1`, tokenConfig(getState))
			.then((res) => {
				console.log(res.data);
				dispatch({
					type: MANAGEADS_LOADDED,
					payload: res.data
				});
				dispatch(orderManager('asc', 'remainingDays', 'number'));
			})
			.catch((err) => {
				dispatch({
					type: MANAGEADS_LOAD_ERROR,
					payload: err
				});
			});
	} else {
		dispatch({
			type: MANAGEADS_LOAD_ERROR,
			payload: 'login required'
		});
	}
};

export const loadClientAds = () => (dispatch, getState) => {
	dispatch({
		type: MANAGEADS_LOADING
	});
	const user = getState().auth.user;
	console.log(user.campaigns);
	if (tokenConfig(getState).headers.Authorization) {
		fetch('/streamingads/clientgroupedbyids', {
			method: 'put',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + localStorage.getItem('jwt')
			},
			body: JSON.stringify({
				campaignId: user.campaigns
			})
		})
			.then((res) => res.json())
			.then((res) => {
				console.log(res);
				dispatch({
					type: MANAGEADS_LOADDED,
					payload: res
				});
				dispatch(orderManager('asc', 'remainingDays', 'number'));
			})
			.catch((err) => {
				dispatch({
					type: MANAGEADS_LOAD_ERROR,
					payload: err
				});
			});
	} else {
		dispatch({
			type: MANAGEADS_LOAD_ERROR,
			payload: 'login required'
		});
	}
};

export const orderManager = (order, name, type) => (dispatch, getState) => {
	var ads = getState().manageads.manageads;
	var searchads = getState().manageads.searchedmanageads;
	ads = ads && orderSetter(order, name, ads, type);
	searchads = searchads && orderSetter(order, name, searchads, type);
	dispatch({
		type: MANAGEADS_SORT_NAME,
		payload: {
			name: name,
			direction: order,
			adss: ads,
			searchadss: searchads
		}
	});
};

export const orderSetter = (order, column, data, type) => {
	var dataSort = data;
	// console.log(order, column, data, type);
	dataSort = dataSort.sort(function(a, b) {
		if (type === 'string') {
			var aa = a[column] ? String(a[column]) : null;
			var bb = b[column] ? String(b[column]) : null;
			if (aa === bb) {
				return 0;
			} else if (aa === null) {
				return 1;
			} else if (bb === null) {
				return -1;
			} else if (order === 'asc') {
				return aa < bb ? -1 : 1;
			} else {
				return aa < bb ? 1 : -1;
			}
		} else if (type === 'date') {
			var ad = new Date(a[column]);
			var bd = new Date(b[column]);
			if (ad === bd) {
				return 0;
			} else if (ad === null) {
				return 1;
			} else if (bd === null) {
				return -1;
			} else if (order === 'asc') {
				return ad - bd;
			} else {
				return bd - ad;
			}
		} else {
			var an = a[column] !== (undefined || null) ? (typeof a[column] === 'number' ? a[column] : null) : null;
			var bn = b[column] !== (undefined || null) ? (typeof b[column] === 'number' ? b[column] : null) : null;
			if (an === bn) {
				return 0;
			} else if (an === null) {
				return 1;
			} else if (bn === null) {
				return -1;
			} else if (order === 'asc') {
				return an - bn;
			} else {
				return bn - an;
			}
		}
	});
	return dataSort;
};

// ads = ads.sort(function(a, b) {
// 	if (order === 'asc') {
// 		if (
// 			name === 'Adtitle' ||
// 			name === 'Advertiser' ||
// 			name === 'Pricing' ||
// 			name === 'ro' ||
// 			name === 'PricingModel' ||
// 			name === 'Category'
// 		) {
// 			var ada = a[name] ? String(a[name]) : null;
// 			var adb = b[name] ? String(b[name]) : null;
// 			if (ada === adb) {
// 				return 0;
// 			} else if (ada === null) {
// 				return 1;
// 			} else if (adb === null) {
// 				return -1;
// 			} else {
// 				return ada < adb ? -1 : 1;
// 			}
// 		}
// 		if (name === 'createdOn' || name === 'startDate' || name === 'endDate') {
// 			var dat1 = new Date(a[name]);
// 			var dat2 = new Date(b[name]);
// 			return dat1 - dat2;
// 		}
// 		return a[name] - b[name];
// 	} else {
// 		if (
// 			name === 'Adtitle' ||
// 			name === 'Advertiser' ||
// 			name === 'Pricing' ||
// 			name === 'ro' ||
// 			name === 'PricingModel' ||
// 			name === 'Category'
// 		) {
// 			var ada = a[name] ? String(a[name]) : null;
// 			var adb = b[name] ? String(b[name]) : null;
// 			if (ada === adb) {
// 				return 0;
// 			} else if (ada === null) {
// 				return 1;
// 			} else if (adb === null) {
// 				return -1;
// 			} else {
// 				return ada < adb ? 1 : -1;
// 			}
// 		}
// 		if (name === 'createdOn' || name === 'startDate' || name === 'endDate') {
// 			var dat1 = new Date(a[name]);
// 			var dat2 = new Date(b[name]);
// 			return dat2 - dat1;
// 		}
// 		return b[name] - a[name];
// 	}
// });
// searchads = searchads.sort(function(a, b) {
// 	if (order === 'asc') {
// 		if (
// 			name === 'Adtitle' ||
// 			name === 'Advertiser' ||
// 			name === 'Pricing' ||
// 			name === 'ro' ||
// 			name === 'PricingModel' ||
// 			name === 'Category'
// 		) {
// 			var ada = a[name] ? String(a[name]) : null;
// 			var adb = b[name] ? String(b[name]) : null;
// 			if (ada === adb) {
// 				return 0;
// 			} else if (ada === null) {
// 				return 1;
// 			} else if (adb === null) {
// 				return -1;
// 			} else {
// 				return ada < adb ? -1 : 1;
// 			}
// 		}
// 		if (name === 'createdOn' || name === 'startDate' || name === 'endDate') {
// 			var dat1 = new Date(a[name]);
// 			var dat2 = new Date(b[name]);
// 			return dat1 - dat2;
// 		}
// 		return a[name] - b[name];
// 	} else {
// 		if (
// 			name === 'Adtitle' ||
// 			name === 'Advertiser' ||
// 			name === 'Pricing' ||
// 			name === 'ro' ||
// 			name === 'PricingModel' ||
// 			name === 'Category'
// 		) {
// 			var ada = a[name] ? String(a[name]) : null;
// 			var adb = b[name] ? String(b[name]) : null;
// 			if (ada === adb) {
// 				return 0;
// 			} else if (ada === null) {
// 				return 1;
// 			} else if (adb === null) {
// 				return -1;
// 			} else {
// 				return ada < adb ? 1 : -1;
// 			}
// 		}
// 		if (name === 'createdOn' || name === 'startDate' || name === 'endDate') {
// 			var dat1 = new Date(a[name]);
// 			var dat2 = new Date(b[name]);
// 			return dat2 - dat1;
// 		}
// 		return b[name] - a[name];
// 	}
// });
