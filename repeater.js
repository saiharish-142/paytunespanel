var mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const adminauth = require('./authenMiddleware/adminauth');
const publisherwiseConsole = mongoose.model('publisherwiseConsole');
const frequencyConsole = mongoose.model('frequencyConsole');
const frequencyreports = mongoose.model('frequencyreports');
const freqpublishreports = mongoose.model('freqpublishreports');
const campaignifareports = mongoose.model('campaignifareports');
const zipreports = mongoose.model('zipreports');
const zipsumreport = mongoose.model('zipsumreport');
const campaignClient = mongoose.model('campaignClient');
const StreamingAds = mongoose.model('streamingads');
const adsetting = mongoose.model('adsetting');
const admin = mongoose.model('admin');
const freqCampWise = mongoose.model('freqCampWise');
const overallfreqreport = mongoose.model('overallfreqreport');
const freqpubOnreports = mongoose.model('freqpubOnreports');
const campaignwisereports = mongoose.model('campaignwisereports');
const campaignreportsSum = mongoose.model('campaignreportsSum');
var aws = require('aws-sdk');
aws.config.loadFromPath(__dirname + '/config.json');
const ses = new aws.SES();
var email = 'support@paytunes.in';

const saavnids = [
	'22308',
	'22310',
	'5a1e46beeb993dc67979412e',
	'jiosaavn',
	'5efac6f9aeeeb92b8a1ee056',
	'5c0a3f024a6c1355afaffabc',
	'172101100',
	'172101600',
	'11726',
	'com.jio.media.jiobeats',
	'441813332'
];

const musicids = [
	'13698',
	'18880',
	'jiosaavn',
	'18878',
	'22308',
	'22310',
	'11726',
	'845083955',
	'585270521',
	'441813332',
	'172101100',
	'172101600',
	'324684580',
	'com.gaana',
	'com.jio.media.jiobeats',
	'com.spotify.music',
	'com.bsbportal.music',
	'5d3f052e979a1c2391016c04',
	'5efac6f9aeeeb92b8a1ee056',
	'5c0a3f024a6c1355afaffabc',
	'5a1e46beeb993dc67979412e',
	'5b2210af504f3097e73e0d8b',
	'5adeeb79cf7a7e3e5d822106',
	'5d10c405844dd970bf41e2af'
];

const specific1banner = [
	'13698',
	'22308',
	'845083955',
	'22310',
	'5b2210af504f3097e73e0d8b',
	'5a1e46beeb993dc67979412e',
	'jiosaavn',
	'5efac6f9aeeeb92b8a1ee056',
	'5c0a3f024a6c1355afaffabc',
	'com.bsbportal.music',
	'172101100',
	'172101600',
	'5d3f052e979a1c2391016c04',
	'5d10c405844dd970bf41e2af',
	'11726',
	'324684580',
	'com.spotify.music',
	'com.jio.media.jiobeats',
	'441813332'
];
const gannabanner = [ '18880', '18878', '5adeeb79cf7a7e3e5d822106', '585270521', 'com.gaana', '11726' ];

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

async function datareturner(datae) {
	var datee = new Date('2021-10-10').toISOString();
	var cdate, cmonth, cyear;
	var cdatee = new Date(new Date());
	cdate = cdatee.getDate();
	cdate = cdate < 10 ? '0' + cdate : cdate;
	cmonth = cdatee.getMonth() + 1;
	cmonth = cmonth < 10 ? '0' + cmonth : cmonth;
	cyear = cdatee.getFullYear();
	var chevk2 = `${cyear}-${cmonth}-${cdate}`;
	cdatee.setDate(cdatee.getDate() - 1);
	cdate = cdatee.getDate();
	cdate = cdate < 10 ? '0' + cdate : cdate;
	cmonth = cdatee.getMonth() + 1;
	cmonth = cmonth < 10 ? '0' + cmonth : cmonth;
	cyear = cdatee.getFullYear();
	var chevk = `${cyear}-${cmonth}-${cdate}`;
	if (datae) {
		console.log(datae);
		datee = datae;
	}
	console.log(datee, chevk, chevk2);
	try {
		let ids = await adsetting
			.aggregate([
				{ $match: { isRunning: true } },
				{
					$project: {
						testStart: { $dateToString: { format: '%Y-%m-%d', date: '$startDate' } },
						testEnd: { $dateToString: { format: '%Y-%m-%d', date: '$endDate' } },
						campaignId: '$campaignId',
						targetImpression: '$targetImpression',
						type: '$type'
					}
				},
				// { $match: { testEnd: { $gte: '2021-12-22' } } },
				{
					$group: {
						_id: { testStart: '$testStart', testEnd: '$testEnd', campaignId: '$campaignId', type: '$type' },
						targetImpression: { $sum: '$targetImpression' }
					}
				},
				{
					$project: {
						testStart: '$_id.testStart',
						testEnd: '$_id.testEnd',
						campaignId: '$_id.campaignId',
						targetImpression: '$targetImpression',
						type: '$_id.type'
					}
				}
			])
			.catch((err) => console.log(err));
		var idsa = [];
		ids.map((x) => idsa.push(mongoose.Types.ObjectId(x.campaignId)));
		let impredata = await campaignwisereports
			.aggregate([
				{
					$project: {
						campaignId: '$campaignId',
						impression: '$impression',
						test: { $dateToString: { format: '%Y-%m-%d', date: '$createdOn' } }
					}
				},
				{ $match: { campaignId: { $in: idsa }, test: { $lt: chevk2 } } },
				{ $group: { _id: '$campaignId', impressions: { $sum: '$impression' } } }
			])
			.catch((err) => console.log(err));
		var impreset = {};
		for (var i = 0; i < impredata.length; i++) {
			impreset[impredata[i]._id] = impredata[i].impressions;
		}
		console.log(idsa, impredata, impreset);
		for (var j = 0; j < ids.length; j++) {
			var start = new Date(ids[j].testStart);
			var end = new Date(ids[j].testEnd);
			var tod = new Date(chevk);
			var totaldays = (end - start) / (1000 * 3600 * 24);
			var balancedays = 0;
			var completedays = 0;
			var avgach = 0;
			// console.log({ end, tod, start });
			// console.log(tod - start);
			balancedays = parseInt(end - tod) / (1000 * 3600 * 24);
			completedays = parseInt(tod - start) / (1000 * 3600 * 24);
			if (balancedays < 0) {
				balancedays = 0;
			}
			if (completedays > 0) {
				avgach = impress / completedays;
			} else {
				avgach = impress / totaldays;
			}
			// console.log({ balancedays, completedays, tod, avgach });
			var impress = impreset[ids[j].campaignId];
			var target = ids[j].targetImpression ? parseInt(ids[j].targetImpression) : 0;
			var balance = target - impress;
			var avgreq = target / totaldays;
			let check = await campaignreportsSum
				.findOne({ campaignId: ids[j].campaignId, rtbType: ids[j].type })
				.catch((err) => console.log(err));
			if (check) {
				check.impression = impress;
				check.balanceDays = balancedays ? balancedays : 0;
				check.targetImpression = target;
				check.balanceimpression = balance ? balance : 0;
				check.avgreq = avgreq ? avgreq : 0;
				check.avgach = avgach ? avgach : 0;
				check.createdOn = chevk2;
				check
					.save()
					.then((result) => {
						console.log('updated');
					})
					.catch((err) => {
						console.log(err);
					});
			} else {
				const newbie = new campaignreportsSum({
					campaignId: ids[j].campaignId,
					rtbType: ids[j].type,
					noofDays: totaldays,
					balanceDays: balancedays ? balancedays : 0,
					targetImpression: target,
					impression: impress,
					balanceimpression: balance ? balance : 0,
					avgreq: avgreq ? avgreq : 0,
					avgach: avgach ? avgach : 0,
					createdOn: chevk2,
					startDate: ids[j].testStart,
					endDate: ids[j].testEnd
				});
				newbie
					.save()
					.then((result) => {
						console.log('completed');
					})
					.catch((err) => {
						console.log(err);
					});
			}
		}
		return impreset;
	} catch (e) {
		console.log(e);
		return e;
	}
}

