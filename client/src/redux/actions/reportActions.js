import axios from 'axios';
import {
	REPORT_LOADING,
	REPORT_BASE_LOADED,
	REPORT_LOADED,
	REPORT_ERROR,
	REPORT_ID_,
	REPORT_SPENT_LOADED,
	REPORT_CLEAR,
	REPORT_READY
} from '../types.js';
import { tokenConfig } from './authAction.js';

export const idStorer = (id) => (dispatch, getState) => {
	// console.log(id);
	dispatch({
		type: REPORT_ID_,
		payload: id
	});
};

export const ReportLoading = () => (dispatch, getState) => {
	dispatch({
		type: REPORT_LOADING
	});
};

export const loadReportBase = () => (dispatch, getState) => {
	if (tokenConfig(getState).headers.Authorization) {
		const id = getState().report.req_id;
		console.log(id);
		fetch(`/streamingads/groupedsingle`, {
			method: 'put',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + localStorage.getItem('jwt')
			},
			body: JSON.stringify({
				adtitle: id
			})
		})
			.then((res) => res.json())
			.then(async (result) => {
				// settitle(result[0].AdTitle)
				// setloading(false)
				console.log(result);
				dispatch({
					type: REPORT_BASE_LOADED,
					payload: {
						ids: result.ids,
						id: result.id,
						title: result._id,
						startDate: result.startDate[0],
						endDate: result.endDate[0]
					}
				});
				await dispatch(loadSpentData());
				await dispatch(loadReport());
			})
			.catch((err) => {
				// setloading(false)
				console.log(err);
			});
	} else {
		dispatch({
			type: REPORT_ERROR,
			payload: 'login required'
		});
	}
};

export const loadSpentData = () => (dispatch, getState) => {
	const ids = getState().report.combine_ids;
	if (ids) {
		fetch('/subrepo/spentallrepobyid2', {
			method: 'put',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + localStorage.getItem('jwt')
			},
			body: JSON.stringify({
				campaignId: ids
			})
		})
			.then((res) => res.json())
			.then((result) => {
				console.log(result);
				dispatch({
					type: REPORT_SPENT_LOADED,
					payload: result
				});
				// setspentdata(result);
			})
			.catch((err) => console.log(err));
	}
};

