const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Rtbrequest = mongoose.model('rtbrequests');
const adminauth = require('../authenMiddleware/adminauth');
const Reqreport = mongoose.model('reqreport');
const Resreport = mongoose.model('resreport');
const EpisodeModel = require('../models/episodemodel');
const EpisodeModel2 = require('../models/episodemodel2');
const CategoryReports2 = require('../models/categoryreports2');
// const Campaignwisereports=require('../models/campaignwisereports.model')
const SpentReport = mongoose.model('spentreports');
const Campaignwisereports = mongoose.model('campaignwisereports');
let{db1,db2}=require('../db')

router.get('/rtbrs', adminauth, (req, res) => {
	Rtbrequest.find()
		.then((result) => {
			res.json(result);
		})
		.catch((err) => {
			console.log(err);
		});
});

router.post('/addrtbr', adminauth, (req, res) => {
	const { bidreq, bidid, imp, app, device, user, at, tmax, source, ext, Type, bidstatus } = req.body;
	if (!Type || !imp || !app || !bidreq || !bidid || !user) {
		return res.status(422).json({ error: 'Enter all the fields' });
	}
	const rtb = new Rtbrequest({
		bidreq,
		bidid,
		imp,
		app,
		device,
		user,
		at,
		tmax,
		source,
		ext,
		Type,
		bidstatus
	});
	rtb
		.save()
		.then((response) => {
			res.json(response);
		})
		.catch((err) => console.log(err));
});

router.post('/get_reqreports_via_ssp', adminauth, async (req, res) => {
	try {
		const ssp = req.body.ssp;
		console.log(1);
		const reports = await Reqreport.aggregate([
			{ $match: { ssp } },
			{
				$group: {
					_id: { Date: '$date' },
					requests: {
						$sum: '$requests'
					}
				}
			}
		]);

		res.status(200).json(reports);
	} catch (err) {
		res.status(400).json({ error: err.message });
		console.log(err.message);
	}
});