function dataformatchanger(date) {
	var data = date;
	if (data === 'Total') {
		return data;
	}
	if (data) {
		return data.substr(8, 2) + '-' + data.substr(5, 2) + '-' + data.substr(0, 4);
	} else {
		return null;
	}
}

async function pacingMailer() {
	var cdate, cmonth, cyear;
	var cdatee = new Date(new Date());
	cdate = cdatee.getDate();
	cdate = cdate < 10 ? '0' + cdate : cdate;
	cmonth = cdatee.getMonth() + 1;
	cmonth = cmonth < 10 ? '0' + cmonth : cmonth;
	cyear = cdatee.getFullYear();
	var chevk2 = `${cyear}-${cmonth}-${cdate}`;
	console.log(chevk2);
	let data = await campaignreportsSum
		.find({ createdOn: chevk2 })
		.populate({ path: 'campaignId', select: 'AdTitle' })
		.sort({ avgreq: -1 })
		.catch((err) => console.log(err));
	data = data.filter((x) => x.balanceDays > 0);
	data.map((x) => {
		if (x.balanceDays) {
			x.avgreqform = x.balanceimpression / x.balanceDays;
		} else {
			x.avgreqform = 0;
		}
	});
	data.sort(function(b, a) {
		return a.avgreqform - b.avgreqform;
	});
	console.log(data.length);
	var params = {
		Destination: {
			BccAddresses: [],
			CcAddresses: [],
			// ToAddresses: [ 'saiharishmedam@gmail.com' ]
			// ToAddresses: [ 'fin-ops@paytunes.in', 'raj.v@paytunes.in', 'saiharishmedam@gmail.com' ]
			ToAddresses: [ 'fin-ops@paytunes.in', 'raj.v@paytunes.in' ]
			// ToAddresses:  ['fin-ops@paytunes.in']
		},
		Message: {
			Body: {
				Html: {
					Charset: 'UTF-8',
					Data: `
					<head>
					<style>
					table {
					font-family: arial, sans-serif;
					border-collapse: collapse;
					width: 100%;
					}

					td, th {
					border: 1px solid #dddddd;
					text-align: center;
					padding: 4px;
					}

					tr:nth-child(even) {
					background-color: #dddddd;
					}
					</style>
					</head>
					<body>

							<div>
								<h2>All pacing campaign details</h2>
								<table>
									<tr>
										<th>Name</th>
										<th>Type</th>
										<th>Start Date</th>
										<th>End Date</th>
										<th>Total days</th>
										<th>Target Impressions</th>
										<th>Delivered Impressions</th>
										<th>Balance Impression</th>
										<th>Balance Days</th>
										<th>Averge Required</th>
									</tr>
									${data
										.map((dalrep) => {
											return `<tr>
												<td>${dalrep.campaignId ? dalrep.campaignId.AdTitle : ''}</td>
												<td>${dalrep.rtbType ? dalrep.rtbType : ''}</td>
												<td>${dalrep.startDate ? dataformatchanger(dalrep.startDate) : ''}</td>
												<td>${dalrep.endDate ? dataformatchanger(dalrep.endDate) : ''}</td>
												<td>${dalrep.noofDays ? dalrep.noofDays : 0}</td>
												<td>${dalrep.targetImpression ? dalrep.targetImpression : 0}</td>
												<td>${dalrep.impression ? dalrep.impression : 0}</td>
												<td>${dalrep.balanceimpression ? dalrep.balanceimpression : 0}</td>
												<td>${dalrep.balanceDays ? dalrep.balanceDays : 0}</td>
												<td>${dalrep.balanceDays && dalrep.avgreqform ? Math.round(dalrep.avgreqform * 100) / 100 : NaN}</td>
											</tr>`;
										})
										.join('')}
								</table>
							</div>

					</body>
						`
				},
				Text: {
					Charset: 'UTF-8',
					Data: 'This is the message if in text if no data found.'
				}
			},
			Subject: {
				Charset: 'UTF-8',
				Data: `Daily Pacing report`
			}
		},
		// ReplyToAddresses: [],
		// ReturnPath: '',
		// ReturnPathArn: '',
		// SourceArn: ''
		Source: email
	};
	ses.sendEmail(params, function(err, data) {
		if (err)
			console.log(err, err.stack); // an error occurred
		else console.log(data); // successful response
		/*
		data = {
		MessageId: "EXAMPLE78603177f-7a5433e7-8edb-42ae-af10-f0181f34d6ee-000000"
		}
			*/
	});
	// return data;
}

const removeDuplicates = (inputArray) => {
	const ids = [];
	return inputArray.reduce((sum, element) => {
		if (!ids.includes(element.toString())) {
			sum.push(element);
			ids.push(element.toString());
		}
		return sum;
	}, []);
};

