import {
	PUBLISHERDATA_ERROR,
	PUBLISHERDATA_LOADING,
	PUBLISHERDATA_LOADED,
	PUBLISHERDATA_CLEAR,
	PUBLISHERDATA_PAGINATION_AUDIO,
	PUBLISHERDATA_PAGINATION_DISPLAY,
	PUBLISHERDATA_PAGINATION_VIDEO,
	PUBLISHERDATA_SEARCH_AUDIO,
	PUBLISHERDATA_SEARCH_DISPLAY,
	PUBLISHERDATA_SEARCH_VIDEO,
	PUBLISHERDATA_SORT_AUDIO,
	PUBLISHERDATA_SORT_DISPLAY,
	PUBLISHERDATA_SORT_VIDEO
} from '../types.js';
import { tokenConfig } from './authAction.js';

export const PublisherLoading = () => (dispatch, getState) => {
	dispatch({
		type: PUBLISHERDATA_LOADING
	});
};

export const LoadPublisherData = () => (dispatch, getState) => {
	if (tokenConfig(getState).headers.Authorization) {
		fetch(`/subrepo/publisherComplete2`, {
			method: 'get',
			headers: tokenConfig(getState).headers
		})
			.then((res) => res.json())
			.then((result) => {
				// console.log(result);
				var dataA = result.audio;
				dataA.sort(function(a, b) {
					return b.impression - a.impression;
				});
				dataA.map((x) => {
					x.ctr = x.click * 100 / x.impression;
					// x.ltr = (x.complete ? parseInt(x.complete) : 0) * 100 / (x.impression ? parseInt(x.impression) : 0);
					console.log(x.feed);
					x.fede = x.feed === 3 ? 'Podcast' : 'Ondemand and Streaming';
					console.log(x.fede);
					x.feed = x.feed === '3' ? 'Podcast' : x.feed === '' ? 'Ondemand and Streaming' : '';
				});
				var dataD = result.display;
				dataD.sort(function(a, b) {
					return b.impression - a.impression;
				});
				dataD.map((x) => {
					x.ctr = x.click * 100 / x.impression;
					console.log(x.feed);
					x.fede = x.feed === 3 ? 'Podcast' : 'Ondemand and Streaming';
					console.log(x.fede);
					// x.ltr = (x.complete ? parseInt(x.complete) : 0) * 100 / (x.impression ? parseInt(x.impression) : 0);
					x.feed = x.feed === '3' ? 'Podcast' : x.feed === '' ? 'Ondemand and Streaming' : '';
				});
				var dataV = result.video;
				dataV.sort(function(a, b) {
					return b.impression - a.impression;
				});
				dataV.map((x) => {
					x.ctr = x.click * 100 / x.impression;
					console.log(x.feed);
					x.fede = x.feed === 3 ? 'Podcast' : 'Ondemand and Streaming';
					console.log(x.fede);
					// x.ltr = (x.complete ? parseInt(x.complete) : 0) * 100 / (x.impression ? parseInt(x.impression) : 0);
					x.feed = x.feed === '3' ? 'Podcast' : x.feed === '' ? 'Ondemand and Streaming' : '';
				});
				// console.log({ audio: dataA });
				dispatch({
					type: PUBLISHERDATA_LOADED,
					payload: {
						complete: result.complete,
						audio: dataA,
						display: dataD,
						video: dataV
					}
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

const audioS = (pagination, rpp) => (dispatch, getState) => {
	dispatch({
		type: PUBLISHERDATA_PAGINATION_AUDIO,
		payload: {
			pagination: pagination,
			rowspp: rpp
		}
	});
};
const displayS = (pagination, rpp) => (dispatch, getState) => {
	dispatch({
		type: PUBLISHERDATA_PAGINATION_DISPLAY,
		payload: {
			pagination: pagination,
			rowspp: rpp
		}
	});
};
const videoS = (pagination, rpp) => (dispatch, getState) => {
	dispatch({
		type: PUBLISHERDATA_PAGINATION_VIDEO,
		payload: {
			pagination: pagination,
			rowspp: rpp
		}
	});
};
const audioSP = (val) => (dispatch, getState) => {
	var match = [];
	var mads = getState().consoleDateReport.audiopublisherData;
	if (val) {
		mads.map((ads) => {
			if (ads.publisherName.toLowerCase().indexOf(val.toLowerCase()) > -1) {
				match.push(ads);
			}
		});
		console.log(match);
		dispatch({
			type: PUBLISHERDATA_SEARCH_AUDIO,
			payload: {
				ads: match,
				value: val
			}
		});
	} else {
		dispatch({
			type: PUBLISHERDATA_SEARCH_AUDIO,
			payload: {
				ads: mads,
				value: val
			}
		});
	}
};
const displaySP = (val) => (dispatch, getState) => {
	var match = [];
	var mads = getState().consoleDateReport.displaypublisherData;
	if (val) {
		mads.map((ads) => {
			if (ads.publisherName.toLowerCase().indexOf(val.toLowerCase()) > -1) {
				match.push(ads);
			}
		});
		console.log(match);
		dispatch({
			type: PUBLISHERDATA_SEARCH_DISPLAY,
			payload: {
				ads: match,
				value: val
			}
		});
	} else {
		dispatch({
			type: PUBLISHERDATA_SEARCH_DISPLAY,
			payload: {
				ads: mads,
				value: val
			}
		});
	}
};
const videoSP = (val) => (dispatch, getState) => {
	var match = [];
	var mads = getState().consoleDateReport.videopublisherData;
	if (val) {
		mads.map((ads) => {
			if (ads.publisherName.toLowerCase().indexOf(val.toLowerCase()) > -1) {
				match.push(ads);
			}
		});
		console.log(match);
		dispatch({
			type: PUBLISHERDATA_SEARCH_VIDEO,
			payload: {
				ads: match,
				value: val
			}
		});
	} else {
		dispatch({
			type: PUBLISHERDATA_SEARCH_VIDEO,
			payload: {
				ads: mads,
				value: val
			}
		});
	}
};
const audioorderManagerPublisherData = (order, name) => (dispatch, getState) => {
	dispatch({
		type: PUBLISHERDATA_SORT_AUDIO,
		payload: {
			name: name,
			direction: order
		}
	});
};
const displayorderManagerPublisherData = (order, name) => (dispatch, getState) => {
	dispatch({
		type: PUBLISHERDATA_SORT_DISPLAY,
		payload: {
			name: name,
			direction: order
		}
	});
};
const videoorderManagerPublisherData = (order, name) => (dispatch, getState) => {
	dispatch({
		type: PUBLISHERDATA_SORT_VIDEO,
		payload: {
			name: name,
			direction: order
		}
	});
};
export const storepaginationPublisherData = {
	audio: audioS,
	display: displayS,
	video: videoS
};
export const searchPublisherData = {
	audio: audioSP,
	display: displaySP,
	video: videoSP
};
export const orderManagerPublisherData = {
	audio: audioorderManagerPublisherData,
	display: displayorderManagerPublisherData,
	video: videoorderManagerPublisherData
};
