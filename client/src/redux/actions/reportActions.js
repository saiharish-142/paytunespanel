import {
	REPORT_LOADING,
	REPORT_BASE_LOADED,
	REPORT_LOADED,
	REPORT_LOADED_CLIENT,
	REPORT_BASE_LOADED_CLIENT,
	REPORT_ERROR,
	REPORT_ID_,
	REPORT_SPENT_LOADED,
	REPORT_CLEAR,
	REPORT_LOADING_SUMMDET,
	REPORT_LOADED_SUMMDET,
	REPORT_ERROR_SUMMDET,
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
						re.target = re.targetimpre;
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

export const ClientReport = () => async (dispatch, getState) => {
	const data = getState().report.data;
	const data2 = getState().report.ids;
	// console.log(data2);
	var dass = [];
	var puller = {};
	var pullerData = {};
	pullerData['complete'] = {
		target: 0,
		clicks: 0,
		clicks1: 0,
		complete: 0,
		firstQuartile: 0,
		impressions: 0,
		midpoint: 0,
		ltr: 0,
		start: 0,
		thirdQuartile: 0,
		updatedAt: []
	};
	if (data.audio) {
		dass.push(data.audio);
		if (puller[data.audio]) {
			data2.audio.map((x) => puller[data.audio].push(x));
			puller[`${data.audio}target`] += data2.audimpression;
			pullerData[`complete`].target += data2.audimpression;
		} else {
			puller[data.audio] = [];
			puller[`${data.audio}target`] = 0;
			puller[`${data.audio}target`] += data2.audimpression;
			pullerData[`complete`].target += data2.audimpression;
			data2.audio.map((x) => puller[data.audio].push(x));
		}
	}
	if (!(data.onDemand === data.podcast && data.onDemand === data.musicapps)) {
		if (data.onDemand) {
			dass.push(data.onDemand);
			if (puller[data.onDemand]) {
				data2.onDemand.map((x) => puller[data.onDemand].push(x));
				pullerData[`complete`].target += data2.subimpression.dem;
				puller[`${data.onDemand}target`] += data2.subimpression.dem;
			} else {
				puller[data.onDemand] = [];
				puller[`${data.onDemand}target`] = 0;
				pullerData[`complete`].target += data2.subimpression.dem;
				puller[`${data.onDemand}target`] += data2.subimpression.dem;
				data2.onDemand.map((x) => puller[data.onDemand].push(x));
			}
		}
		if (data.podcast) {
			dass.push(data.podcast);
			if (puller[data.podcast]) {
				data2.podcast.map((x) => puller[data.podcast].push(x));
				pullerData[`complete`].target += data2.subimpression.pod;
				puller[`${data.podcast}target`] += data2.subimpression.pod;
			} else {
				puller[data.podcast] = [];
				puller[`${data.podcast}target`] = 0;
				pullerData[`complete`].target += data2.subimpression.pod;
				puller[`${data.podcast}target`] += data2.subimpression.pod;
				data2.podcast.map((x) => puller[data.podcast].push(x));
			}
		}
		if (data.musicapps) {
			dass.push(data.musicapps);
			if (puller[data.musicapps]) {
				data2.musicapps.map((x) => puller[data.musicapps].push(x));
				pullerData[`complete`].target += data2.subimpression.mus;
				puller[`${data.musicapps}target`] += data2.subimpression.mus;
			} else {
				puller[data.musicapps] = [];
				puller[`${data.musicapps}target`] = 0;
				pullerData[`complete`].target += data2.subimpression.mus;
				puller[`${data.musicapps}target`] += data2.subimpression.mus;
				data2.musicapps.map((x) => puller[data.musicapps].push(x));
			}
		}
	}
	if (data.display) {
		dass.push(data.display);
		if (puller[data.display]) {
			data2.display.map((x) => puller[data.display].push(x));
			pullerData[`complete`].target += data2.disimpression;
			puller[`${data.display}target`] += data2.disimpression;
		} else {
			puller[data.display] = [];
			puller[`${data.display}target`] = 0;
			pullerData[`complete`].target += data2.disimpression;
			puller[`${data.display}target`] += data2.disimpression;
			data2.display.map((x) => puller[data.display].push(x));
		}
	}
	if (data.video) {
		dass.push(data.video);
		if (puller[data.video]) {
			data2.video.map((x) => puller[data.video].push(x));
			pullerData[`complete`].target += data2.vidimpression;
			puller[`${data.video}target`] += data2.vidimpression;
		} else {
			puller[data.video] = [];
			puller[`${data.video}target`] = 0;
			puller[`${data.video}target`] += data2.vidimpression;
			pullerData[`complete`].target += data2.vidimpression;
			data2.video.map((x) => puller[data.video].push(x));
		}
	}
	dass = [ ...new Set(dass) ];
	for (var i = 0; i < dass.length; i++) {
		await fetch('/offreport/sumreportofcamallClient', {
			method: 'put',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + localStorage.getItem('jwt')
			},
			body: JSON.stringify({
				campaignId: puller[dass[i]]
			})
		})
			.then((res) => res.json())
			.then((resu) => {
				var result = resu;
				// console.log(result);
				pullerData[dass[i]] = result;
				if (result.message) {
				} else {
					pullerData['complete'].clicks += result.clicks ? result.clicks : 0;
					pullerData['complete'].clicks1 += result.clicks1 ? result.clicks1 : 0;
					pullerData['complete'].impressions += result.impressions ? result.impressions : 0;
					pullerData['complete'].start += result.start ? result.start : 0;
					pullerData['complete'].firstQuartile += result.firstQuartile ? result.firstQuartile : 0;
					pullerData['complete'].midpoint += result.midpoint ? result.midpoint : 0;
					pullerData['complete'].thirdQuartile += result.thirdQuartile ? result.thirdQuartile : 0;
					pullerData['complete'].complete += result.complete ? result.complete : 0;
					pullerData['complete'].updatedAt.push(result.updatedAt);
				}
				// return result;
			})
			.catch((err) => {
				dispatch({ type: REPORT_ERROR });
				console.log(err);
			});
	}
	pullerData.complete.updatedAt.sort(function(a, b) {
		return new Date(b) - new Date(a);
	});
	pullerData.complete.updatedAt = pullerData.complete.updatedAt[0];
	pullerData.complete.midpoint =
		pullerData.complete.midpoint / pullerData.complete.firstQuartile * pullerData.complete.impressions;
	pullerData.complete.thirdQuartile =
		pullerData.complete.thirdQuartile / pullerData.complete.firstQuartile * pullerData.complete.impressions;
	pullerData.complete.complete =
		pullerData.complete.complete / pullerData.complete.firstQuartile * pullerData.complete.impressions;
	pullerData.complete.firstQuartile =
		pullerData.complete.firstQuartile / pullerData.complete.firstQuartile * pullerData.complete.impressions;
	pullerData.complete.ltr = pullerData.complete.complete / pullerData.complete.firstQuartile;
	pullerData.complete.midpoint = Math.round(pullerData.complete.midpoint);
	pullerData.complete.thirdQuartile = Math.round(pullerData.complete.thirdQuartile);
	pullerData.complete.complete = Math.round(pullerData.complete.complete);
	console.log(dass, puller, pullerData);
	dispatch({
		type: REPORT_LOADED_CLIENT,
		payload: {
			mains: dass,
			ids: puller,
			report: pullerData
		}
	});
	// for (const [ y, z ] of Object.entries(data)) {
	// 	console.log(y, z);
	// 	if (
	// 		(y === 'audio' ||
	// 			y === 'display' ||
	// 			y === 'video' ||
	// 			y === 'onDemand' ||
	// 			y === 'podcast' ||
	// 			y === 'musicapps') &&
	// 		z != null
	// 	) {
	// 		dass.push(z);
	// 	}
	// }
	// dass = [ ...new Set(dass) ];
	// console.log(dass);
	// var i = 1;
	// dass.map((x) => {
	// 	puller[`title${i}`] = x;
	// 	i++;
	// 	console.log(puller);
	// });
	// for(const [y,z]of Object.entries(puller)){
	// 	if(data.audio === z){
	// 		//
	// 	}
	// }
};