function remove_duplicates_arrayobject(gotarray, unique) {
	var obj = {};
	var array = gotarray;
	// console.log(array)
	for (var i = 0, len = array.length; i < len; i++) obj[array[i][unique]] = array[i];

	array = new Array();
	for (var key in obj) array.push(obj[key]);

	return array;
}

const idfindspilter = async (respo, onDemand, podcast, audio, display, video, musicapps) => {
	// const { adtitle, onDemand, podcast, audio, display, video, musicapps } = req.body;
	var data;
	data = respo.length && respo[0];
	if (data) {
		var ids =
			typeof campaignId !== 'undefined' && typeof campaignId !== 'string' && typeof campaignId !== 'object'
				? data.id.map((id) => mongoose.Types.ObjectId(id))
				: data.id;
		let id_spliter = await adsetting
			.find({ campaignId: { $in: ids } }, { campaignId: 1, type: 1, targetImpression: 1 })
			.catch((err) => console.log(err));
		data.ids = {
			onDemand: [],
			podcast: [],
			musicapps: [],
			audio: [],
			subimpression: { dem: 0, mus: 0, pod: 0 },
			audimpression: 0,
			display: [],
			disimpression: 0,
			video: [],
			vidimpression: 0
		};
		data.ids['combined'] = ids;
		// data.TargetImpressions = [ ...new Set(data.TargetImpressions) ];
		id_spliter = remove_duplicates_arrayobject(id_spliter, 'campaignId');
		var ids_cam = [];
		id_spliter.map((x) => {
			if (x.campaignId) ids_cam.push(x.campaignId.toString());
		});
		var left_cam = arr_diff(data.id, ids_cam);
		if (left_cam && left_cam.length) {
			await left_cam.map((id) => data.ids.audio.push(id));
			// data.ids.audio = [ ...new Set(data.ids.audio) ];
			data.ids.audio = removeDuplicates(data.ids.audio);
			// data.ids.audio = [ ...new Set(data.ids.audio) ];
		}
		if (id_spliter.length) {
			var audioids = id_spliter.filter((x) => x.type === 'audio');
			audioids.map((x) => {
				data.ids.audio.push(x.campaignId.toString());
				data.ids.audimpression += parseInt(x.targetImpression);
			});
			data.ids.audio = [ ...new Set(data.ids.audio) ];
			if (!(onDemand === podcast && onDemand === musicapps)) {
				// var dads = { onDemand: [], podcast: [], musicapps: [] };
				const outcome = await idsreturnspliter(data.ids.audio);
				data.ids.onDemand = outcome.dem;
				data.ids.podcast = outcome.pod;
				data.ids['musicapps'] = outcome.mus;
				if (data.ids.onDemand.length) {
					var dataonDem = id_spliter.filter((x) => idmatchCheker(x.campaignId, data.ids.onDemand));
					dataonDem.map((im) => {
						data.ids.subimpression.dem += parseInt(im.targetImpression);
					});
				}
				if (data.ids.podcast.length) {
					var datapodcast = id_spliter.filter((x) => idmatchCheker(x.campaignId, data.ids.podcast));
					datapodcast.map((im) => {
						data.ids.subimpression.pod += parseInt(im.targetImpression);
					});
				}
				if (data.ids.musicapps.length) {
					var datamusic = id_spliter.filter((x) => idmatchCheker(x.campaignId, data.ids.musicapps));
					datamusic.map((im) => {
						data.ids.subimpression.mus += parseInt(im.targetImpression);
					});
				}
				// data.ids['new'] = outcome;
			}
			var displayids = id_spliter.filter((x) => x.type === 'display');
			displayids.map((x) => {
				data.ids.display.push(x.campaignId.toString());
				data.ids.disimpression += parseInt(x.targetImpression);
			});
			data.ids.display = [ ...new Set(data.ids.display) ];
			var videoids = id_spliter.filter((x) => x.type === 'video');
			videoids.map((x) => {
				data.ids.video.push(x.campaignId.toString());
				data.ids.vidimpression += parseInt(x.targetImpression);
			});
			data.ids.video = [ ...new Set(data.ids.video) ];
		} else {
			if (ids && ids.length) {
				data.ids.audio = ids;
				var dattarget = data.TargetImpressions && data.TargetImpressions.length ? data.TargetImpressions : [];
				dattarget.map((ar) => {
					data.ids.audimpression += parseInt(ar.TR);
				});
			}
		}
		// var resstartDate = [].concat.apply([], data.startDate);
		// resstartDate = [ ...new Set(resstartDate) ];
		// data.startDate = resstartDate;
		// var resendDate = [].concat.apply([], data.endDate);
		// resendDate = [ ...new Set(resendDate) ];
		// data.endDate = resendDate;
		// data.splendid = id_spliter
		// var tottar = 0;
		// data.TargetImpressions.forEach(num=> tottar += parseInt(num))
		// data.TargetImpressions = tottar
		// res.json(data);
		// console.log(data);
		// return data;
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
		if (audio) {
			dass.push(audio);
			if (puller[audio]) {
				data.ids.audio.map((x) => puller[audio].push(x));
				// puller[`${audio}target`] += data.ids.audimpression;
				pullerData[`complete`].target += data.ids.audimpression;
			} else {
				puller[audio] = [];
				// puller[`${audio}target`] = 0;
				// puller[`${audio}target`] += data.ids.audimpression;
				pullerData[`complete`].target += data.ids.audimpression;
				data.ids.audio.map((x) => puller[audio].push(x));
			}
		}
		if (!(onDemand === podcast && onDemand === musicapps)) {
			if (onDemand) {
				dass.push(onDemand);
				if (puller[onDemand]) {
					data.ids.onDemand.map((x) => puller[onDemand].push(x));
					pullerData[`complete`].target += data.ids.subimpression.dem;
					// puller[`${onDemand}target`] += data.ids.subimpression.dem;
				} else {
					puller[onDemand] = [];
					// puller[`${onDemand}target`] = 0;
					pullerData[`complete`].target += data.ids.subimpression.dem;
					// puller[`${onDemand}target`] += data.ids.subimpression.dem;
					data.ids.onDemand.map((x) => puller[onDemand].push(x));
				}
			}
			if (podcast) {
				dass.push(podcast);
				if (puller[podcast]) {
					data.ids.podcast.map((x) => puller[podcast].push(x));
					pullerData[`complete`].target += data.ids.subimpression.pod;
					// puller[`${podcast}target`] += data.ids.subimpression.pod;
				} else {
					puller[podcast] = [];
					// puller[`${podcast}target`] = 0;
					pullerData[`complete`].target += data.ids.subimpression.pod;
					// puller[`${podcast}target`] += data.ids.subimpression.pod;
					data.ids.podcast.map((x) => puller[podcast].push(x));
				}
			}
			if (musicapps) {
				dass.push(musicapps);
				if (puller[musicapps]) {
					data.ids.musicapps.map((x) => puller[musicapps].push(x));
					pullerData[`complete`].target += data.ids.subimpression.mus;
					// puller[`${musicapps}target`] += data.ids.subimpression.mus;
				} else {
					puller[musicapps] = [];
					// puller[`${musicapps}target`] = 0;
					pullerData[`complete`].target += data.ids.subimpression.mus;
					// puller[`${musicapps}target`] += data.ids.subimpression.mus;
					data.ids.musicapps.map((x) => puller[musicapps].push(x));
				}
			}
		}
		if (display) {
			dass.push(display);
			if (puller[display]) {
				data.ids.display.map((x) => puller[display].push(x));
				pullerData[`complete`].target += data.ids.disimpression;
				// puller[`${display}target`] += data.ids.disimpression;
			} else {
				puller[display] = [];
				// puller[`${display}target`] = 0;
				pullerData[`complete`].target += data.ids.disimpression;
				// puller[`${display}target`] += data.ids.disimpression;
				data.ids.display.map((x) => puller[display].push(x));
			}
		}
		if (video) {
			dass.push(video);
			if (puller[video]) {
				data.ids.video.map((x) => puller[video].push(x));
				pullerData[`complete`].target += data.ids.vidimpression;
				// puller[`${video}target`] += data.ids.vidimpression;
			} else {
				puller[video] = [];
				// puller[`${video}target`] = 0;
				// puller[`${video}target`] += data.ids.vidimpression;
				pullerData[`complete`].target += data.ids.vidimpression;
				data.ids.video.map((x) => puller[video].push(x));
			}
		}
		dass = [ ...new Set(dass) ];
		puller['das'] = dass;
		return puller;
	} else {
		console.log(respo);
		return 'error';
		// res.status(422).json({ error: 'somthing went wrong try again' });
	}
};

