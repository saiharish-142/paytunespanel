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

var wynkids = [ '11726', '5b2210af504f3097e73e0d8b', 'com.bsbportal.music', '845083955' ];
var hungamaids = [ '5d10c405844dd970bf41e2af' ];

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
		fetch(`/streamingads/groupedsingleClient`, {
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
				var ids = result.ids;
				// if (ids.podcast && ids.podcast.length) {
				// 	// var ids = [];
				// 	// ids.onDemand && ids.onDemand.map((x) => ids.push(x));
				// 	// ids.musicapps && ids.musicapps.map((x) => ids.push(x));
				// 	// console.log(ids);
				// 	// ids.audio = ids.audio.filter((x) => !ids.podcast.includes(x));
				// 	// ids.audimpression = ids.subimpression.mus + ids.subimpression.dem;
				// }
				console.log(result, ids);
				dispatch({
					type: REPORT_BASE_LOADED,
					payload: {
						ids: ids,
						id: result.id,
						title: id,
						startDate: result.startDate,
						endDate: result.endDate
					}
				});
				await dispatch(loadSpentData());
				await dispatch(loadReportDiv());
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
	// console.log(datast.ids);
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
				var audiouniquePublisher = 0;
				var displayuniquePublisher = 0;
				var videouniquePublisher = 0;
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
						audiouniquePublisher += parseInt(re.unique);
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
						displayuniquePublisher += parseInt(re.unique);
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
						videouniquePublisher += parseInt(re.unique);
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
				data.audiouniquePublisher = audiouniquePublisher;
				data.displayuniquePublisher = displayuniquePublisher;
				data.videouniquePublisher = videouniquePublisher;
				// console.log('bhag');
				// console.log(audiouniquePublisher);
				// console.log(displayuniquePublisher);
				// console.log(videouniquePublisher);
				console.log(data);
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

export const loadReportDiv = () => async (dispatch, getState) => {
	const datast = getState().report;
	const usinrst = getState().ratio.ratio;
	var usinr = usinrst ? usinrst : 74.94715;
	console.log(datast);
	var tags = [ 'audio', 'display', 'video' ];
	var data = {};
	data.startDate = datast.startDate;
	data.endDate = datast.endDate;
	var summarydata = {};
	var recentdate = [];
	var startDate = new Date(datast.startDate);
	var endDate = new Date(datast.endDate);
	var curre = new Date(Date.now());
	var wholeTime = (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24);
	var leftTime = curre > endDate ? wholeTime : (curre.getTime() - startDate.getTime()) / (1000 * 3600 * 24);
	data.leftTime = Math.ceil(leftTime);
	data.wholeTime = wholeTime;
	var wholereportsum = {
		pubunique: 0,
		impressions: 0,
		clicks: 0,
		target: 0,
		start: 0,
		firstQuartile: 0,
		midpoint: 0,
		thirdQuartile: 0,
		complete: 0,
		unique: 0,
		spent: 0,
		avefreq: 0,
		uniqueValue: 0,
		spentValue: 0,
		ctr: 0,
		ltr: 0,
		avgreq: 0,
		avgach: 0,
		balance: 0
	};
	for (var i = 0; i < tags.length; i++) {
		if (datast.ids[tags[i]] && datast.ids[tags[i]].length) {
			console.log(tags[i]);
			await fetch('/offreport/sumreportofcamDiv', {
				method: 'put',
				headers: {
					'Content-Type': 'application/json',
					Authorization: 'Bearer ' + localStorage.getItem('jwt')
				},
				body: JSON.stringify({
					campaignId: datast.ids[tags[i]],
					tag: tags[i]
				})
			})
				.then((res) => res.json())
				.then((result) => {
					// console.log(result);
					if (tags[i] === 'audio') {
						var data2 = result;
						var pubuniquepod = 0;
						data2.data.podcastResult.map((re) => {
							re.publishername = re.apppubidpo
								? re.apppubidpo.publishername ? re.apppubidpo.publishername : re.PublisherSplit
								: re.PublisherSplit ? re.PublisherSplit : re.Publisher.AppName;
							re.target = re.targetimpre;
							re.click = parseInt(re.clicks) + parseInt(re.clicks1);
							re.ctr = (parseInt(re.clicks) + parseInt(re.clicks1)) * 100 / re.impressions;
							// wholereportsum.impressions += parseInt(re.impressions);
							// wholereportsum.clicks += re.click;
							re.unique = re.uniqueData;
							console.log(re.uniqueData);
							pubuniquepod += parseInt(re.uniqueData);
							re.avgreq = parseInt(re.target) / parseInt(wholeTime);
							re.avgach = parseInt(re.impressions) / parseInt(leftTime);
							if (re.apppubidpo && re.apppubidpo.ssp === 'offline') {
								// Humgama
								if (hungamaids.includes(re.apppubidpo.publisherid)) {
									re.spent = parseInt(re.impressions) * 4.25 / (usinr * 100);
									data.summary.spentValue += parseInt(re.impressions) * 4.25 / (usinr * 100);
									console.log(re.spent);
								}
								// Wynk
								if (wynkids.includes(re.apppubidpo.publisherid)) {
									re.spent = parseInt(re.impressions) * 10 / (usinr * 100);
									data.summary.spentValue += parseInt(re.impressions) * 10 / (usinr * 100);
									console.log(re.spent);
								}
								// wholereportsum.spent += re.spent ? parseFloat(re.spent) : 0;
								// wholereportsum.spent += re.unqiueData ? parseFloat(re.unqiueData) : 0;
							}
							// console.log(re.uniqueData);
						});
						wholereportsum.target += parseInt(data2.summary.podcastReport.target);
						wholereportsum.impressions += data2.summary.podcastReport.impressions;
						wholereportsum.clicks += data2.summary.podcastReport.clicks;
						wholereportsum.start += data2.summary.podcastReport.start;
						wholereportsum.firstQuartile += data2.summary.podcastReport.firstQuartile;
						wholereportsum.midpoint += data2.summary.podcastReport.midpoint;
						wholereportsum.thirdQuartile += data2.summary.podcastReport.thirdQuartile;
						wholereportsum.complete += data2.summary.podcastReport.complete;
						wholereportsum.pubunique += parseInt(pubuniquepod);
						wholereportsum.uniqueValue += parseInt(data2.summary.podcastReport.uniqueValue);
						wholereportsum.spentValue += parseFloat(data2.summary.podcastReport.spentValue);
						data2.summary.podcastReport.pubunique = pubuniquepod;
						console.log(tags[i]);
						data[`podcast`] = data2.data.podcastResult;
						data[`podcastCompleteReport`] = data2.summary.podcastReport;
						summarydata[tags[i]] = data2.summary.podcastReport;
						var pubuniquemus = 0;
						data2.data.musicappsResult.map((re) => {
							re.publishername = re.apppubidpo
								? re.apppubidpo.publishername ? re.apppubidpo.publishername : re.PublisherSplit
								: re.PublisherSplit ? re.PublisherSplit : re.Publisher.AppName;
							re.target = re.targetimpre;
							re.click = parseInt(re.clicks) + parseInt(re.clicks1);
							re.ctr = (parseInt(re.clicks) + parseInt(re.clicks1)) * 100 / re.impressions;
							// wholereportsum.impressions += parseInt(re.impressions);
							// wholereportsum.clicks += re.click;
							re.unique = re.uniqueData;
							console.log(re.uniqueData);
							pubuniquemus += parseInt(re.uniqueData);
							re.avgreq = parseInt(re.target) / parseInt(wholeTime);
							re.avgach = parseInt(re.impressions) / parseInt(leftTime);
							if (re.apppubidpo && re.apppubidpo.ssp === 'offline') {
								// Humgama
								if (hungamaids.includes(re.apppubidpo.publisherid)) {
									re.spent = parseInt(re.impressions) * 4.25 / (usinr * 100);
									data.summary.spentValue += parseInt(re.impressions) * 4.25 / (usinr * 100);
									console.log(re.spent);
								}
								// Wynk
								if (wynkids.includes(re.apppubidpo.publisherid)) {
									re.spent = parseInt(re.impressions) * 10 / (usinr * 100);
									data.summary.spentValue += parseInt(re.impressions) * 10 / (usinr * 100);
									console.log(re.spent);
								}
								// wholereportsum.spent += re.spent ? parseFloat(re.spent) : 0;
								// wholereportsum.spent += re.unqiueData ? parseFloat(re.unqiueData) : 0;
							}
							// console.log(re.uniqueData);
						});
						wholereportsum.target += parseInt(data2.summary.musicappsReport.target);
						wholereportsum.impressions += data2.summary.musicappsReport.impressions;
						wholereportsum.clicks += data2.summary.musicappsReport.clicks;
						wholereportsum.start += data2.summary.musicappsReport.start;
						wholereportsum.firstQuartile += data2.summary.musicappsReport.firstQuartile;
						wholereportsum.midpoint += data2.summary.musicappsReport.midpoint;
						wholereportsum.thirdQuartile += data2.summary.musicappsReport.thirdQuartile;
						wholereportsum.complete += data2.summary.musicappsReport.complete;
						wholereportsum.pubunique += parseInt(pubuniquemus);
						wholereportsum.uniqueValue += parseInt(data2.summary.musicappsReport.uniqueValue);
						wholereportsum.spentValue += parseFloat(data2.summary.musicappsReport.spentValue);
						data2.summary.musicappsReport.pubunique = pubuniquemus;
						console.log(tags[i]);
						data[`music`] = data2.data.musicappsResult;
						data[`musicCompleteReport`] = data2.summary.musicappsReport;
						summarydata[tags[i]] = data2.summary.musicappsReport;
						recentdate.push(data2.allrecentupdate);
					} else {
						var data2 = result;
						var pubunique = 0;
						data2.data.map((re) => {
							re.publishername = re.apppubidpo
								? re.apppubidpo.publishername ? re.apppubidpo.publishername : re.PublisherSplit
								: re.PublisherSplit ? re.PublisherSplit : re.Publisher.AppName;
							re.target = re.targetimpre;
							re.click = parseInt(re.clicks) + parseInt(re.clicks1);
							re.ctr = (parseInt(re.clicks) + parseInt(re.clicks1)) * 100 / re.impressions;
							// wholereportsum.impressions += parseInt(re.impressions);
							// wholereportsum.clicks += re.click;
							re.unique = re.uniqueData;
							console.log(re.uniqueData);
							pubunique += parseInt(re.uniqueData);
							re.avgreq = parseInt(re.target) / parseInt(wholeTime);
							re.avgach = parseInt(re.impressions) / parseInt(leftTime);
							if (re.apppubidpo && re.apppubidpo.ssp === 'offline') {
								// Humgama
								if (hungamaids.includes(re.apppubidpo.publisherid)) {
									re.spent = parseInt(re.impressions) * 4.25 / (usinr * 100);
									data.summary.spentValue += parseInt(re.impressions) * 4.25 / (usinr * 100);
									console.log(re.spent);
								}
								// Wynk
								if (wynkids.includes(re.apppubidpo.publisherid)) {
									re.spent = parseInt(re.impressions) * 10 / (usinr * 100);
									data.summary.spentValue += parseInt(re.impressions) * 10 / (usinr * 100);
									console.log(re.spent);
								}
								// wholereportsum.spent += re.spent ? parseFloat(re.spent) : 0;
								// wholereportsum.spent += re.unqiueData ? parseFloat(re.unqiueData) : 0;
							}
							// console.log(re.uniqueData);
						});
						wholereportsum.target += parseInt(data2.summary.target);
						wholereportsum.impressions += data2.summary.impressions;
						wholereportsum.clicks += data2.summary.clicks;
						wholereportsum.start += data2.summary.start;
						wholereportsum.firstQuartile += data2.summary.firstQuartile;
						wholereportsum.midpoint += data2.summary.midpoint;
						wholereportsum.thirdQuartile += data2.summary.thirdQuartile;
						wholereportsum.complete += data2.summary.complete;
						wholereportsum.pubunique += parseInt(pubunique);
						wholereportsum.uniqueValue += parseInt(data2.summary.uniqueValue);
						wholereportsum.spentValue += parseFloat(data2.summary.spentValue);
						data2.summary.pubunique = pubunique;
						console.log(tags[i]);
						data[`${tags[i]}`] = data2.data;
						data[`${tags[i]}CompleteReport`] = data2.summary;
						summarydata[tags[i]] = data2.summary;
						recentdate.push(data2.allrecentupdate);
					}
					// console.log(data2);
				})
				.catch((err) => console.log(err));
		}
	}
	wholereportsum.avgreq = parseInt(wholereportsum.target) / parseInt(wholeTime);
	wholereportsum.avgach = parseInt(wholereportsum.impressions) / parseInt(leftTime);
	wholereportsum.balance = parseInt(wholereportsum.target) - parseInt(wholereportsum.impressions);
	wholereportsum.ctr = parseInt(wholereportsum.clicks) * 100 / parseInt(wholereportsum.impressions);
	wholereportsum.avefreq = parseInt(wholereportsum.impressions) / parseInt(wholereportsum.uniqueValue);
	if (wholereportsum.complete) {
		wholereportsum.ltr = parseInt(wholereportsum.complete) * 100 / parseInt(wholereportsum.impressions);
	}
	data['summaryCompleteReport'] = wholereportsum;
	recentdate = recentdate.sort(function(b, a) {
		return new Date(a) - new Date(b);
	});
	data['allrecentupdate'] = recentdate[0];
	console.log(data, summarydata, recentdate);
	dispatch({
		type: REPORT_LOADED,
		payload: data
	});
	// if (datast) {
	// 	fetch('/offreport/sumreportofcamall2', {
	// 		method: 'put',
	// 		headers: {
	// 			'Content-Type': 'application/json',
	// 			Authorization: 'Bearer ' + localStorage.getItem('jwt')
	// 		},
	// 		body: JSON.stringify({
	// 			campaignId: datast.ids
	// 		})
	// 	})
	// 		.then((res) => res.json())
	// 		.then((result) => {
	// 			console.log(result);
	// 			var data = result;
	// 			var startDate = new Date(datast.startDate);
	// 			var endDate = new Date(datast.endDate);
	// 			var curre = new Date(Date.now());
	// 			var wholeTime = (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24);
	// 			var leftTime =
	// 				curre > endDate ? wholeTime : (curre.getTime() - startDate.getTime()) / (1000 * 3600 * 24);
	// 			data.leftTime = leftTime;
	// 			data.wholeTime = wholeTime;
	// 			var audiospentOffline = 0;
	// 			var displayspentOffline = 0;
	// 			var videospentOffline = 0;
	// 			var audiouniquePublisher = 0;
	// 			var displayuniquePublisher = 0;
	// 			var videouniquePublisher = 0;
	// 			if (!data.audio) {
	// 				data.audio = [];
	// 			}
	// 			// else {
	// 			// 	data.audio = data.audio.filter((x) => x.impressions > 0);
	// 			// }
	// 			if (!data.display) {
	// 				data.display = [];
	// 			}
	// 			// else {
	// 			// 	data.display = data.display.filter((x) => x.impressions > 0);
	// 			// }
	// 			if (!data.video) {
	// 				data.video = [];
	// 			}
	// 			// else {
	// 			// 	data.video = data.video.filter((x) => x.impressions > 0);
	// 			// }
	// 			data.audio.length &&
	// 				data.audio.map((re) => {
	// 					re.publishername = re.apppubidpo
	// 						? re.apppubidpo.publishername ? re.apppubidpo.publishername : re.PublisherSplit
	// 						: re.PublisherSplit ? re.PublisherSplit : re.Publisher.AppName;
	// 					// re.ssp = re.ssp.length ? re.ssp[0] : re.apppubidpo.length ? re.apppubidpo[0].ssp : null;
	// 					re.target = re.targetimpre;
	// 					audiouniquePublisher += parseInt(re.unique);
	// 					re.avgreq = parseInt(re.target) / parseInt(wholeTime);
	// 					re.avgach = parseInt(re.impressions) / parseInt(leftTime);
	// 					re.click = parseInt(re.clicks) + parseInt(re.clicks1);
	// 					re.ctr =
	// 						parseInt(re.click) / parseInt(re.impressions)
	// 							? parseInt(re.click) * 100 / parseInt(re.impressions)
	// 							: 0;
	// 					if (re.apppubidpo && re.apppubidpo[0] && re.apppubidpo[0].ssp === 'offline') {
	// 						// Humgama
	// 						if (re.apppubidpo[0].publishername === 'Hungama') {
	// 							audiospentOffline += parseInt(re.impressions) * 4.25 / 100;
	// 						}
	// 						// Wynk
	// 						if (re.apppubidpo[0].publishername === 'Wynk') {
	// 							audiospentOffline += parseInt(re.impressions) * 10 / 100;
	// 						}
	// 					}
	// 				});
	// 			data.display.length &&
	// 				data.display.map((re) => {
	// 					re.publishername = re.apppubidpo
	// 						? re.apppubidpo.publishername ? re.apppubidpo.publishername : re.PublisherSplit
	// 						: re.PublisherSplit ? re.PublisherSplit : re.Publisher.AppName;
	// 					// re.ssp = re.ssp.length ? re.ssp[0] : re.apppubidpo.length ? re.apppubidpo[0].ssp : null;
	// 					displayuniquePublisher += parseInt(re.unique);
	// 					re.target = datast.ids.disimpression;
	// 					re.avgreq = parseInt(re.target) / parseInt(wholeTime);
	// 					re.avgach = parseInt(re.impressions) / parseInt(leftTime);
	// 					re.click = parseInt(re.clicks) + parseInt(re.clicks1);
	// 					re.ctr =
	// 						parseInt(re.click) / parseInt(re.impressions)
	// 							? parseInt(re.click) * 100 / parseInt(re.impressions)
	// 							: 0;
	// 					if (re.apppubidpo && re.apppubidpo[0] && re.apppubidpo[0].ssp === 'offline') {
	// 						// Humgama
	// 						if (re.apppubidpo[0].publishername === 'Hungama') {
	// 							displayspentOffline += parseInt(re.impressions) * 4.25 / 100;
	// 						}
	// 						// Wynk
	// 						if (re.apppubidpo[0].publishername === 'Wynk') {
	// 							displayspentOffline += parseInt(re.impressions) * 10 / 100;
	// 						}
	// 					}
	// 				});
	// 			data.video.length &&
	// 				data.video.map((re) => {
	// 					re.publishername = re.apppubidpo
	// 						? re.apppubidpo.publishername ? re.apppubidpo.publishername : re.PublisherSplit
	// 						: re.PublisherSplit ? re.PublisherSplit : re.Publisher.AppName;
	// 					// re.ssp = re.ssp.length ? re.ssp[0] : re.apppubidpo.length ? re.apppubidpo[0].ssp : null;
	// 					re.target = datast.ids.vidimpression;
	// 					videouniquePublisher += parseInt(re.unique);
	// 					re.avgreq = parseInt(re.target) / parseInt(wholeTime);
	// 					re.avgach = parseInt(re.impressions) / parseInt(leftTime);
	// 					re.click = parseInt(re.clicks) + parseInt(re.clicks1);
	// 					re.ctr =
	// 						parseInt(re.click) / parseInt(re.impressions)
	// 							? parseInt(re.click) * 100 / parseInt(re.impressions)
	// 							: 0;
	// 					if (re.apppubidpo && re.apppubidpo[0] && re.apppubidpo[0].ssp === 'offline') {
	// 						// Humgama
	// 						if (re.apppubidpo[0].publishername === 'Hungama') {
	// 							videospentOffline += parseInt(re.impressions) * 4.25 / 100;
	// 						}
	// 						// Wynk
	// 						if (re.apppubidpo[0].publishername === 'Wynk') {
	// 							videospentOffline += parseInt(re.impressions) * 10 / 100;
	// 						}
	// 					}
	// 				});
	// 			data.audiospentOffline = audiospentOffline;
	// 			data.displayspentOffline = displayspentOffline;
	// 			data.videospentOffline = videospentOffline;
	// 			data.audiouniquePublisher = audiouniquePublisher;
	// 			data.displayuniquePublisher = displayuniquePublisher;
	// 			data.videouniquePublisher = videouniquePublisher;
	// 			// console.log('bhag');
	// 			// console.log(audiouniquePublisher);
	// 			// console.log(displayuniquePublisher);
	// 			// console.log(videouniquePublisher);
	// 			dispatch({
	// 				type: REPORT_LOADED,
	// 				payload: data
	// 			});
	// 		})
	// 		.catch((err) => {
	// 			console.log(err);
	// 		});
	// }
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
	console.log(data2);
	var dass = [];
	var puller = {};
	var pullerCate = {};
	var pullerData = {};
	pullerData['complete'] = {
		target: 0,
		clicks: 0,
		clicks1: 0,
		complete: 0,
		firstQuartile: 0,
		impressions: 0,
		onlineImpressions: 0,
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
			data2.audio.map((x) => pullerCate[data.audio].push(x));
			puller[`${data.audio}target`] += data2.audimpression;
			pullerData[`complete`].target += data2.audimpression;
		} else {
			puller[data.audio] = [];
			pullerCate[data.audio] = [];
			puller[`${data.audio}target`] = 0;
			puller[`${data.audio}target`] += data2.audimpression;
			pullerData[`complete`].target += data2.audimpression;
			data2.audio.map((x) => puller[data.audio].push(x));
			data2.audio.map((x) => pullerCate[data.audio].push(x));
		}
	}
	if (!(data.onDemand === data.podcast && data.onDemand === data.musicapps)) {
		if (data.onDemand) {
			dass.push(data.onDemand);
			if (puller[data.onDemand]) {
				data2.onDemand.map((x) => puller[data.onDemand].push(x));
				data2.onDemand.map((x) => pullerCate[data.onDemand].push(x));
				pullerData[`complete`].target += data2.subimpression.dem;
				puller[`${data.onDemand}target`] += data2.subimpression.dem;
			} else {
				puller[data.onDemand] = [];
				pullerCate[data.onDemand] = [];
				puller[`${data.onDemand}target`] = 0;
				pullerData[`complete`].target += data2.subimpression.dem;
				puller[`${data.onDemand}target`] += data2.subimpression.dem;
				data2.onDemand.map((x) => puller[data.onDemand].push(x));
				data2.onDemand.map((x) => pullerCate[data.onDemand].push(x));
			}
		}
		if (data.podcast) {
			dass.push(data.podcast);
			if (puller[data.podcast]) {
				data2.podcast.map((x) => puller[data.podcast].push(x));
				data2.podcast.map((x) => pullerCate[data.podcast].push(x));
				pullerData[`complete`].target += data2.subimpression.pod;
				puller[`${data.podcast}target`] += data2.subimpression.pod;
			} else {
				puller[data.podcast] = [];
				pullerCate[data.podcast] = [];
				puller[`${data.podcast}target`] = 0;
				pullerData[`complete`].target += data2.subimpression.pod;
				puller[`${data.podcast}target`] += data2.subimpression.pod;
				data2.podcast.map((x) => puller[data.podcast].push(x));
				data2.podcast.map((x) => pullerCate[data.podcast].push(x));
			}
		}
		if (data.musicapps) {
			dass.push(data.musicapps);
			if (puller[data.musicapps]) {
				data2.musicapps.map((x) => puller[data.musicapps].push(x));
				data2.musicapps.map((x) => pullerCate[data.musicapps].push(x));
				pullerData[`complete`].target += data2.subimpression.mus;
				puller[`${data.musicapps}target`] += data2.subimpression.mus;
			} else {
				puller[data.musicapps] = [];
				pullerCate[data.musicapps] = [];
				puller[`${data.musicapps}target`] = 0;
				pullerData[`complete`].target += data2.subimpression.mus;
				puller[`${data.musicapps}target`] += data2.subimpression.mus;
				data2.musicapps.map((x) => puller[data.musicapps].push(x));
				data2.musicapps.map((x) => pullerCate[data.musicapps].push(x));
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
			data2.video.map((x) => pullerCate[data.video].push(x));
			pullerData[`complete`].target += data2.vidimpression;
			puller[`${data.video}target`] += data2.vidimpression;
		} else {
			puller[data.video] = [];
			pullerCate[data.video] = [];
			puller[`${data.video}target`] = 0;
			puller[`${data.video}target`] += data2.vidimpression;
			pullerData[`complete`].target += data2.vidimpression;
			data2.video.map((x) => puller[data.video].push(x));
			data2.video.map((x) => pullerCate[data.video].push(x));
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
					pullerData['complete'].onlineImpressions += result.onlineImpressions ? result.onlineImpressions : 0;
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
	pullerData.complete.midpoint = pullerData.complete.midpoint / pullerData.complete.onlineImpressions * 100;
	pullerData.complete.thirdQuartile = pullerData.complete.thirdQuartile / pullerData.complete.onlineImpressions * 100;
	pullerData.complete.ltr = pullerData.complete.complete * 100 / pullerData.complete.onlineImpressions;
	pullerData.complete.complete = pullerData.complete.complete / pullerData.complete.onlineImpressions * 100;
	pullerData.complete.firstQuartile = pullerData.complete.firstQuartile / pullerData.complete.onlineImpressions * 100;
	// pullerData.complete.midpoint = Math.round(pullerData.complete.midpoint);
	// pullerData.complete.thirdQuartile = Math.round(pullerData.complete.thirdQuartile);
	// pullerData.complete.complete = Math.round(pullerData.complete.complete);
	for (const [ y, z ] of Object.entries(pullerCate)) {
		pullerData[y].midpoint = pullerData[y].midpoint / pullerData[y].firstQuartile * pullerData[y].impressions;
		pullerData[y].thirdQuartile =
			pullerData[y].thirdQuartile / pullerData[y].firstQuartile * pullerData[y].impressions;
		// pullerData[y].complete = pullerData[y].complete / pullerData[y].firstQuartile * pullerData[y].impressions;
		pullerData[y].firstQuartile = pullerData[y].impressions;
		pullerData[y].ltr = pullerData[y].complete * 100 / pullerData[y].onlineImpressions;
	}
	console.log(dass, puller, pullerData);
	dispatch({
		type: REPORT_LOADED_CLIENT,
		payload: {
			mains: dass,
			ids: puller,
			cateids: pullerCate,
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
							adtitle: result.searchName,
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
							id: result.searchName,
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
					await fetch('/offreport/detrepocambydat', {
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
							dlogs = dlogs.filter((x) => x.impressions >= 10);
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