export const clientReportBase = () => async (dispatch, getState) => {
	if (tokenConfig(getState).headers.Authorization) {
		const data = getState().report.req_id;
		// console.log(data);
		fetch(`/auth/campdetails/${data}`, {
			method: 'get',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + localStorage.getItem('jwt')
			}
		})
			.then((res) => res.json())
			.then((result) => {
				console.log(result);
				if (result.type === 'campaign') {
					fetch('/streamingads/groupedsingleClient', {
						method: 'put',
						headers: {
							'Content-Type': 'application/json',
							Authorization: 'Bearer ' + localStorage.getItem('jwt')
						},
						body: JSON.stringify({
							adtitle: result.campaignName,
							podcast: result.podcast,
							onDemand: result.onDemand,
							musicapps: result.musicapps
						})
					})
						.then((res) => res.json())
						.then((reso) => {
							console.log(reso);
							console.log(result);
							dispatch({
								type: REPORT_BASE_LOADED_CLIENT,
								payload: {
									main: result,
									ids: reso.ids,
									id: reso.id,
									title: result.campaignName,
									startDate: result.startDate,
									endDate: result.endDate
								}
							});
							dispatch(ClientReport());
						})
						.catch((err) => {
							console.log(err);
							dispatch({ type: REPORT_ERROR });
						});
				} else {
					fetch('/streamingads/groupedbundleClient', {
						method: 'put',
						headers: {
							'Content-Type': 'application/json',
							Authorization: 'Bearer ' + localStorage.getItem('jwt')
						},
						body: JSON.stringify({
							id: result.campaignName,
							podcast: result.podcast,
							onDemand: result.onDemand,
							musicapps: result.musicapps
						})
					})
						.then((res) => res.json())
						.then((reso) => {
							console.log(reso);
							console.log(result);
							dispatch({
								type: REPORT_BASE_LOADED_CLIENT,
								payload: {
									main: result,
									ids: reso.ids,
									id: reso.id,
									title: result.campaignName,
									startDate: result.startDate,
									endDate: result.endDate
								}
							});
							dispatch(ClientReport());
						})
						.catch((err) => {
							console.log(err);
							dispatch({ type: REPORT_ERROR });
						});
				}
			})
			.catch((err) => {
				console.log(err);
				dispatch({ type: REPORT_ERROR });
			});
		// console.log(base);
	}
};

