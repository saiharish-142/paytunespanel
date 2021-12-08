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
const campaignwisereports = mongoose.model('campaignwisereports');
const campaignreportsSum = mongoose.model('campaignreportsSum');
var aws = require('aws-sdk');
aws.config.loadFromPath(__dirname + '/config.json');
const ses = new aws.SES();
var email = 'support@paytunes.in';

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
				{
					$project: {
						testStart: { $dateToString: { format: '%Y-%m-%d', date: '$startDate' } },
						testEnd: { $dateToString: { format: '%Y-%m-%d', date: '$endDate' } },
						campaignId: '$campaignId',
						targetImpression: '$targetImpression',
						type: '$type'
					}
				},
				{ $match: { testStart: { $gte: datee }, testEnd: { $gte: chevk } } }
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
			console.log({ balancedays, completedays, tod, avgach });
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
				check.balanceimpression = balance;
				check.avgreq = avgreq;
				check.avgach = avgach;
				check.avgach = avgach;
				check.createdOn = chevk2;
				check
					.save()
					.then((result) => {
						console.log(result, 'updated');
					})
					.catch((err) => {
						console.log(err);
					});
			} else {
				const newbie = new campaignreportsSum({
					campaignId: ids[j].campaignId,
					rtbType: ids[j].type,
					noofDays: totaldays,
					balanceDays: balancedays,
					targetImpression: target,
					impression: impress,
					balanceimpression: balance,
					avgreq: avgreq,
					avgach: avgach,
					createdOn: chevk2,
					startDate: ids[j].testStart,
					endDate: ids[j].testEnd
				});
				newbie
					.save()
					.then((result) => {
						console.log(result, 'completed');
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

async function pacingMailer() {
	var cdate, cmonth, cyear;
	var cdatee = new Date(new Date());
	cdate = cdatee.getDate();
	cdate = cdate < 10 ? '0' + cdate : cdate;
	cmonth = cdatee.getMonth() + 1;
	cmonth = cmonth < 10 ? '0' + cmonth : cmonth;
	cyear = cdatee.getFullYear();
	var chevk2 = `${cyear}-${cmonth}-${cdate}`;
	let data = await campaignreportsSum
		.find({ createdOn: chevk2 })
		.populate({ path: 'campaignId', select: 'AdTitle' })
		.catch((err) => console.log(err));
	console.log(data.length);
	var params = {
		Destination: {
			BccAddresses: [],
			CcAddresses: [],
			ToAddresses: [ 'fin-ops@paytunes.in' ]
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
										<th>Impressions</th>
										<th>Averge Required</th>
										<th>Averge Achieved</th>
										<th>Balance Impression</th>
										<th>Balance Days</th>
									</tr>
									${data
										.map((dalrep) => {
											return `<tr>
												<td>${dalrep.campaignId ? dalrep.campaignId.AdTitle : ''}</td>
												<td>${dalrep.rtbType ? dalrep.rtbType : ''}</td>
												<td>${dalrep.startDate ? dalrep.startDate : ''}</td>
												<td>${dalrep.endDate ? dalrep.endDate : ''}</td>
												<td>${dalrep.noofDays ? dalrep.noofDays : 0}</td>
												<td>${dalrep.targetimpression ? dalrep.targetimpression : 0}</td>
												<td>${dalrep.impression ? dalrep.impression : 0}</td>
												<td>${dalrep.avgreq ? Math.round(dalrep.avgreq * 100) / 100 : 0}</td>
												<td>${dalrep.avgach ? Math.round(dalrep.avgach * 100) / 100 : 0}</td>
												<td>${dalrep.balanceimpression ? dalrep.balanceimpression : 0}</td>
												<td>${dalrep.balanceDays ? dalrep.balanceDays : 0}</td>
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

router.put('/campaignPrior', adminauth, async (req, res) => {
	const { date } = req.body;
	var datee = new Date(date).toISOString();
	let ans = await datareturner(datee);
	res.json(ans);
});

router.put('/campaignPrior', adminauth, async (req, res) => {
	pacingMailer();
	res.json('sent');
});

const expo = { func1: datareturner, func2: pacingMailer, route: router };
module.exports = expo;