const idSplitter = async (respo, onDemand, podcast, audio, display, video, musicapps) => {
	if (respo && respo.length) {
		var ids = respo;
		var idsa = ids && ids.length ? ids.map((x) => mongoose.Types.ObjectId(x)) : [];
		var spliter = await adsetting.find({ campaignId: idsa }).select('type campaignId');
		var idsSet = {
			audio: [],
			video: [],
			display: [],
			podcast: [],
			musicapps: [],
			onDemand: []
		};
		var compoIds = [];
		spliter.map((i) => {
			if (i.type === 'audio') {
				idsSet.audio.push(i.campaignId);
				compoIds.push(i.campaignId);
			} else if (i.type === 'display') {
				idsSet.display.push(i.campaignId);
				compoIds.push(i.campaignId);
			} else if (i.type === 'video') {
				idsSet.video.push(i.campaignId);
				compoIds.push(i.campaignId);
			} else {
				idsSet.audio.push(i.campaignId);
				compoIds.push(i.campaignId);
			}
		});
		idsSet.audio = removeDuplicates(idsSet.audio);
		idsSet.display = removeDuplicates(idsSet.display);
		idsSet.video = removeDuplicates(idsSet.video);
		compoIds = removeDuplicates(compoIds);
		var leftids = arr_diff(ids, compoIds);
		// console.log(ids.length, compoIds.length, leftids.length);
		if (leftids && leftids.length) {
			leftids.map((z) => idsSet.audio.push(z));
		}
		// console.log({ leftids, idsSet });
		if (!(onDemand === podcast && podcast === musicapps)) {
			var mid = idsSet.audio.map((x) => mongoose.Types.ObjectId(x));
			// console.log(audio);
			let podcastSplit = await campaignwisereports.aggregate([
				{ $match: { campaignId: { $in: mid }, feed: { $in: [ 3, '3' ] } } },
				{ $group: { _id: '$campaignId' } }
			]);
			console.log(podcastSplit);
			podcastSplit.map((x) => idsSet.podcast.push(x._id));
			var rest = arr_diff(idsSet.audio, idsSet.podcast);
			rest = rest.map((x) => mongoose.Types.ObjectId(x));
			let musicSplit = await campaignwisereports
				.aggregate([
					{ $match: { campaignId: { $in: rest }, apppubid: { $in: musicids } } },
					{ $group: { _id: '$campaignId' } }
				])
				.catch((err) => console.log(err));
			console.log(musicSplit);
			musicSplit.map((x) => idsSet.musicapps.push(x._id));
			rest = arr_diff(rest, idsSet.musicapps);
			rest.map((x) => idsSet.onDemand.push(x));
			rest = arr_diff(rest, idsSet.onDemand);
			console.log(
				rest.length,
				idsSet.onDemand.length,
				idsSet.podcast.length,
				idsSet.audio.length,
				idsSet.musicapps.length
			);
		}
		var answer = {};
		var das = [];
		if (!(onDemand === podcast && podcast === musicapps)) {
			if (!answer[onDemand]) {
				answer[onDemand] = [];
				das.push(onDemand);
			}
			if (!answer[podcast]) {
				das.push(podcast);
				answer[podcast] = [];
			}
			if (!answer[musicapps]) {
				das.push(musicapps);
				answer[musicapps] = [];
			}
			idsSet.onDemand.map((x) => answer[onDemand].push(x));
			idsSet.podcast.map((x) => answer[podcast].push(x));
			idsSet.musicapps.map((x) => answer[musicapps].push(x));
		} else {
			if (!answer[audio]) {
				das.push(audio);
				answer[audio] = [];
			}
			idsSet.audio.map((x) => answer[audio].push(x));
		}
		if (display) {
			if (!answer[display]) {
				das.push(display);
				answer[display] = [];
			}
			idsSet.display.map((x) => answer[display].push(x));
		}
		if (video) {
			if (!answer[video]) {
				das.push(video);
				answer[video] = [];
			}
			idsSet.video.map((x) => answer[video].push(x));
		}
		answer['das'] = [ ...new Set(das) ];
		answer['ids'] = idsSet;
		return answer;
	} else {
		console.log('no ids found');
		return null;
	}
};