export const loadReport = () => (dispatch, getState) => {
	const datast = getState().report;
	// console.log(datast.ids.audio);
	if (datast) {
		fetch('/offreport/sumreportofcamall2', {
			method: 'put',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + localStorage.getItem('jwt')
			},
			body: JSON.stringify({
				campaignId: datast.ids
			})
		})
			.then((res) => res.json())
			.then((result) => {
				console.log(result);
				var data = result;
				var startDate = new Date(datast.startDate);
				var endDate = new Date(datast.endDate);
				var curre = new Date(Date.now());
				var wholeTime = (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24);
				var leftTime =
					curre > endDate ? wholeTime : (curre.getTime() - startDate.getTime()) / (1000 * 3600 * 24);
				data.leftTime = leftTime;
				data.wholeTime = wholeTime;
				var audiospentOffline = 0;
				var displayspentOffline = 0;
				var videospentOffline = 0;
				if (!data.audio) {
					data.audio = [];
				}
				// else {
				// 	data.audio = data.audio.filter((x) => x.impressions > 0);
				// }
				if (!data.display) {
					data.display = [];
				}
				// else {
				// 	data.display = data.display.filter((x) => x.impressions > 0);
				// }
				if (!data.video) {
					data.video = [];
				}
				// else {
				// 	data.video = data.video.filter((x) => x.impressions > 0);
				// }
				data.audio.length &&
					data.audio.map((re) => {
						re.publishername = re.apppubidpo
							? re.apppubidpo.publishername ? re.apppubidpo.publishername : re.PublisherSplit
							: re.PublisherSplit ? re.PublisherSplit : re.Publisher.AppName;
						// re.ssp = re.ssp.length ? re.ssp[0] : re.apppubidpo.length ? re.apppubidpo[0].ssp : null;
						re.target = datast.ids.audimpression;
						re.avgreq = parseInt(re.target) / parseInt(wholeTime);
						re.avgach = parseInt(re.impressions) / parseInt(leftTime);
						re.click = parseInt(re.clicks) + parseInt(re.clicks1);
						re.ctr =
							parseInt(re.click) / parseInt(re.impressions)
								? parseInt(re.click) * 100 / parseInt(re.impressions)
								: 0;
						if (re.apppubidpo && re.apppubidpo[0] && re.apppubidpo[0].ssp === 'offline') {
							// Humgama
							if (re.apppubidpo[0].publishername === 'Hungama') {
								audiospentOffline += parseInt(re.impressions) * 4.25 / 100;
							}
							// Wynk
							if (re.apppubidpo[0].publishername === 'Wynk') {
								audiospentOffline += parseInt(re.impressions) * 10 / 100;
							}
						}
					});
				data.display.length &&
					data.display.map((re) => {
						re.publishername = re.apppubidpo
							? re.apppubidpo.publishername ? re.apppubidpo.publishername : re.PublisherSplit
							: re.PublisherSplit ? re.PublisherSplit : re.Publisher.AppName;
						// re.ssp = re.ssp.length ? re.ssp[0] : re.apppubidpo.length ? re.apppubidpo[0].ssp : null;
						re.target = datast.ids.disimpression;
						re.avgreq = parseInt(re.target) / parseInt(wholeTime);
						re.avgach = parseInt(re.impressions) / parseInt(leftTime);
						re.click = parseInt(re.clicks) + parseInt(re.clicks1);
						re.ctr =
							parseInt(re.click) / parseInt(re.impressions)
								? parseInt(re.click) * 100 / parseInt(re.impressions)
								: 0;
						if (re.apppubidpo && re.apppubidpo[0] && re.apppubidpo[0].ssp === 'offline') {
							// Humgama
							if (re.apppubidpo[0].publishername === 'Hungama') {
								displayspentOffline += parseInt(re.impressions) * 4.25 / 100;
							}
							// Wynk
							if (re.apppubidpo[0].publishername === 'Wynk') {
								displayspentOffline += parseInt(re.impressions) * 10 / 100;
							}
						}
					});
				data.video.length &&
					data.video.map((re) => {
						re.publishername = re.apppubidpo
							? re.apppubidpo.publishername ? re.apppubidpo.publishername : re.PublisherSplit
							: re.PublisherSplit ? re.PublisherSplit : re.Publisher.AppName;
						// re.ssp = re.ssp.length ? re.ssp[0] : re.apppubidpo.length ? re.apppubidpo[0].ssp : null;
						re.target = datast.ids.vidimpression;
						re.avgreq = parseInt(re.target) / parseInt(wholeTime);
						re.avgach = parseInt(re.impressions) / parseInt(leftTime);
						re.click = parseInt(re.clicks) + parseInt(re.clicks1);
						re.ctr =
							parseInt(re.click) / parseInt(re.impressions)
								? parseInt(re.click) * 100 / parseInt(re.impressions)
								: 0;
						if (re.apppubidpo && re.apppubidpo[0] && re.apppubidpo[0].ssp === 'offline') {
							// Humgama
							if (re.apppubidpo[0].publishername === 'Hungama') {
								videospentOffline += parseInt(re.impressions) * 4.25 / 100;
							}
							// Wynk
							if (re.apppubidpo[0].publishername === 'Wynk') {
								videospentOffline += parseInt(re.impressions) * 10 / 100;
							}
						}
					});
				data.audiospentOffline = audiospentOffline;
				data.displayspentOffline = displayspentOffline;
				data.videospentOffline = videospentOffline;
				dispatch({
					type: REPORT_LOADED,
					payload: data
				});
			})
			.catch((err) => {
				console.log(err);
			});
	}
};

export const loadReportBaseBundle = () => (dispatch, getState) => {
	if (tokenConfig(getState).headers.Authorization) {
		const id = getState().report.req_id;
		console.log(id);
		fetch(`/bundles/grp/${id}`, {
			method: 'get',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + localStorage.getItem('jwt')
			}
		})
			.then((res) => res.json())
			.then(async (result) => {
				dispatch({
					type: REPORT_BASE_LOADED,
					payload: {
						ids: result.id_final,
						id: result.ids,
						title: result.bundleadtitle,
						startDate: result.startDate,
						endDate: result.endDate
					}
				});
				await dispatch(loadSpentData());
				await dispatch(loadReport());
				console.log(result);
			})
			.catch((err) => {
				console.log(err);
			});
	}
};

export const ClearReport = () => (dispatch, getState) => {
	dispatch({
		type: REPORT_CLEAR
	});
};

export const ShowReport = () => (dispatch, getState) => {
	dispatch({
		type: REPORT_READY
	});
};
