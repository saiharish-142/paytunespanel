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
				{ $match: { campaignId: { $in: idsa } } },
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
			var totaldays = (end - start) / (1000 * 3600 * 24);
			var balancedays = 0;
			var completedays = 0;
			var avgach = 0;
			if (end > chevk) {
				balancedays = (end - chevk) / (1000 * 3600 * 24);
				completedays = (chevk - start) / (1000 * 3600 * 24);
			}
			if (completedays > 0) {
				avgach = impress / completedays;
			} else {
				avgach = impress / totaldays;
			}
			if (!impress && !avgach) {
				avgach = 0;
			}
			var impress = impreset[ids[j].campaignId];
			var target = ids[j].targetImpression ? parseInt(ids[j].targetImpression) : 0;
			var balance = target - impress;
			var avgreq = target / totaldays;
			let check = await campaignreportsSum
				.findOne({ campaignId: ids[j].campaignId, rtbType: ids[j].type })
				.catch((err) => console.log(err));
			if (check) {
				check.impression = impress;
				check.balanceDays = balancedays;
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

router.put('/campaignPrior', adminauth, async (req, res) => {
	const { date } = req.body;
	var datee = new Date(date).toISOString();
	let ans = await datareturner(datee);
	res.json(datee);
});

const expo = { func1: datareturner, route: router };
module.exports = expo;