async function freqCampPubTest(chevk, chevk2) {
	console.log('start');
	var initialDate = '2021-11-01';
	var tempDate = '2021-11-01';
	console.log({ tempDate, chevk, chevk2 });
	campaignifareports
		.aggregate([
			{
				$project: {
					test: { $dateToString: { format: '%Y-%m-%d', date: '$createdOn' } },
					campaignId: '$campaignId',
					apppubid: '$apppubid',
					rtbType: '$rtbType',
					ifa: '$ifa'
				}
			},
			{ $match: { test: { $gte: chevk, $lt: chevk2 } } },
			{
				$group: {
					_id: { ifa: '$ifa', campaignId: '$campaignId', rtbType: '$rtbType', apppubid: '$apppubid' }
				}
			},
			{
				$group: {
					_id: { campaignId: '$_id.campaignId', rtbType: '$_id.rtbType', apppubid: '$_id.apppubid' },
					users: { $sum: 1 }
				}
			}
		])
		.allowDiskUse(true)
		.then(async (frequency) => {
			console.log(frequency.length, 'length');
			var i = frequency.length;
			frequency.map(async (fed) => {
				let alreadymade = await freqpublishreports
					.findOne({
						campaignId: mongoose.Types.ObjectId(fed._id.campaignId),
						appId: fed._id.apppubid,
						rtbType: fed._id.rtbType
					})
					.catch((err) => console.log(err));
				if (alreadymade) {
					if (alreadymade.createdOn === chevk2) {
						console.log('Already Done', i--);
						// alreadymade.users = fed.users;
						// alreadymade.createdOn = chevk2;
						// alreadymade
						// 	.save()
						// 	.then((resu) => {
						// 		console.log('updated', i--);
						// 	})
						// 	.catch((err) => console.log(err));
					} else {
						alreadymade.users += fed.users;
						alreadymade.createdOn = chevk2;
						alreadymade
							.save()
							.then((resu) => {
								console.log('updated', i--);
							})
							.catch((err) => console.log(err));
					}
				} else {
					const news = new freqpublishreports({
						campaignId: fed._id.campaignId,
						appId: fed._id.apppubid,
						rtbType: fed._id.rtbType,
						users: fed.users ? fed.users : 0,
						createdOn: chevk2
					});
					let asn = await news.save().catch((err) => console.log(err));
					if (asn) {
						console.log('created', i--);
					} else {
						console.log('err', i--, fed);
					}
				}
			});
			return frequency.length;
		})
		.catch((err) => {
			console.log(err);
			console.log('err');
			return err;
		});
}

async function freqPubTest(chevk, chevk2) {
	console.log('start');
	var initialDate = '2021-11-01';
	var tempDate = '2021-11-01';
	console.log({ tempDate, chevk, chevk2 });
	campaignifareports
		.aggregate([
			{
				$project: {
					test: { $dateToString: { format: '%Y-%m-%d', date: '$createdOn' } },
					apppubid: '$apppubid',
					rtbType: '$rtbType',
					ifa: '$ifa'
				}
			},
			{ $match: { test: { $gte: chevk, $lt: chevk2 } } },
			{
				$group: {
					_id: { ifa: '$ifa', rtbType: '$rtbType', apppubid: '$apppubid' }
				}
			},
			{
				$group: {
					_id: { rtbType: '$_id.rtbType', apppubid: '$_id.apppubid' },
					users: { $sum: 1 }
				}
			}
		])
		.allowDiskUse(true)
		.then(async (frequency) => {
			console.log(frequency.length, 'length');
			var i = frequency.length;
			frequency.map(async (fed) => {
				let alreadymade = await freqpubOnreports
					.findOne({
						appId: fed._id.apppubid,
						rtbType: fed._id.rtbType
					})
					.catch((err) => console.log(err));
				if (alreadymade) {
					if (alreadymade.createdOn === chevk2) {
						console.log('Already Done', i--);
						// alreadymade.users = fed.users;
						// alreadymade.createdOn = chevk2;
						// alreadymade
						// 	.save()
						// 	.then((resu) => {
						// 		console.log('updated', i--);
						// 	})
						// 	.catch((err) => console.log(err));
					} else {
						alreadymade.users += fed.users;
						alreadymade.createdOn = chevk2;
						alreadymade
							.save()
							.then((resu) => {
								console.log('updated', i--);
							})
							.catch((err) => console.log(err));
					}
				} else {
					const news = new freqpubOnreports({
						appId: fed._id.apppubid,
						rtbType: fed._id.rtbType,
						users: fed.users ? fed.users : 0,
						createdOn: chevk2
					});
					let asn = await news.save().catch((err) => console.log(err));
					if (asn) {
						console.log('created', i--);
					} else {
						console.log('err', i--, fed);
					}
				}
			});
			return frequency.length;
		})
		.catch((err) => {
			console.log(err);
			console.log('err');
			return err;
		});
}

async function freqCampTest(chevk, chevk2) {
	console.log('start');
	var initialDate = '2021-11-01';
	var tempDate = '2021-11-01';
	console.log({ tempDate, chevk, chevk2 });
	campaignifareports
		.aggregate([
			{
				$project: {
					test: { $dateToString: { format: '%Y-%m-%d', date: '$createdOn' } },
					campaignId: '$campaignId',
					rtbType: '$rtbType',
					ifa: '$ifa'
				}
			},
			{ $match: { test: { $gte: chevk, $lt: chevk2 } } },
			{
				$group: {
					_id: { ifa: '$ifa', campaignId: '$campaignId', rtbType: '$rtbType' }
				}
			},
			{
				$group: {
					_id: { campaignId: '$_id.campaignId', rtbType: '$_id.rtbType' },
					users: { $sum: 1 }
				}
			}
		])
		.allowDiskUse(true)
		.then(async (frequency) => {
			console.log(frequency.length, 'length');
			var i = frequency.length;
			frequency.map(async (fed) => {
				let alreadymade = await freqCampWise
					.findOne({
						campaignId: mongoose.Types.ObjectId(fed._id.campaignId),
						rtbType: fed._id.rtbType
					})
					.catch((err) => console.log(err));
				if (alreadymade) {
					if (alreadymade.createdOn === chevk2) {
						console.log('Already Done', i--);
						// alreadymade.users = fed.users;
						// alreadymade.createdOn = chevk2;
						// alreadymade
						// 	.save()
						// 	.then((resu) => {
						// 		console.log('updated', i--);
						// 	})
						// 	.catch((err) => console.log(err));
					} else {
						alreadymade.users += fed.users;
						alreadymade.createdOn = chevk2;
						alreadymade
							.save()
							.then((resu) => {
								console.log('updated', i--);
							})
							.catch((err) => console.log(err));
					}
				} else {
					const news = new freqCampWise({
						campaignId: fed._id.campaignId,
						rtbType: fed._id.rtbType,
						users: fed.users ? fed.users : 0,
						createdOn: chevk2
					});
					let asn = await news.save().catch((err) => console.log(err));
					if (asn) {
						console.log('created', i--);
					} else {
						console.log('err', i--, fed);
					}
				}
			});
			return frequency.length;
		})
		.catch((err) => {
			console.log(err);
			console.log('err');
			return err;
		});
}

