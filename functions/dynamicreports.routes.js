var mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const adminauth = require('../authenMiddleware/adminauth');
const campaignifareports = mongoose.model('campaignifareports');
const uareqreports = mongoose.model('uareqreports');
const Campaignwisereports = mongoose.model('campaignwisereports');
const StreamingAds = mongoose.model('streamingads');
const adsetting = mongoose.model('adsetting');

function dayFinderCount(array) {
	var daysCount = 1;
	if (typeof array === 'object') {
		array = [ ...new Set(array) ];
		// console.log(array);
		daysCount = array.length;
	}
	return daysCount;
}

function namereturner(testappubid) {
	var forda = '';
	if (testappubid && testappubid.length)
		for (var i = 0; i < testappubid.length; i++) {
			if (testappubid && testappubid[i] && testappubid[i].publishername) {
				forda = testappubid[i];
				break;
			}
		}
	return forda;
}

function arr_diff(a1, a2) {
	var a = [],
		diff = [],
		daila = 0,
		diffa = 0,
		cou = 0;
	for (var i = 0; i < a1.length; i++) {
		diffa += 1;
		a[a1[i]] = true;
	}
	for (var i = 0; i < a2.length; i++) {
		if (a[a2[i]]) {
			cou += 1;
			delete a[a2[i]];
		}
	}
	for (var k in a) {
		daila += 1;
		diff.push(k);
	}
	// console.log(diff.length, diffa - daila, cou);
	return diff;
}

