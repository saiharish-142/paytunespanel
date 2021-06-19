import {
	PUBLISHERDATA_ERROR,
	PUBLISHERDATA_LOADING,
	PUBLISHERDATA_LOADED,
	PUBLISHERDATA_CLEAR,
	PUBLISHERDATA_SEARCH,
	PUBLISHERDATA_SORT,
	PUBLISHERDATA_PAGINATION
} from '../types.js';
import { tokenConfig } from './authAction.js';

export const PublisherLoading = () => (dispatch, getState) => {
	dispatch({
		type: PUBLISHERDATA_LOADING
	});
};

export const LoadPublisherData = () => (dispatch, getState) => {
	if (tokenConfig(getState).headers.Authorization) {
		fetch(`/subrepo/publisherComplete`, {
			method: 'get',
			headers: tokenConfig(getState).headers
		})
			.then((res) => res.json())
			.then((result) => {
				// console.log(result);
				var data = result;
				data.sort(function(a, b) {
					return b.impression - a.impression;
				});
				data.map((x) => {
					x.ctr = x.click * 100 / x.impression;
					x.feed = x.feed === '3' ? 'Podcast' : x.feed === '' ? 'Ondemand and Streaming' : '';
				});
				dispatch({
					type: PUBLISHERDATA_LOADED,
					payload: data
				});
			})
			.catch((err) => {
				console.log(err);
				dispatch({
					type: PUBLISHERDATA_ERROR
				});
			});
	}
};

export const storepaginationPublisherData = (pagination, rpp) => (dispatch, getState) => {
	dispatch({
		type: PUBLISHERDATA_PAGINATION,
		payload: {
			pagination: pagination,
			rowspp: rpp
		}
	});
};

export const searchPublisherData = (val) => (dispatch, getState) => {
	var match = [];
	var mads = getState().consoleDateReport.publisherData;
	if (val) {
		mads.map((ads) => {
			if (ads.publisherName.toLowerCase().indexOf(val.toLowerCase()) > -1) {
				match.push(ads);
			}
		});
		console.log(match);
		dispatch({
			type: PUBLISHERDATA_SEARCH,
			payload: {
				ads: match,
				value: val
			}
		});
	} else {
		dispatch({
			type: PUBLISHERDATA_SEARCH,
			payload: {
				ads: mads,
				value: val
			}
		});
	}
};

export const orderManagerPublisherData = (order, name) => (dispatch, getState) => {
	dispatch({
		type: PUBLISHERDATA_SORT,
		payload: {
			name: name,
			direction: order
		}
	});
};