async function freqoverall(chevk, chevk2) {
	console.log('start');
	let answertype = await campaignifareports
		.aggregate([
			{
				$project: {
					test: { $dateToString: { format: '%Y-%m-%d', date: '$createdOn' } },
					campaignId: '$campaignId',
					rtbType: '$rtbType',
					ifa: '$ifa'
				}
			},
			{ $match: { test: { $gte: chevk, $lt: chevk2 } } },
			{
				$group: {
					_id: { ifa: '$ifa', rtbType: '$rtbType' }
				}
			},
			{
				$group: {
					_id: { rtbType: '$_id.rtbType' },
					users: { $sum: 1 }
				}
			}
		])
		.allowDiskUse(true)
		.catch((err) => console.log(err));
	let answeroverall = await campaignifareports
		.aggregate([
			{
				$project: {
					test: { $dateToString: { format: '%Y-%m-%d', date: '$createdOn' } },
					campaignId: '$campaignId',
					rtbType: '$rtbType',
					ifa: '$ifa'
				}
			},
			{ $match: { test: { $gte: chevk, $lt: chevk2 } } },
			{
				$group: {
					_id: { ifa: '$ifa' }
				}
			},
			{
				$group: {
					_id: null,
					users: { $sum: 1 }
				}
			}
		])
		.allowDiskUse(true)
		.catch((err) => console.log(err));
	if (answertype.length > 1) {
		answertype.map(async (x) => {
			let samp = await overallfreqreport.findOne({ rtbType: x._id.rtbType }).catch((err) => console.log(err));
			if (samp) {
				if (samp.createdOn === chevk2) {
					console.log('Already Done', x._id.rtbType);
				} else {
					if (typeof samp.users === 'number') {
						samp.users += x.users;
					} else {
						samp.users = x.users;
					}
					samp.save().then((ress) => {
						console.log('updated', x._id.rtbType);
					});
				}
			} else {
				const gonasave = new overallfreqreport({
					createdOn: chevk2,
					users: x.users,
					rtbType: x._id.rtbType
				});
				gonasave.save().then((cre) => console.log('created', x._id.rtbType)).catch((err) => console.log(err));
			}
		});
	}
	if (answeroverall.length > 0) {
		let getover = await overallfreqreport.findOne({ rtbType: 'summary' }).catch((err) => console.log(err));
		if (getover) {
			if (getover.createdOn === chevk2) {
				console.log('Already Done, summary');
			} else {
				if (typeof getover.users === 'number') {
					getover.users += answeroverall[0].users;
				} else {
					getover.users = answeroverall[0].users;
				}
				getover.save().then((ress) => {
					console.log('updated, x.summary');
				});
			}
		} else {
			const gonasave = new overallfreqreport({
				createdOn: chevk2,
				users: answeroverall[0].users,
				rtbType: 'summary'
			});
			gonasave.save().then((cre) => console.log('created, summary')).catch((err) => console.log(err));
		}
	}
}

