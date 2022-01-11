import { QUARTILE_LOADED, QUARTILE_ERROR } from '../types.js';
import {
	PUBLISHERDATA_ERROR,
	PUBLISHERDATA_LOADING,
	PUBLISHERDATA_LOADED,
	UNIQUEUSERSPUBLISHER_LOADING,
	UNIQUEUSERSPUBLISHER_LOADED,
	UNIQUEUSERSPUBLISHER_ERROR,
	PUBLISHERDATA_CLEAR,
	DYNAMIC_PUBLISHERDATA_LOADED,
	DYNAMIC_PUBLISHERDATA_LOADING,
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
	dispatch({
		type: UNIQUEUSERSPUBLISHER_LOADING
	});
};

export const DynamicPublisherLoading = () => (dispatch, getState) => {
	dispatch({
		type: DYNAMIC_PUBLISHERDATA_LOADING
	});
};

const timefinder = (da1, da2) => {
	var d1 = new Date(da1);
	var d2 = new Date(da2);
	if (d1 === d2) {
		return 1;
	}
	if (d1 > d2) {
		return 'completed campaign';
	}
	var show = d2.getTime() - d1.getTime();
	var resula = show / (1000 * 3600 * 24);
	if (Math.round(resula * 1) / 1 === 0) {
		resula = 1;
	}
	return Math.round(resula * 1) / 1;
};

