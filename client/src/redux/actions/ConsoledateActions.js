import { PUBLISHERDATA_ERROR, PUBLISHERDATA_LOADING, PUBLISHERDATA_LOADED, PUBLISHERDATA_CLEAR } from '../types.js';
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
				data.map((x) => {
					x.ctr = x.click * 100 / x.impression;
					x.feed = x.feed === '3' ? 'Podcast' : x.feed === '' ? 'Ondemand and Streaming' : '';
					console.log(x.feed);
				});
				dispatch({
					type: PUBLISHERDATA_LOADED,
					payload: data
				});
			});
	}
};