// DailyReportMailer();
async function DailyReportMailer() {
	var users = await admin.find({ usertype: 'client' }).select('email').catch((err) => console.log(err));
	// const HTTP = new XMLHttpRequest();
	// HTTP.open('put', 'http://23.98.35.74:5000/streamingads/groupedsingleClient');
	var cdate, cmonth, cyear;
	var cdatee = new Date(new Date());
	cdate = cdatee.getDate();
	cdate = cdate < 10 ? '0' + cdate : cdate;
	cmonth = cdatee.getMonth() + 1;
	cmonth = cmonth < 10 ? '0' + cmonth : cmonth;
	cyear = cdatee.getFullYear();
	var chevk2 = `${cyear}-${cmonth}-${cdate}`;
	for (var i = 0; i < users.length; i++) {
		var mail = users[i].targetemail ? users[i].targetemail : [];
		var id = users[i]._id;
		console.log(mail, id);
		let campaignss = await campaignClient.find({ userid: id }).catch((err) => console.log(err));
		try {
			console.log(campaignss.length);
			campaignss.map(async (x) => {
				console.log(x.type);
				var endStae = new Date() > new Date(x.endDate);
				if (endStae) {
					console.log('campaign completed');
				} else if (x.type === 'campaign' && x.targetemail && x.targetemail.length) {
					let formdata = await StreamingAds.aggregate([
						{
							$project: {
								id: '$_id',
								AdTitle: { $toLower: '$AdTitle' }
							}
						},
						{
							$match: {
								AdTitle: { $regex: x.searchName.toLowerCase() }
							}
						},
						{
							$group: {
								_id: null,
								id: { $push: '$id' },
								Adtitle: { $push: '$AdTitle' }
							}
						}
					]);
					// console.log(formdata);
					if (!(formdata && formdata[0] && formdata[0].id && formdata[0].id.length)) {
						console.log(formdata, x.searchName);
						return;
					}
					let mashh = await idSplitter(
						formdata[0].id,
						x.onDemand,
						x.podcast,
						x.audio,
						x.display,
						x.video,
						x.musicapps
					);
					// console.log(mashh);
					var totaldataCount = {};
					for (var j = 0; j < mashh.das.length; j++) {
						var idsa = mashh[mashh.das[j]]
							? mashh[mashh.das[j]].map((x) => mongoose.Types.ObjectId(x))
							: [];
						// if(mashh.ids.video)
						let totalcoms = await campaignwisereports.aggregate([
							{ $match: { campaignId: { $in: idsa } } },
							{
								$group: {
									_id: { ssp: '$ssp' },
									impressions: { $sum: '$impression' },
									complete: { $sum: '$complete' },
									clicks: { $sum: '$CompanionClickTracking' },
									clicks1: { $sum: '$SovClickTracking' },
									thirdQuartile: { $sum: '$thirdQuartile' },
									start: { $sum: '$start' },
									firstQuartile: { $sum: '$firstQuartile' },
									midpoint: { $sum: '$midpoint' }
								}
							}
						]);
						var totalcom = { impressions: 0, complete: 0, clicks: 0, clicks1: 0, onlineImpressions: 0 };
						// totalcoms = totalcoms && totalcoms[0];
						if (!totalcoms.length) {
							// console.log({ idsa, mashh, name: x.searchName });
							continue;
						}
						totalcoms.map((x) => {
							totalcom.impressions += x.impressions;
							totalcom.clicks += x.clicks;
							totalcom.clicks1 += x.clicks1;
							if (x && (x._id.ssp === 'Adswizz' || x._id.ssp === 'Rubicon' || x._id.ssp === 'Triton')) {
								totalcom.complete += x.complete;
								totalcom.onlineImpressions += x.impressions;
							}
						});
						// console.log(x.searchName, totalcoms, totalcom);
						// continue;
						let reportdaily = await campaignwisereports.aggregate([
							{ $match: { campaignId: { $in: idsa } } },
							{
								$group: {
									_id: {
										date: '$date',
										ssp: '$ssp',
										campaignId: '$campaignId',
										apppubid: '$apppubid'
									},
									impressions: { $sum: '$impression' },
									complete: { $sum: '$complete' },
									firstQuartile: { $sum: '$firstQuartile' },
									clicks: { $sum: '$CompanionClickTracking' }
								}
							},
							{
								$group: {
									_id: { date: '$_id.date' },
									data: {
										$push: {
											impressions: '$impressions',
											firstQuartile: '$firstQuartile',
											complete: '$complete',
											clicks: '$clicks',
											ssp: '$_id.ssp',
											campaignId: '$_id.campaignId',
											apppubid: '$_id.apppubid'
										}
									}
								}
							},
							{
								$project: {
									date: '$_id.date',
									data: '$data',
									_id: 0
								}
							},
							{ $sort: { date: -1 } }
						]);
						var videoTest = mashh.ids.video ? mashh.ids.video.map((x) => x.toString()) : [];
						if (mashh.das[j].toLowerCase().includes('audio')) {
							reportdaily.map((pi) => {
								pi.impressions = 0;
								pi.onlineImpressions = 0;
								pi.bannerImpressions = 0.0;
								pi.complete = 0;
								pi.clicks = 0;
								pi.data &&
									pi.data.map((z) => {
										pi.impressions += z.impressions;
										pi.clicks += z.clicks;
										if (z && (z.ssp === 'Adswizz' || z.ssp === 'Rubicon' || z.ssp === 'Triton')) {
											pi.complete += z.complete;
											pi.onlineImpressions += z.impressions;
										}
										// console.log(specific1banner.includes(z.apppubid));
										// if (videoTest.length && videoTest.includes(z.campaignId.toString())) {
										// 	console.log(mashh, z.campaignId);
										// }
										// console.log(videoTest.includes(z.campaignId.toString()));
										if (
											videoTest.includes(z.campaignId.toString()) ||
											specific1banner.includes(z.apppubid)
										) {
											pi.bannerImpressions += z.impressions;
										} else if (gannabanner.includes(z.apppubid)) {
											pi.bannerImpressions += z.impressions * 0.25;
										} else {
											pi.bannerImpressions += z.impressions * 0.75;
										}
										// console.log(pi.bannerImpressions);
									});
							});
						} else {
							reportdaily.map((pi) => {
								pi.impressions = 0;
								pi.onlineImpressions = 0;
								pi.complete = 0;
								pi.clicks = 0;
								pi.data &&
									pi.data.map((z) => {
										pi.impressions += z.impressions;
										pi.clicks += z.clicks;
										if (z && (z.ssp === 'Adswizz' || z.ssp === 'Rubicon' || z.ssp === 'Triton')) {
											pi.complete += z.complete;
											pi.onlineImpressions += z.impressions;
										}
									});
							});
						}

						// console.log(totalcom, x.searchName, reportdaily.length, 'cooo');
						reportdaily = reportdaily.filter((x) => x.impressions >= 10);
						var totImp = 0,
							totOniImp = 0,
							totCli = 0,
							totCom = 0,
							totBan = 0;
						var totImp1 = 0,
							totCli1 = 0,
							totBan1 = 0,
							totCom1 = 0;
						reportdaily.map((dax) => {
							totOniImp += dax.onlineImpressions;
							totBan += dax.bannerImpressions;
							totImp += dax.impressions;
							totCli += dax.clicks;
							totCom += dax.complete;
						});
						// console.log(totalcom);
						// totalcom.complete = totalcom.complete / totalcom.onlineImpressions * totalcom.impressions;
						reportdaily.map((dax) => {
							dax.impressions = totImp ? Math.round(dax.impressions / totImp * totalcom.impressions) : 0;
							dax.bannerImpressions =
								totImp && dax.bannerImpressions
									? Math.round(dax.bannerImpressions / totImp * totalcom.impressions)
									: 0;
							dax.onlineImpressions = dax.onlineImpressions ? Math.round(dax.onlineImpressions) : 0;
							dax.clicks = totCli
								? Math.round(dax.clicks / totCli * (totalcom.clicks + totalcom.clicks1))
								: 0;
							dax.complete = dax.complete ? Math.round(dax.complete) : 0;
							totImp1 += dax.impressions;
							totCli1 += dax.clicks;
							totCom1 += dax.complete;
							totBan1 += dax.bannerImpressions ? dax.bannerImpressions : 0;
						});
						if (totImp > totImp1 || totCli - totCli1 > 0 || totCom - totCom1 > 0)
							reportdaily.push({
								date: '',
								impressions: totImp - totImp1 > 0 ? totImp - totImp1 : 0,
								clicks: totCli - totCli1 > 0 ? totCli - totCli1 : 0,
								complete: totCom - totCom1 > 0 ? totCom - totCom1 : 0
							});
						var dum = reportdaily.filter((x) => x.date === chevk2);
						if (dum.length) {
							reportdaily = reportdaily.filter((x) => x.date != chevk2);
							var tempImp = 0,
								tempOniImp = 0,
								tempBanImp = 0,
								tempCli = 0,
								tempCom = 0;
							dum.map((zx) => {
								tempImp += zx.impressions;
								tempOniImp += zx.onlineImpressions;
								tempBanImp += zx.bannerImpressions;
								tempCli += zx.clicks;
								tempCom += zx.complete;
							});
							totImp -= tempImp;
							totOniImp -= tempOniImp;
							totBan1 -= tempBanImp;
							totCli -= tempCli;
							totCom -= tempCom;
						}
						reportdaily.push({
							date: 'Total',
							onlineImpressions: totOniImp,
							bannerImpressions: totBan1,
							impressions: totImp,
							clicks: totCli,
							complete: totCom
						});
						totaldataCount[mashh.das[j]] = reportdaily;
						totaldataCount[`${mashh.das[j]}das`] = totalcom;
						// totaldataCount[`${mashh.das[j]}das2`] = totalcoms;
						// console.log(totalcom, totalcoms, totImp, totCli, totCom, reportdaily);
						// ses.sendEmail()
					}
					// if (x.searchName.indexOf('tea') > -1) {
					// 	console.log(x.searchName, mashh, totaldataCount);
					// }

					console.log(x.searchName, mashh, totaldataCount);
					var params = {
						Destination: {
							BccAddresses: [],
							CcAddresses: [],
							ToAddresses: x.targetemail
							// ToAddresses: [ 'saiharishmedam@gmail.com' ]
						},
						Message: {
							Body: {
								Html: {
									Charset: 'UTF-8',
									Data: `
									<head>
									<style>
									table {
									font-family: arial, sans-serif;
									border-collapse: collapse;
									width: 100%;
									}

									td, th {
									border: 1px solid #dddddd;
									text-align: center;
									padding: 4px;
									}

									tr:nth-child(even) {
									background-color: #dddddd;
									}
									</style>
									</head>
									<body>

									${mashh.das
										.map((xas) => {
											if (totaldataCount[xas] && totaldataCount[xas].length)
												return `
											<div>
												<h2>${xas}</h2>
												<table>
													<tr>
														<th>Date</th>
														<th>Impressions</th>
														${xas.toLowerCase().indexOf('audio') > -1 ? ` <th>Banner </th>` : ``}
														<th>Clicks</th>
														<th>CTR</th>
														${!(xas === 'Display' || xas === 'display') ? ` <th>LTR</th>` : ``}
													</tr>
													${totaldataCount[xas] && totaldataCount[xas].length
														? totaldataCount[xas]
																.map((dalrep) => {
																	return `<tr>
																<td>${dalrep.date ? dataformatchanger(dalrep.date) : ''}</td>
																<td>
																	${dalrep.impressions}
																</td>
																${xas.toLowerCase().indexOf('audio') > -1
																	? `<td>
																	${dalrep.bannerImpressions}
																	</td>`
																	: ``}
																<td>${dalrep.clicks}</td>
																<td>
																	${Math.round(dalrep.clicks * 100 * 100 / dalrep.impressions) / 100}%
																</td>
																${!(xas === 'Display' || xas === 'display')
																	? `<td>
																		${Math.round(dalrep.complete * 100 * 100 / dalrep.onlineImpressions) / 100}%
																	</td>`
																	: ``}
															</tr>`;
																})
																.join('')
														: ''}
												</table>
											</div>`;
										})
										.join('')}

									</body>
									`
								},
								Text: {
									Charset: 'UTF-8',
									Data: 'This is the message if in text if no data found.'
								}
							},
							Subject: {
								Charset: 'UTF-8',
								Data: `${x.campaignName} daily report`
							}
						},
						// ReplyToAddresses: [],
						// ReturnPath: '',
						// ReturnPathArn: '',
						// SourceArn: ''
						Source: email
					};
					ses.sendEmail(params, function(err, data) {
						if (err)
							console.log(err, err.stack); // an error occurred
						else console.log(data); // successful response
						/*
						data = {
						MessageId: "EXAMPLE78603177f-7a5433e7-8edb-42ae-af10-f0181f34d6ee-000000"
						}
						 */
					});

					// console.log(formdata);
					// console.log(
					// 	idfindspilter(x.searchName, x.onDemand, x.podcast, x.audio, x.display, x.video, x.musicapps)
					// );
					// let campass = await request(
					// 	{
					// 		url: 'http://23.98.35.74:5000/streamingads/groupedsingleClient',
					// 		method: 'put',
					// 		headers: {
					// 			'Content-Type': 'application/json',
					// 			Authorization: 'Bearer ' + JWT
					// 		},
					// 		body: JSON.stringify({
					// 			adtitle: x.searchName,
					// 			podcast: x.podcast,
					// 			onDemand: x.onDemand,
					// 			musicapps: x.musicapps
					// 		})
					// 	},
					// 	function(error, response, body) {
					// 		console.log('error', error);
					// 		console.log('response', response);
					// 		console.log('body', body);
					// 	}
					// );
					// fetch('/streamingads/groupedsingleClient', {
					// 	method: 'put',
					// 	headers: {
					// 		'Content-Type': 'application/json',
					// 		Authorization: 'Bearer ' + JWT
					// 	},
					// 	body: JSON.stringify({
					// 		adtitle: x.searchName,
					// 		podcast: x.podcast,
					// 		onDemand: x.onDemand,
					// 		musicapps: x.musicapps
					// 	})
					// })
					// 	.then((res) => res.json())
					// 	.then((resul) => {
					// 		console.log(resul);
					// 	})
					// 	.catch((err) => console.log(err));
				} else if (x.type === 'bundle') {
					//
				}
			});
		} catch (e) {
			console.log(e);
		}
	}
}