export const LoadPublisherData = () => (dispatch, getState) => {
	if (tokenConfig(getState).headers.Authorization) {
		fetch(`/subrepo/publisherComplete2`, {
			method: 'get',
			headers: tokenConfig(getState).headers
		})
			.then((res) => res.json())
			.then((result) => {
				console.log(result);
				var dataA = result.audio;
				dataA.sort(function(a, b) {
					return b.impression - a.impression;
				});
				var daystot = timefinder('2021-09-06', new Date());
				var compodata = {
					complete: {
						complete: 0,
						impressions: 0,
						avgimpressions: 0,
						uniqueusers: 0,
						avgfreq: 0,
						clicks: 0,
						ctr: 0,
						ltr: 0
					},
					audio: {
						complete: 0,
						requests: 0,
						avgrequest: 0,
						impressions: 0,
						avgimpressions: 0,
						uniqueusers: 0,
						avgfreq: 0,
						clicks: 0,
						ctr: 0,
						ltr: 0
					},
					display: {
						impressions: 0,
						complete: 0,
						avgimpressions: 0,
						uniqueusers: 0,
						avgfreq: 0,
						clicks: 0,
						ctr: 0,
						ltr: 0
					},
					video: {
						impressions: 0,
						complete: 0,
						avgimpressions: 0,
						uniqueusers: 0,
						avgfreq: 0,
						clicks: 0,
						ctr: 0,
						ltr: 0
					}
				};
				var uniqueTotalAudio = 0;
				var uniqueTotalDisplay = 0;
				var uniqueTotalVideo = 0;
				dataA.map((x) => (uniqueTotalAudio += x.unique));
				dataA.map((x) => {
					x.ctr = x.click * 100 / x.impression;
					// x.ltr = (x.complete ? parseInt(x.complete) : 0) * 100 / (x.impression ? parseInt(x.impression) : 0);
					// console.log(x.feed);
					compodata.complete.impressions += x.impression;
					compodata.complete.complete += x.complete;
					compodata.complete.clicks += x.click;
					compodata.complete.uniqueusers += x.unique;
					compodata.audio.impressions += x.impression;
					compodata.audio.complete += x.complete;
					compodata.audio.clicks += x.click;
					compodata.audio.uniqueusers += x.unique;
					x.fede = x.feed === 3 ? 'Podcast' : 'Ondemand and Streaming';
					x.ltr = (x.complete ? parseInt(x.complete) : 0) * 100 / (x.impression ? parseInt(x.impression) : 0);
					x.avgimpre = Math.round(x.impression / x.days * 100) / 100;
					x.overlap = x.unique ? Math.trunc(x.unique * 100 / uniqueTotalAudio * 100) / 100 : 0;
					if (x.fede === 'Podcast') {
						x.req = result.sol[x.apppubid];
						compodata.audio.requests += result.sol[x.apppubid] ? parseInt(result.sol[x.apppubid]) : 0;
						// x.useage = result.sola[x.apppubid];
						x.useage = 0;
						x.avgreq = Math.round(result.sol[x.apppubid] / x.days * 100) / 100;
						// console.log(x.req);
					} else {
						x.req = 0;
						x.avgreq = 0;
						x.useage = 0;
					}
					// console.log(x.fede);
					x.feed = x.feed === '3' ? 'Podcast' : x.feed === '' ? 'Ondemand and Streaming' : '';
				});
				console.log(dataA);
				var dataD = result.display;
				dataD.sort(function(a, b) {
					return b.impression - a.impression;
				});
				dataD.map((x) => (uniqueTotalDisplay += x.unique));
				dataD.map((x) => {
					x.ctr = x.click * 100 / x.impression;
					// console.log(x.feed);
					compodata.complete.impressions += x.impression;
					// compodata.complete.complete += x.complete;
					compodata.complete.clicks += x.click;
					compodata.complete.uniqueusers += x.unique;
					compodata.display.impressions += x.impression;
					compodata.display.complete += x.complete;
					compodata.display.clicks += x.click;
					compodata.display.uniqueusers += x.unique;
					x.fede = x.feed === 3 ? 'Podcast' : 'Ondemand and Streaming';
					x.overlap = x.unique ? Math.trunc(x.unique * 100 / uniqueTotalDisplay * 100) / 100 : 0;
					// console.log(x.fede);
					// x.ltr = (x.complete ? parseInt(x.complete) : 0) * 100 / (x.impression ? parseInt(x.impression) : 0);
					x.feed = x.feed === '3' ? 'Podcast' : x.feed === '' ? 'Ondemand and Streaming' : '';
					x.avgimpre = Math.round(x.impression / x.days * 100) / 100;
				});
				var dataV = result.video;
				dataV.sort(function(a, b) {
					return b.impression - a.impression;
				});
				dataV.map((x) => (uniqueTotalVideo += x.unique));
				dataV.map((x) => {
					x.ctr = x.click * 100 / x.impression;
					// console.log(x.feed);
					compodata.complete.impressions += x.impression;
					compodata.complete.complete += x.complete;
					compodata.complete.clicks += x.click;
					compodata.complete.uniqueusers += x.unique;
					compodata.video.impressions += x.impression;
					compodata.video.complete += x.complete;
					compodata.video.clicks += x.click;
					compodata.video.uniqueusers += x.unique;
					x.fede = x.feed === 3 ? 'Podcast' : 'Ondemand and Streaming';
					x.overlap = x.unique ? Math.trunc(x.unique * 100 / uniqueTotalVideo * 100) / 100 : 0;
					x.ltr = (x.complete ? parseInt(x.complete) : 0) * 100 / (x.impression ? parseInt(x.impression) : 0);
					// console.log(x.fede);
					// x.ltr = (x.complete ? parseInt(x.complete) : 0) * 100 / (x.impression ? parseInt(x.impression) : 0);
					x.feed = x.feed === '3' ? 'Podcast' : x.feed === '' ? 'Ondemand and Streaming' : '';
					x.avgimpre = Math.round(x.impression / x.days * 100) / 100;
				});
				compodata.complete.ctr =
					Math.round(compodata.complete.clicks * 100 / compodata.complete.impressions * 100) / 100;
				compodata.audio.ctr =
					Math.round(compodata.audio.clicks * 100 / compodata.audio.impressions * 100) / 100;
				compodata.display.ctr =
					Math.round(compodata.display.clicks * 100 / compodata.display.impressions * 100) / 100;
				compodata.video.ctr =
					Math.round(compodata.video.clicks * 100 / compodata.video.impressions * 100) / 100;
				compodata.complete.ltr =
					Math.round(compodata.complete.complete * 100 / compodata.complete.impressions * 100) / 100;
				compodata.audio.ltr =
					Math.round(compodata.audio.complete * 100 / compodata.audio.impressions * 100) / 100;
				compodata.video.ltr =
					Math.round(compodata.video.complete * 100 / compodata.video.impressions * 100) / 100;
				compodata.audio.avgrequest = Math.round(compodata.audio.requests * 100 / parseInt(daystot)) / 100;
				compodata.complete.avgimpressions =
					Math.round(compodata.complete.impressions * 100 / parseInt(daystot)) / 100;
				compodata.audio.avgimpressions =
					Math.round(compodata.audio.impressions * 100 / parseInt(daystot)) / 100;
				compodata.display.avgimpressions =
					Math.round(compodata.display.impressions * 100 / parseInt(daystot)) / 100;
				compodata.video.avgimpressions =
					Math.round(compodata.video.impressions * 100 / parseInt(daystot)) / 100;
				compodata.complete.avgfreq =
					Math.round(compodata.complete.impressions * 100 / compodata.complete.uniqueusers) / 100;
				compodata.audio.avgfreq =
					Math.round(compodata.audio.impressions * 100 / compodata.audio.uniqueusers) / 100;
				compodata.display.avgfreq =
					Math.round(compodata.display.impressions * 100 / compodata.display.uniqueusers) / 100;
				compodata.video.avgfreq =
					Math.round(compodata.video.impressions * 100 / compodata.video.uniqueusers) / 100;
				console.log(compodata, daystot);
				dispatch({
					type: PUBLISHERDATA_LOADED,
					payload: {
						total: compodata,
						complete: result.complete,
						audio: dataA,
						display: dataD,
						video: dataV
					}
				});
				dispatch({
					type: QUARTILE_LOADED,
					payload: {
						caudio: dataA,
						cvideo: dataV
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

export const LoadUniqueUsersData = () => (dispatch, getState) => {
	if (tokenConfig(getState).headers.Authorization) {
		console.log('unique called');
		fetch(`/subrepo/publisherComplete/usersCount`, {
			method: 'get',
			headers: tokenConfig(getState).headers
		})
			.then((res) => res.json())
			.then((result) => {
				console.log(result);
				dispatch({
					type: UNIQUEUSERSPUBLISHER_LOADED,
					payload: result
				});
			})
			.catch((err) => {
				console.log(err);
				dispatch({
					type: UNIQUEUSERSPUBLISHER_ERROR
				});
			});
	}
};

export const LoadDynamicReportTest = (startDate, endDate) => (dispatch, getState) => {
	console.log({ startDate, endDate });
	console.log('called');
	fetch('/dynamic/dynamicConsolePublisher', {
		method: 'PUT',
		headers: tokenConfig(getState).headers,
		body: JSON.stringify({ startDate: startDate, endDate: endDate })
	})
		.then((res) => res.json())
		.then((results) => {
			var result = results
			console.log(result);
			const summ = [
				{
					ySteps: 1,
					xSteps: 3,
					columns: [ { title: `Overall Summary Report ${startDate} to ${endDate}` } ],
					data: [ [ { value: '' } ] ]
				},
				{
					columns: [
						{ title: 'Total Impressions' },
						{ title: 'Average Impressions' },
						{ title: 'Total Clicks' },
						{ title: 'CTR' },
						{ title: 'LTR' }
					],
					data: [
						[
							{
								value:
									result &&
									result.summary &&
									result.summary.complete &&
									result.summary.complete.impressions
										? result.summary.complete.impressions
										: 0
							},
							{
								value:
									result &&
									result.summary &&
									result.summary.complete &&
									result.summary.complete.avgimpressions
										? result.summary.complete.avgimpressions
										: 0
							},
							{
								value:
									result &&
									result.summary &&
									result.summary.complete &&
									result.summary.complete.clicks
										? result.summary.complete.clicks
										: 0
							},
							{
								value:
									result &&
									result.summary &&
									result.summary.complete &&
									result.summary.complete.clicks &&
									result.summary.complete.impressions
										? result.summary.complete.clicks / result.summary.complete.impressions + '%'
										: 0
							},
							{
								value:
									result &&
									result.summary &&
									result.summary.complete &&
									result.summary.complete.complete &&
									result.summary.complete.impressions
										? result.summary.complete.complete / result.summary.complete.impressions + '%'
										: 0
							}
						]
					]
				},
				{
					ySteps: 1,
					xSteps: 3,
					columns: [ { title: `Overall Audio Report` } ],
					data: [ [ { value: '' } ] ]
				},
				{
					columns: [
						{ title: 'Total Request' },
						{ title: 'Average Request' },
						{ title: 'Total Impressions' },
						{ title: 'Average Impressions' },
						{ title: 'Total Clicks' },
						{ title: 'CTR' },
						{ title: 'LTR' }
					],
					data: [
						[
							{
								value:
									result && result.summary && result.summary.audio && result.summary.audio.requests
										? result.summary.audio.requests
										: 0
							},
							{
								value:
									result && result.summary && result.summary.audio && result.summary.audio.avgrequests
										? result.summary.audio.avgrequests
										: 0
							},
							{
								value:
									result && result.summary && result.summary.audio && result.summary.audio.impressions
										? result.summary.audio.impressions
										: 0
							},
							{
								value:
									result &&
									result.summary &&
									result.summary.audio &&
									result.summary.audio.avgimpressions
										? result.summary.audio.avgimpressions
										: 0
							},
							{
								value:
									result && result.summary && result.summary.audio && result.summary.audio.clicks
										? result.summary.audio.clicks
										: 0
							},
							{
								value:
									result &&
									result.summary &&
									result.summary.audio &&
									result.summary.audio.clicks &&
									result.summary.audio.impressions
										? result.summary.audio.clicks / result.summary.audio.impressions + '%'
										: 0
							},
							{
								value:
									result &&
									result.summary &&
									result.summary.audio &&
									result.summary.audio.complete &&
									result.summary.audio.impressions
										? result.summary.audio.complete / result.summary.audio.impressions + '%'
										: 0
							}
						]
					]
				},
				{
					ySteps: 1,
					xSteps: 3,
					columns: [ { title: `Overall Display Report` } ],
					data: [ [ { value: '' } ] ]
				},
				{
					columns: [
						{ title: 'Total Impressions' },
						{ title: 'Average Impressions' },
						{ title: 'Total Clicks' },
						{ title: 'CTR' }
					],
					data: [
						[
							{
								value:
									result &&
									result.summary &&
									result.summary.display &&
									result.summary.display.impressions
										? result.summary.display.impressions
										: 0
							},
							{
								value:
									result &&
									result.summary &&
									result.summary.display &&
									result.summary.display.avgimpressions
										? result.summary.display.avgimpressions
										: 0
							},
							{
								value:
									result && result.summary && result.summary.display && result.summary.display.clicks
										? result.summary.display.clicks
										: 0
							},
							{
								value:
									result &&
									result.summary &&
									result.summary.display &&
									result.summary.display.clicks &&
									result.summary.display.impressions
										? result.summary.display.clicks / result.summary.display.impressions + '%'
										: 0
							}
						]
					]
				},
				{
					ySteps: 1,
					xSteps: 3,
					columns: [ { title: `Overall Video Report` } ],
					data: [ [ { value: '' } ] ]
				},
				{
					columns: [
						{ title: 'Total Impressions' },
						{ title: 'Average Impressions' },
						{ title: 'Total Clicks' },
						{ title: 'CTR' },
						{ title: 'LTR' }
					],
					data: [
						[
							{
								value:
									result && result.summary && result.summary.video && result.summary.video.impressions
										? result.summary.video.impressions
										: 0
							},
							{
								value:
									result &&
									result.summary &&
									result.summary.video &&
									result.summary.video.avgimpressions
										? result.summary.video.avgimpressions
										: 0
							},
							{
								value:
									result && result.summary && result.summary.video && result.summary.video.clicks
										? result.summary.video.clicks
										: 0
							},
							{
								value:
									result &&
									result.summary &&
									result.summary.video &&
									result.summary.video.clicks &&
									result.summary.video.impressions
										? result.summary.video.clicks / result.summary.video.impressions + '%'
										: 0
							},
							{
								value:
									result &&
									result.summary &&
									result.summary.video &&
									result.summary.video.complete &&
									result.summary.video.impressions
										? result.summary.video.complete / result.summary.video.impressions + '%'
										: 0
							}
						]
					]
				},
				{
					ySteps: 1,
					xSteps: 3,
					columns: [ { title: `Overall Quartile Summary Report` } ],
					data: [ [ { value: '' } ] ]
				},
				{
					columns: [
						{ title: '' },
						{ title: 'Start' },
						{ title: 'First Quartile' },
						{ title: 'Second Quartile' },
						{ title: 'Third Quartile' },
						{ title: 'Complete' },
						{ title: 'Total Impressions' }
					],
					data: [
						[
							{ value: 'Impressions' },
							{
								value:
									result && result.summary && result.summary.complete && result.summary.complete.start
										? result.summary.complete.start
										: 0
							},
							{
								value:
									result &&
									result.summary &&
									result.summary.complete &&
									result.summary.complete.firstQuartile
										? result.summary.complete.firstQuartile
										: 0
							},
							{
								value:
									result &&
									result.summary &&
									result.summary.complete &&
									result.summary.complete.midpoint
										? result.summary.complete.midpoint
										: 0
							},
							{
								value:
									result &&
									result.summary &&
									result.summary.complete &&
									result.summary.complete.thirdQuartile
										? result.summary.complete.thirdQuartile
										: 0
							},
							{
								value:
									result &&
									result.summary &&
									result.summary.complete &&
									result.summary.complete.complete
										? result.summary.complete.complete
										: 0
							}
						]
					]
				}
			];
			result.audio && result.audio.sort(function(b,a){return a.impressions-b.impressions})
			result.display && result.display.sort(function(b,a){return a.impressions-b.impressions})
			result.video && result.video.sort(function(b,a){return a.impressions-b.impressions})
			const publishAudio = [
				{
					columns: [
						{ title: 'Publisher' },
						{ title: 'PublisherId' },
						{ title: 'SSP' },
						{ title: 'Feed' },
						{ title: 'Requests' },
						{ title: 'Avgerage Requests' },
						{ title: 'Total Impressions' },
						{ title: 'Average Impressions' },
						{ title: 'Total Clicks' },
						{ title: 'CTR' }
					],
					data:
						result && result.audio && result.audio.length
							? result.audio.map((x) => [
									{ value: x.apppubidpo && x.apppubidpo.bundletitle ? x.apppubidpo.bundletitle : '' },
									{ value: x.PublisherSplit ? x.PublisherSplit : '' },
									{ value: x.ssp ? x.ssp : '' },
									{ value: x.feed === '3' ? 'Podcast' : 'Ondemand and Streaming' },
									{ value: x.requests ? x.requests : 0 },
									{ value: x.avgrequests ? x.avgrequests : 0 },
									{ value: x.impressions ? x.impressions : 0 },
									{ value: x.avgimpressions ? x.avgimpressions : 0 },
									{ value: x.clicks ? x.clicks : 0 },
									{ value: x.clicks && x.impressions ? x.clicks / x.impressions + '%' : 0 + '%' }
								])
							: [ [ { value: '' } ] ]
				}
			];
			const publishVideo = [
				{
					columns: [
						{ title: 'Publisher' },
						{ title: 'PublisherId' },
						{ title: 'SSP' },
						{ title: 'Feed' },
						{ title: 'Total Impressions' },
						{ title: 'Average Impressions' },
						{ title: 'Total Clicks' },
						{ title: 'CTR' }
					],
					data:
						result && result.video && result.video.length
							? result.video.map((x) => [
									{ value: x.apppubidpo && x.apppubidpo.bundletitle ? x.apppubidpo.bundletitle : '' },
									{ value: x.PublisherSplit ? x.PublisherSplit : '' },
									{ value: x.ssp ? x.ssp : '' },
									{ value: x.feed === '3' ? 'Podcast' : 'Ondemand and Streaming' },
									{ value: x.impressions ? x.impressions : 0 },
									{ value: x.avgimpressions ? x.avgimpressions : 0 },
									{ value: x.clicks ? x.clicks : 0 },
									{ value: x.clicks && x.impressions ? x.clicks / x.impressions + '%' : 0 + '%' }
								])
							: [ [ { value: '' } ] ]
				}
			];
			const publishDisplay = [
				{
					columns: [
						{ title: 'Publisher' },
						{ title: 'PublisherId' },
						{ title: 'SSP' },
						{ title: 'Feed' },
						{ title: 'Total Impressions' },
						{ title: 'Average Impressions' },
						{ title: 'Total Clicks' },
						{ title: 'CTR' }
					],
					data:
						result && result.display && result.display.length
							? result.display.map((x) => [
									{ value: x.apppubidpo && x.apppubidpo.bundletitle ? x.apppubidpo.bundletitle : '' },
									{ value: x.PublisherSplit ? x.PublisherSplit : '' },
									{ value: x.ssp ? x.ssp : '' },
									{ value: x.feed === '3' ? 'Podcast' : 'Ondemand and Streaming' },
									{ value: x.impressions ? x.impressions : 0 },
									{ value: x.avgimpressions ? x.avgimpressions : 0 },
									{ value: x.clicks ? x.clicks : 0 },
									{ value: x.clicks && x.impressions ? x.clicks / x.impressions + '%' : 0 + '%' }
								])
							: [ [ { value: '' } ] ]
				}
			];
			const quartileAudio = [
				{
					columns: [
						{ title: 'Publisher' },
						{ title: 'PublisherId' },
						{ title: 'Total Impressions' },
						{ title: 'Start' },
						{ title: 'First Quartile' },
						{ title: 'Second Quartile' },
						{ title: 'Third Quartile' },
						{ title: 'Complete' },
						{ title: 'LTR' }
					],
					data:
						result && result.audio && result.audio.length
							? result.audio.map((x) => [
									{ value: x.apppubidpo && x.apppubidpo.bundletitle ? x.apppubidpo.bundletitle : '' },
									{ value: x.PublisherSplit ? x.PublisherSplit : '' },
									{ value: x.ssp ? x.ssp : '' },
									{ value: x.impressions ? x.impressions : 0 },
									{ value: x.start ? x.start : 0 },
									{ value: x.firstQuartile ? x.firstQuartile : 0 },
									{ value: x.midpoint ? x.midpoint : 0 },
									{ value: x.thirdQuartile ? x.thirdQuartile : 0 },
									{ value: x.complete ? x.complete : 0 },
									{ value: x.complete && x.impressions ? x.complete / x.impressions + '%' : 0 + '%' }
								])
							: [ [ { value: '' } ] ]
				}
			];
			const quartileVideo = [
				{
					columns: [
						{ title: 'Publisher' },
						{ title: 'PublisherId' },
						{ title: 'Total Impressions' },
						{ title: 'Start' },
						{ title: 'First Quartile' },
						{ title: 'Second Quartile' },
						{ title: 'Third Quartile' },
						{ title: 'Complete' },
						{ title: 'LTR' }
					],
					data:
						result && result.video && result.video.length
							? result.video.map((x) => [
									{ value: x.apppubidpo && x.apppubidpo.bundletitle ? x.apppubidpo.bundletitle : '' },
									{ value: x.PublisherSplit ? x.PublisherSplit : '' },
									{ value: x.ssp ? x.ssp : '' },
									{ value: x.impressions ? x.impressions : 0 },
									{ value: x.start ? x.start : 0 },
									{ value: x.firstQuartile ? x.firstQuartile : 0 },
									{ value: x.midpoint ? x.midpoint : 0 },
									{ value: x.thirdQuartile ? x.thirdQuartile : 0 },
									{ value: x.complete ? x.complete : 0 },
									{ value: x.complete && x.impressions ? x.complete / x.impressions + '%' : 0 + '%' }
								])
							: [ [ { value: '' } ] ]
				}
			];
			console.log({ summary: summ, publishAudio, publishDisplay, publishVideo, quartileAudio, quartileVideo });
			dispatch({
				type: DYNAMIC_PUBLISHERDATA_LOADED,
				payload: {
					summary: summ,
					publishAudio,
					publishDisplay,
					publishVideo,
					quartileAudio,
					quartileVideo,
					startDate,
					endDate
				}
			});
		})
		.catch((err) => {
			console.log(err);
		});
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
