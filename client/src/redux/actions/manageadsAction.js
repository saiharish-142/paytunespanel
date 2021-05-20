import axios from 'axios';
import {
	MANAGEADS_LOADING,
	MANAGEADS_LOADDED,
	MANAGEADS_SEARCH,
	MANAGE_LOAD_ERROR,
	MANAGEADS_SORT_NAME
} from '../types.js';
import { tokenConfig } from './authAction.js';

export const loadingAds = () => (dispatch, getState) => {
	dispatch({
		type: MANAGEADS_LOADING
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
				dispatch(orderManager('asc', 'remainingDays'));
			})
			.catch((err) => {
				dispatch({
					type: MANAGE_LOAD_ERROR,
					payload: err
				});
			});
	}
};

export const orderManager = (order, name) => (dispatch, getState) => {
	var ads = getState().manageads.manageads;
	var searchads = getState().manageads.manageads;
	ads = ads.sort(function(a, b) {
		if (order === 'asc') {
			if (
				name === 'Adtitle' ||
				name === 'Advertiser' ||
				name === 'Pricing' ||
				name === 'ro' ||
				name === 'PricingModel' ||
				name === 'Category'
			) {
				var ada = a[name] ? String(a[name]) : null;
				var adb = b[name] ? String(b[name]) : null;
				if (ada === adb) {
					return 0;
				} else if (ada === null) {
					return 1;
				} else if (adb === null) {
					return -1;
				} else {
					return ada < adb ? -1 : 1;
				}
			}
			if (name === 'createdOn' || name === 'startDate' || name === 'endDate') {
				var dat1 = new Date(a[name]);
				var dat2 = new Date(b[name]);
				return dat1 - dat2;
			}
			return a[name] - b[name];
		} else {
			if (
				name === 'Adtitle' ||
				name === 'Advertiser' ||
				name === 'Pricing' ||
				name === 'ro' ||
				name === 'PricingModel' ||
				name === 'Category'
			) {
				var ada = a[name] ? String(a[name]) : null;
				var adb = b[name] ? String(b[name]) : null;
				if (ada === adb) {
					return 0;
				} else if (ada === null) {
					return 1;
				} else if (adb === null) {
					return -1;
				} else {
					return ada < adb ? 1 : -1;
				}
			}
			if (name === 'createdOn' || name === 'startDate' || name === 'endDate') {
				var dat1 = new Date(a[name]);
				var dat2 = new Date(b[name]);
				return dat2 - dat1;
			}
			return b[name] - a[name];
		}
	});
	searchads = searchads.sort(function(a, b) {
		if (order === 'asc') {
			if (
				name === 'Adtitle' ||
				name === 'Advertiser' ||
				name === 'Pricing' ||
				name === 'ro' ||
				name === 'PricingModel' ||
				name === 'Category'
			) {
				var ada = a[name] ? String(a[name]) : null;
				var adb = b[name] ? String(b[name]) : null;
				if (ada === adb) {
					return 0;
				} else if (ada === null) {
					return 1;
				} else if (adb === null) {
					return -1;
				} else {
					return ada < adb ? -1 : 1;
				}
			}
			if (name === 'createdOn' || name === 'startDate' || name === 'endDate') {
				var dat1 = new Date(a[name]);
				var dat2 = new Date(b[name]);
				return dat1 - dat2;
			}
			return a[name] - b[name];
		} else {
			if (
				name === 'Adtitle' ||
				name === 'Advertiser' ||
				name === 'Pricing' ||
				name === 'ro' ||
				name === 'PricingModel' ||
				name === 'Category'
			) {
				var ada = a[name] ? String(a[name]) : null;
				var adb = b[name] ? String(b[name]) : null;
				if (ada === adb) {
					return 0;
				} else if (ada === null) {
					return 1;
				} else if (adb === null) {
					return -1;
				} else {
					return ada < adb ? 1 : -1;
				}
			}
			if (name === 'createdOn' || name === 'startDate' || name === 'endDate') {
				var dat1 = new Date(a[name]);
				var dat2 = new Date(b[name]);
				return dat2 - dat1;
			}
			return b[name] - a[name];
		}
	});
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