router.put('/campaignPrior', adminauth, async (req, res) => {
	const { date } = req.body;
	var datee = new Date(date).toISOString();
	let ans = await datareturner(datee);
	res.json(ans);
});

router.put('/freq', adminauth, async (req, res) => {
	const { date, date2 } = req.body;
	let data = await freqCampPubTest(date, date2);
	res.json(data);
});

router.put('/freqsum', adminauth, async (req, res) => {
	const { date, date2 } = req.body;
	let data = await freqoverall(date, date2);
	res.json(data);
});

router.put('/freqonlypub', adminauth, async (req, res) => {
	const { date, date2 } = req.body;
	let data = await freqPubTest(date, date2);
	res.json(data);
});

router.put('/freqonlycamp', adminauth, async (req, res) => {
	const { date, date2 } = req.body;
	let data = await freqCampTest(date, date2);
	res.json(data);
});

router.get('/autoMailer', adminauth, async (req, res) => {
	// const { date, date2 } = req.body;
	DailyReportMailer();
	res.json('started');
});

router.put('/idssplitfinder', adminauth, async (req, res) => {
	const { campaignId } = req.body;
	let data = await idSplitter(campaignId, 'on', 'on', 'do', 'do', 'do', 'mo');
	res.json(data);
});

router.put('/campaignPriorMailer', adminauth, async (req, res) => {
	pacingMailer();
	res.json('sent');
});

const expo = {
	func1: datareturner,
	func2: pacingMailer,
	func3: DailyReportMailer,
	freqover: freqoverall,
	freqpub: freqCampPubTest,
	freqonlypub: freqPubTest,
	freqonlycamp: freqCampTest,
	route: router
};
module.exports = expo;