router.post('/get_resreports_via_ssp', adminauth, async (req, res) => {
	try {
		const ssp = req.body.ssp;
		const reports = await Resreport.aggregate([
			{ $match: { ssp } },
			// {$lookup:{
			//     from:'streamingads',
			//     localField:'campaignId',
			//     foreignField:'_id',
			//     as:'campaign_details'
			// }},

			//  {$unwind:'$campaign_details'},
			// {$lookup:{
			//     from:'publisherapps',
			//     localField:'appId',
			//     foreignField:'AppId',
			//     as:'app_details'
			// }},
			// {$unwind:'$app_details'},
			{
				$group: {
					_id: { Date: '$date' },
					requests: {
						$sum: '$ads'
					}
				}
			},
			{ $sort: { '_id.Date': -1 } },
			{ $match: { '_id.Date': { $gt: '2021-06-30' } } }
			// {$project:{
			//     rtbType:1,
			//     ads:"$requests",
			//     //requests,
			//     campaign_name:"$campaign_details.AdTitle",
			//     app_name:"$app_details.AppName"
			// }}
		]);
		res.status(200).json(reports);
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
});

router.get('/get_bids_won', adminauth, async (req, res) => {
	try {
		const result = await SpentReport.aggregate([
			{
				$facet: {
					Triton_Data: [
						{ $match: { ssp: 'Triton' } },
						{
							$group: {
								_id: { Date: '$date' },
								impressions: { $sum: '$impression' }
							}
						},
						{ $match: { '_id.Date': { $gt: '2021-06-30' } } }
					],
					Rubicon_Data: [
						{ $match: { ssp: 'Rubicon' } },
						{
							$group: {
								_id: { Date: '$date' },
								impressions: { $sum: '$impression' }
							}
						},
						{ $match: { '_id.Date': { $gt: '2021-06-30' } } }
					]
				}
			}

			//     {$group:{_id:{Date:"$date"},
			//     impressions:{$sum:"$impression"}
			// }}
		]);
		res.status(200).json(result);
	} catch (err) {
		console.log(err.message);
		res.status(400).json({ error: err.message });
	}
});

router.get('/get_bids_won_publisher', adminauth, async (req, res) => {
	try {
		// const dat=new Date().toISOString()
		// const t=dat.split('T')
		// const date=t[0]
		const result = await Campaignwisereports.aggregate([
			{ $group: { _id: { Date: '$date', appId: '$appId' }, impressions: { $sum: '$impression' } } },
			//{$match:{ '_id.Date':date}},

			{ $addFields: { new_appid: { $toObjectId: '$_id.appId' } } },
			{
				$lookup: {
					from: 'publisherapps',
					localField: 'new_appid',
					foreignField: '_id',
					as: 'app_details'
				}
			},
			{ $unwind: { path: '$app_details', preserveNullAndEmptyArrays: true } },

			{
				$project: {
					appName: '$app_details.AppName',
					date: '$_id.Date',
					impressions: 1
				}
			},
			{ $sort: { impressions: -1 } },
			{ $match: { '_id.Date': { $gt: '2021-06-30' } } }
		]);
		res.status(200).json(result);
	} catch (err) {
		console.log(err.message);
		res.status(400).json({ error: err.message });
	}
});

router.get('/spent_data_via_date', adminauth, async (req, res) => {
	try {
		const result = await SpentReport.aggregate([
			{
				$facet: {
					Triton_Data: [
						{ $match: { ssp: 'Triton' } },
						{
							$group: {
								_id: { Date: '$date' },
								total_spent: { $sum: '$totalSpent' }
							}
						}
					],
					Rubicon_Data: [
						{ $match: { ssp: 'Rubicon' } },
						{
							$group: {
								_id: { Date: '$date' },
								total_spent: { $sum: '$totalSpent' }
							}
						}
					]
				}
			}
		]);
		console.log(result[0].Triton_Data);
		res.status(200).json(result);
	} catch (err) {
		res.status(400).json({ error: err.message });
		console.log(err.message);
	}
});

router.post('/getepisodewise_report', adminauth, async (req, res) => {
	try {
		let startdate = new Date();
		startdate.setDate(01);
		startdate.setMonth(09);
		startdate.setFullYear(2021);

		let date = new Date();
		let days = Math.round((date.getTime() - startdate.getTime()) / 86400000);
		if (days === 0) {
			days = 1;
		}

		const result = await EpisodeModel2.aggregate([
			{
				$group: {
					_id: { episodename: '$episodename', category: '$category', language: "$language" },
					publisher: { $addToSet: '$publisher' },
					request: { $sum: '$requests' },
					displayname: { $first: '$displayname' },
					hostPossibility: { $first: '$hostPossibility' },
					tier1: { $first: '$tier1' },
					tier2: { $first: '$tier2' },
					tier3: { $first: '$tier3' },
					new_taxonamy: { $first: '$new_taxonamy' },
					publishername: { $first: '$publishername' }
				}
			},
			{ $addFields: { avgrequest: { $divide: ['$request', days] } } },
			{
				$project: {
					episodename: '$_id.episodename',
					category: '$_id.category',
					language: "$_id.language",
					publisher: "$publisher",
					request: '$request',
					avgrequest: '$avgrequest',
					displayname: '$displayname',
					hostPossibility: '$hostPossibility',
					tier1: '$tier1',
					tier2: '$tier2',
					tier3: '$tier3',
					new_taxonamy: '$new_taxonamy',
					publishername: '$publishername'
				}
			},
			{ $sort: { avgrequest: -1 } }
		]);
		res.status(200).json(result);
	} catch (err) {
		res.status(400).json({ error: err.message });
		console.log(err.message);
	}
});

router.post('/getcategory', adminauth, async (req, res) => {
	try {
		let { category } = req.body;
		const match = await CategoryReports2.findOne({
			$or: [{ category }, { new_taxonamy: category }]
		});
		if (!match) {
			res.status(200).json({ category: '' });
		}
		res.status(200).json({ category: match.tier1 });
	} catch (err) {
		res.status(400).json({ error: err.message });
		console.log(err.message);
	}
});

router.post('/editepisodedata', adminauth, async (req, res) => {
	try {
		//data.make_model=data.make_model.toLowerCase()

		let { _id, publisher, episodename, category, requests, displayname, hostPossibility, publishername } = req.body;
		let updates = {
			displayname,
			hostPossibility,
			publishername,
			episodename
		};
		const updated = await EpisodeModel2.findOneAndUpdate({ episodename, category }, { $set: updates });
		if (!updated) {
			return res.status(400).json({ error: "Couldn't Update !" });
		}

		res.status(200).json('Updated Successfuly!');
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
});

router.get(
	'/tvdata',
	adminauth,
	async (req, res) => {
		try {
			const TvRequest=db2.model('tvrequests',require('../models/tvrequests'));
			let results = await TvRequest.aggregate([
				{
					$group: {
						_id: { date: "$date", publisherid: "$publisherid" },
						rtbType: { $first: "$rtbType" },
						ssp: { $first: "$ssp" },
						request: { $sum: "$request" }
					}
				},
				{
					$lookup: {
						from: 'apppublishers',
						localField: '_id.publisherid',
						foreignField: 'publisherid',
						as: 'app_details'
					}
				},
				{
					$project: {
						date: "$_id.date",
						publisherid: "$_id.publisherid",
						rtbType: 1,
						ssp: 1,
						request: 1,
						app1:{$first:"$app_details"}
					}
				},
				{
					$project: {
						date: 1,
						publisherid: 1,
						rtbType: 1,
						ssp: 1,
						request: 1,
						publishername:'$app1.publishername'
					}
				},
				{ $sort: { date: -1 } }
			]).allowDiskUse(true);

			res.status(200).json(results);
		} catch (err) {
			res.status(400).json({ error: err.message });
		}
	}
)

module.exports = router;