export const ClientSummDet = () => async (dispatch, getState) => {
	const repo = getState().report;
	const repo2 = getState().report.sets;
	console.log(repo);
	console.log(repo2);
	console.log('repo');
	var sol = {};
	try {
		if (repo2 && repo2.length) {
			console.log('repo2');
			for (var i = 0; i < repo2.length; i++) {
				console.log(repo2[i]);
				if (repo.sets[i].toLowerCase() != 'unselected') {
					await fetch('/offreport/detreportcambydat', {
						method: 'put',
						headers: {
							'Content-Type': 'application/json',
							Authorization: 'Bearer ' + localStorage.getItem('jwt')
						},
						body: JSON.stringify({
							campaignId: repo.grp_ids[repo.sets[i]]
						})
					})
						.then((res) => res.json())
						.then((result) => {
							var dlogs = result;
							// console.log(result,'re')
							// dlogs = dlogs.concat(logs)
							// dlogs = dlogs.filter((x) => x.impressions > 0);
							dlogs = dlogs.sort(function(a, b) {
								var d1 = new Date(a.date);
								var d2 = new Date(b.date);
								return d2 - d1;
							});
							dlogs = dlogs.sort(function(a, b) {
								var d1 = new Date(a.updatedAt[0]);
								var d2 = new Date(b.updatedAt[0]);
								if (a.date === b.date) return d2 - d1;
							});
							console.log(dlogs);
							sol[repo.sets[i]] = dlogs;
						});
				}
			}
			console.log(sol, 'sol');
			dispatch({
				type: REPORT_LOADED_SUMMDET,
				payload: sol
			});
		} else {
			dispatch({
				type: REPORT_ERROR_SUMMDET
			});
		}
	} catch (e) {
		console.log(e);
	}
};

// async function Puller(ids) {
// 	var data;
// 	fetch('/offreport/sumreportofcamallClient', {
// 		method: 'put',
// 		headers: {
// 			'Content-Type': 'application/json',
// 			Authorization: 'Bearer ' + localStorage.getItem('jwt')
// 		},
// 		body: JSON.stringify({
// 			campaignId: ids
// 		})
// 	})
// 		.then((res) => res.json())
// 		.then((resu) => {
// 			var result = resu;
// 			data = resu;
// 			console.log(result);
// 			// return result;
// 		})
// 		.catch((err) => console.log(err));
// 	// const result = await data.json();
// 	return data;
// }