router.put('/dynamicConsolePublisher', adminauth, async (req, res) => {
	try {
		const { startDate, endDate } = req.body;
		const idsTo = await StreamingAds.find({}, { _id: 1 }).catch((err) => console.log(err));
		var totalids = [];
		var idsDefined = [];
		idsTo.forEach((x) => {
			totalids.push(mongoose.Types.ObjectId(x._id));
		});
		const totalDays = (new Date(endDate) - new Date(startDate)) / (1000 * 3600 * 24);
		const sup_ids = await adsetting
			.find({ campaignId: { $in: totalids } })
			.select('campaignId type')
			.catch((err) => console.log(err));
		var ids = { audio: [], display: [], video: [] };
		var audio_type = sup_ids.filter((x) => x.type === 'audio');
		var display_type = sup_ids.filter((x) => x.type === 'display');
		var video_type = sup_ids.filter((x) => x.type === 'video');
		audio_type.forEach((x) => {
			ids.audio.push(x.campaignId.toString());
			idsDefined.push(x.campaignId.toString());
		});
		display_type.forEach((x) => {
			ids.display.push(x.campaignId.toString());
			idsDefined.push(x.campaignId.toString());
		});
		video_type.forEach((x) => {
			ids.video.push(x.campaignId.toString());
			idsDefined.push(x.campaignId.toString());
		});
		var letf = arr_diff(totalids, idsDefined);
		letf.map((d) => {
			ids.audio.push(d.toString());
		});
		// console.log(totalids.length);
		// var audiodig = arr_diff(totalids, idsDefined);
		// console.log(totalids.length, idsDefined.length);
		// console.log(audiodig.length);
		ids.audio = ids.audio.map((x) => mongoose.Types.ObjectId(x));
		ids.display = ids.display.map((x) => mongoose.Types.ObjectId(x));
		ids.video = ids.video.map((x) => mongoose.Types.ObjectId(x));
		console.log(ids.audio.length, ids.display.length, ids.video.length);
		let publisherDataAudio = await Campaignwisereports.aggregate([
			{ $match: { campaignId: { $in: ids.audio } } },
			{
				$project: {
					test: { $dateToString: { format: '%Y-%m-%d', date: '$createdOn' } },
					apppubid: '$apppubid',
					feed: '$feed',
					ssp: '$ssp',
					impression: '$impression',
					CompanionClickTracking: '$CompanionClickTracking',
					SovClickTracking: '$SovClickTracking',
					start: '$start',
					firstQuartile: '$firstQuartile',
					midpoint: '$midpoint',
					thirdQuartile: '$thirdQuartile',
					complete: '$complete'
				}
			},
			{ $match: { test: { $gte: startDate, $lte: endDate } } },
			{
				$group: {
					_id: { appubid: '$apppubid', feed: '$feed' },
					test: { $push: '$test' },
					ssp: { $push: '$ssp' },
					impressions: { $sum: '$impression' },
					clicks: { $sum: '$CompanionClickTracking' },
					clicks1: { $sum: '$SovClickTracking' },
					start: { $sum: '$start' },
					firstQuartile: { $sum: '$firstQuartile' },
					midpoint: { $sum: '$midpoint' },
					thirdQuartile: { $sum: '$thirdQuartile' },
					complete: { $sum: '$complete' }
				}
			},
			{
				$project: {
					PublisherSplit: '$_id.appubid',
					feed: '$_id.feed',
					test: '$test',
					ssp: '$ssp',
					impressions: '$impressions',
					clicks: '$clicks',
					clicks1: '$clicks1',
					start: '$start',
					firstQuartile: '$firstQuartile',
					midpoint: '$midpoint',
					thirdQuartile: '$thirdQuartile',
					complete: '$complete',
					_id: 0
				}
			},
			{
				$lookup: {
					from: 'apppublishers',
					localField: 'PublisherSplit',
					foreignField: 'publisherid',
					as: 'apppubidpo'
				}
			}
		]);
		let publisherDataDisplay = await Campaignwisereports.aggregate([
			{ $match: { campaignId: { $in: ids.display } } },
			{
				$project: {
					test: { $dateToString: { format: '%Y-%m-%d', date: '$createdOn' } },
					apppubid: '$apppubid',
					feed: '$feed',
					ssp: '$ssp',
					impression: '$impression',
					CompanionClickTracking: '$CompanionClickTracking',
					SovClickTracking: '$SovClickTracking'
				}
			},
			{ $match: { test: { $gte: startDate, $lte: endDate } } },
			{
				$group: {
					_id: { appubid: '$apppubid', feed: '$feed' },
					test: { $push: '$test' },
					ssp: { $push: '$ssp' },
					impressions: { $sum: '$impression' },
					clicks: { $sum: '$CompanionClickTracking' },
					clicks1: { $sum: '$SovClickTracking' }
				}
			},
			{
				$project: {
					PublisherSplit: '$_id.appubid',
					feed: '$_id.feed',
					test: '$test',
					ssp: '$ssp',
					impressions: '$impressions',
					clicks: '$clicks',
					clicks1: '$clicks1',
					_id: 0
				}
			},
			{
				$lookup: {
					from: 'apppublishers',
					localField: 'PublisherSplit',
					foreignField: 'publisherid',
					as: 'apppubidpo'
				}
			}
		]);
		let publisherDataVideo = await Campaignwisereports.aggregate([
			{ $match: { campaignId: { $in: ids.video } } },
			{
				$project: {
					test: { $dateToString: { format: '%Y-%m-%d', date: '$createdOn' } },
					apppubid: '$apppubid',
					feed: '$feed',
					ssp: '$ssp',
					impression: '$impression',
					CompanionClickTracking: '$CompanionClickTracking',
					SovClickTracking: '$SovClickTracking',
					start: '$start',
					firstQuartile: '$firstQuartile',
					midpoint: '$midpoint',
					thirdQuartile: '$thirdQuartile',
					complete: '$complete'
				}
			},
			{ $match: { test: { $gte: startDate, $lte: endDate } } },
			{
				$group: {
					_id: { appubid: '$apppubid', feed: '$feed' },
					test: { $push: '$test' },
					ssp: { $push: '$ssp' },
					impressions: { $sum: '$impression' },
					clicks: { $sum: '$CompanionClickTracking' },
					clicks1: { $sum: '$SovClickTracking' },
					start: { $sum: '$start' },
					firstQuartile: { $sum: '$firstQuartile' },
					midpoint: { $sum: '$midpoint' },
					thirdQuartile: { $sum: '$thirdQuartile' },
					complete: { $sum: '$complete' }
				}
			},
			{
				$project: {
					PublisherSplit: '$_id.appubid',
					feed: '$_id.feed',
					test: '$test',
					ssp: '$ssp',
					impressions: '$impressions',
					clicks: '$clicks',
					clicks1: '$clicks1',
					start: '$start',
					firstQuartile: '$firstQuartile',
					midpoint: '$midpoint',
					thirdQuartile: '$thirdQuartile',
					complete: '$complete',
					_id: 0
				}
			},
			{
				$lookup: {
					from: 'apppublishers',
					localField: 'PublisherSplit',
					foreignField: 'publisherid',
					as: 'apppubidpo'
				}
			}
		]);
		// let uniquePub = await campaignifareports;
		// 	.aggregate([
		// 		{
		// 			$project: {
		// 				test: { $dateToString: { format: '%Y-%m-%d', date: '$createdOn' } },
		// 				apppubid: '$apppubid',
		// 				rtbType: '$rtbType',
		// 				ifa: '$ifa'
		// 			}
		// 		},
		// 		{ $match: { test: { $gte: startDate, $lt: endDate } } },
		// 		{
		// 			$group: {
		// 				_id: { ifa: '$ifa', rtbType: '$rtbType', apppubid: '$apppubid' }
		// 			}
		// 		},
		// 		{
		// 			$group: {
		// 				_id: { rtbType: '$_id.rtbType', apppubid: '$_id.apppubid' },
		// 				users: { $sum: 1 }
		// 			}
		// 		},
		// 		{
		// 			$group: {
		// 				_id: '_id.rtbType',
		// 				data: {
		// 					$push: {
		// 						k: '$_id.apppubid',
		// 						v: '$users'
		// 					}
		// 				}
		// 			}
		// 		},
		// 		{
		// 			$project: {
		// 				_id: '$_id',
		// 				values: { $arrayToObject: '$data' }
		// 			}
		// 		},
		// 		{
		// 			$group: {
		// 				_id: null,
		// 				compo: {
		// 					$push: {
		// 						k: '$_id',
		// 						v: '$values'
		// 					}
		// 				}
		// 			}
		// 		},
		// 		{
		// 			$project: {
		// 				final: { $arrayToObject: '$compo' }
		// 			}
		// 		}
		// 	])
		// 	.allowDiskUse(true);
		// let uniqueSum = await campaignifareports
		// 	.aggregate([
		// 		{
		// 			$project: {
		// 				test: { $dateToString: { format: '%Y-%m-%d', date: '$createdOn' } },
		// 				rtbType: '$rtbType',
		// 				ifa: '$ifa'
		// 			}
		// 		},
		// 		{ $match: { test: { $gte: startDate, $lt: endDate } } },
		// 		{
		// 			$group: {
		// 				_id: { ifa: '$ifa', rtbType: '$rtbType' }
		// 			}
		// 		},
		// 		{
		// 			$group: {
		// 				_id: '$_id.rtbType',
		// 				users: { $sum: 1 }
		// 			}
		// 		}
		// 	])
		// 	.allowDiskUse(true);
		let uadata = await uareqreports
			.aggregate([
				{ $match: { date: { $gte: startDate, $lte: endDate } } },
				{ $group: { _id: '$publisherid', request: { $sum: '$ads' } } }
			])
			.allowDiskUse(true)
			.catch((err) => console.log(err));
		var sol = {};
		uadata.map((x) => {
			sol[x._id] = x.request;
		});
		console.log(uadata);
		var complete = {
			complete: {
				impressions: 0,
				avgimpressions: 0,
				totunique: 0,
				unique: 0,
				avgfreq: 0,
				clicks: 0,
				complete: 0
			},
			audio: {
				requests: 0,
				avgrequests: 0,
				impressions: 0,
				avgimpressions: 0,
				totunique: 0,
				unique: 0,
				avgfreq: 0,
				clicks: 0,
				complete: 0
			},
			display: {
				impressions: 0,
				avgimpressions: 0,
				totunique: 0,
				unique: 0,
				avgfreq: 0,
				clicks: 0
			},
			video: {
				impressions: 0,
				avgimpressions: 0,
				totunique: 0,
				unique: 0,
				avgfreq: 0,
				clicks: 0,
				complete: 0
			}
		};
		publisherDataAudio.map((x) => {
			var daycount = dayFinderCount(x.test);
			x.test = undefined;
			x.ssp = x.ssp ? x.ssp[0] : '';
			x.apppubidpo = namereturner(x.apppubidpo);
			// x.unique =
			// 	uniquePub &&
			// 	uniquePub[0] &&
			// 	uniquePub[0].final &&
			// 	uniquePub[0].final.audio &&
			// 	uniquePub[0].final.audio[x.PublisherSplit]
			// 		? uniquePub[0].final.audio[x.PublisherSplit]
			// 		: 0;
			// x.avgfreq = x.unique / daycount;
			x.avgimpressions = x.impressions / daycount;
			x.requests = sol[x.PublisherSplit];
			x.avgrequests = x.requests / daycount;
			// complete.complete.unique += x.unique ? parseInt(x.unique) : 0;
			complete.complete.impressions += x.impressions ? parseInt(x.impressions) : 0;
			complete.complete.clicks += x.clicks ? parseInt(x.clicks) : 0;
			complete.complete.clicks += x.clicks1 ? parseInt(x.clicks1) : 0;
			complete.complete.complete += x.complete ? parseInt(x.complete) : 0;
			// complete.audio.unique += x.unique ? parseInt(x.unique) : 0;
			complete.audio.impressions += x.impressions ? parseInt(x.impressions) : 0;
			complete.audio.clicks += x.clicks ? parseInt(x.clicks) : 0;
			complete.audio.clicks += x.clicks1 ? parseInt(x.clicks1) : 0;
			complete.audio.complete += x.complete ? parseInt(x.complete) : 0;
			complete.audio.requests += x.requests ? parseInt(x.requests) : 0;
		});
		publisherDataDisplay.map((x) => {
			var daycount = dayFinderCount(x.test);
			x.test = undefined;
			x.ssp = x.ssp ? x.ssp[0] : '';
			x.apppubidpo = namereturner(x.apppubidpo);
			// x.unique =
			// 	uniquePub &&
			// 	uniquePub[0] &&
			// 	uniquePub[0].final &&
			// 	uniquePub[0].final.audio &&
			// 	uniquePub[0].final.audio[x.PublisherSplit]
			// 		? uniquePub[0].final.audio[x.PublisherSplit]
			// 		: 0;
			// x.avgfreq = x.unique / daycount;
			x.avgimpressions = x.impressions / daycount;
			// complete.complete.unique += x.unique ? parseInt(x.unique) : 0;
			complete.complete.impressions += x.impressions ? parseInt(x.impressions) : 0;
			complete.complete.clicks += x.clicks ? parseInt(x.clicks) : 0;
			complete.complete.clicks += x.clicks1 ? parseInt(x.clicks1) : 0;
			// complete.display.unique += x.unique ? parseInt(x.unique) : 0;
			complete.display.impressions += x.impressions ? parseInt(x.impressions) : 0;
			complete.display.clicks += x.clicks ? parseInt(x.clicks) : 0;
			complete.display.clicks += x.clicks1 ? parseInt(x.clicks1) : 0;
		});
		publisherDataVideo.map((x) => {
			var daycount = dayFinderCount(x.test);
			x.test = undefined;
			x.ssp = x.ssp ? x.ssp[0] : '';
			x.apppubidpo = namereturner(x.apppubidpo);
			// x.unique =
			// 	uniquePub &&
			// 	uniquePub[0] &&
			// 	uniquePub[0].final &&
			// 	uniquePub[0].final.audio &&
			// 	uniquePub[0].final.audio[x.PublisherSplit]
			// 		? uniquePub[0].final.audio[x.PublisherSplit]
			// 		: 0;
			// x.avgfreq = x.unique / daycount;
			x.avgimpressions = x.impressions / daycount;
			// complete.complete.unique += x.unique ? parseInt(x.unique) : 0;
			complete.complete.impressions += x.impressions ? parseInt(x.impressions) : 0;
			complete.complete.clicks += x.clicks ? parseInt(x.clicks) : 0;
			complete.complete.clicks += x.clicks1 ? parseInt(x.clicks1) : 0;
			complete.complete.complete += x.complete ? parseInt(x.complete) : 0;
			// complete.audio.unique += x.unique ? parseInt(x.unique) : 0;
			complete.audio.impressions += x.impressions ? parseInt(x.impressions) : 0;
			complete.audio.clicks += x.clicks ? parseInt(x.clicks) : 0;
			complete.audio.clicks += x.clicks1 ? parseInt(x.clicks1) : 0;
			complete.audio.complete += x.complete ? parseInt(x.complete) : 0;
		});
		// uniqueSum.map((y) => {
		// 	if (y._id === 'video') {
		// 		complete.video.totunique += parseInt(x.users);
		// 		complete.complete.totunique += parseInt(x.users);
		// 	} else if (y._id === 'display') {
		// 		complete.display.totunique += parseInt(x.users);
		// 		complete.complete.totunique += parseInt(x.users);
		// 	} else {
		// 		complete.audio.totunique += parseInt(x.users);
		// 		complete.complete.totunique += parseInt(x.users);
		// 	}
		// });
		complete.complete.avgimpressions = complete.complete.impressions / totalDays;
		complete.audio.avgimpressions = complete.audio.impressions / totalDays;
		complete.display.avgimpressions = complete.display.impressions / totalDays;
		complete.video.avgimpressions = complete.video.impressions / totalDays;
		// complete.complete.avgfreq = complete.complete.totunique / totalDays;
		// complete.audio.avgfreq = complete.audio.totunique / totalDays;
		// complete.display.avgfreq = complete.display.totunique / totalDays;
		// complete.video.avgfreq = complete.video.totunique / totalDays;
		complete.audio.avgrequests = complete.audio.requests / totalDays;
		console.log('complete');
		res.json({
			summary: complete,
			sol,
			display: publisherDataDisplay,
			video: publisherDataVideo,
			audio: publisherDataAudio
		});
	} catch (e) {
		console.log(e);
		res.status(422).json({ eror: e });
	}
});

const expo = { route: router };

module.exports = expo;
