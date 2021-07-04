import { QUARTILE_LOADED, QUARTILE_ERROR } from '../types.js';
import { tokenConfig } from './authAction.js';

export const LoadQuartileData = () => (dispatch, getState) => {
	if (tokenConfig(getState).headers.Authorization) {
		fetch(`/subrepo/publisherComplete2`, {
			method: 'get',
			headers: tokenConfig(getState).headers
		})
			.then((res) => res.json())
			.then((result) => {
				console.log(result);
				var dataAC = result.audio;
				dataAC.map((x) => {
					x.ltr = (x.complete ? parseInt(x.complete) : 0) * 100 / (x.impression ? parseInt(x.impression) : 0);
				});
				console.log(dataAC);
				var dataVC = result.video;
				dataVC.map((x) => {
					x.ltr = (x.complete ? parseInt(x.complete) : 0) * 100 / (x.impression ? parseInt(x.impression) : 0);
				});
				console.log(dataVC);
				dispatch({
					type: QUARTILE_LOADED,
					payload: {
						caudio: dataAC,
						cvideo: dataVC
					}
				});
			})
			.catch((err) => {
				console.log(err);
				dispatch({
					type: QUARTILE_ERROR
				});
			});
	}
};

export const LTRLoad = () => (dispatch, getState) => {
	var data = getState().quartile.quartileaudiopublisherData;
	var data2 = getState().quartile.quartilevideopublisherData;
	// data.map((x) => {
	// 	x.tr = 'sau';
	// 	var ltr = parseInt(x.complete) * 100 / parseInt(x.impression);
	// 	// console.log(ltr);
	// 	x.ltr = ltr;
	// 	return x;
	// });
	for (let index = 0; index < data.length; index++) {
		data[index].lt = parseInt(data[index].complete) * 100 / parseInt(data[index].impression);
		data[index].ltr = parseInt(data[index].complete) * 100 / parseInt(data[index].impression);
	}
	data.map((x) => {
		console.log(x.ltr);
	});
	console.log(data);
	data2.map((x) => {
		x.ltr = (x.complete ? parseInt(x.complete) : 0) * 100 / (x.impression ? parseInt(x.impression) : 0);
	});
	console.log(data, data2);
	dispatch({
		type: QUARTILE_LOADED,
		payload: {
			caudio: data,
			cvideo: data2
		}
	});
};
