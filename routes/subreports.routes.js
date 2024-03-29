const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const phonemakereports = mongoose.model('phonemakereports');
const zipreports = mongoose.model('zipreports');
const uniqueuserreports = mongoose.model('uniqueuserreports');
const regionreports = mongoose.model('regionreports');
const pptypereports = mongoose.model('pptypereports');
const platformtypereports = mongoose.model('platformtypereports');
const citylanguagereports = mongoose.model('citylanguagereports');
const phonemodelreports = mongoose.model('phonemodelreports');
const spentreports = mongoose.model('spentreports');
const phonemodel2 = mongoose.model('phonemodel2reports');
const Zipreports2 = mongoose.model('zipreports2');
const CategoryReports2 = require('../models/categoryreports2');
const Serverreport = require('../models/serverreport');
const Campaignwisereports = mongoose.model('campaignwisereports');
const frequencyreports = mongoose.model('frequencyreports');
const freqCampWise = mongoose.model('freqCampWise');
const overallfreqreport = mongoose.model('overallfreqreport');
// const CategoryReports = mongoose.model('categoryreports');
const CategoryReports = require('../models/categoryreports');
const adminauth = require('../authenMiddleware/adminauth');
const categoryreports = require('../models/categoryreports');
const publisherwiseConsole = mongoose.model('publisherwiseConsole');
const frequencyConsole = mongoose.model('frequencyConsole');
const freqpublishreports = mongoose.model('freqpublishreports');
const uareqreports = mongoose.model('uareqreports');
const zipsumreport = mongoose.model('zipsumreport');
const adsetting = mongoose.model('adsetting');

router.get('/phonemake', adminauth, (req, res) => {
	phonemakereports
		.find()
		.then((result) => {
			res.json(result);
		})
		.catch((err) => res.status(422).json(err));
});

router.get('/spentrepo', adminauth, (req, res) => {
	spentreports
		.find()
		.then((result) => {
			res.json(result);
		})
		.catch((err) => res.status(422).json(err));
});

router.get('/zipwise', adminauth, (req, res) => {
	zipreports
		.find()
		.then((result) => {
			res.json(result);
		})
		.catch((err) => res.status(422).json(err));
});

router.get('/unique', adminauth, (req, res) => {
	uniqueuserreports
		.find()
		.then((result) => {
			res.json(result);
		})
		.catch((err) => res.status(422).json(err));
});

router.get('/regionwise', adminauth, (req, res) => {
	regionreports
		.find()
		.then((result) => {
			res.json(result);
		})
		.catch((err) => res.status(422).json(err));
});

router.get('/pptypewise', adminauth, (req, res) => {
	pptypereports
		.find()
		.then((result) => {
			res.json(result);
		})
		.catch((err) => res.status(422).json(err));
});

router.get('/platformtypewise', adminauth, (req, res) => {
	platformtypereports
		.find()
		.then((result) => {
			res.json(result);
		})
		.catch((err) => res.status(422).json(err));
});

router.get('/citylanguagewise', adminauth, (req, res) => {
	citylanguagereports
		.find()
		.then((result) => {
			res.json(result);
		})
		.catch((err) => res.status(422).json(err));
});

router.get('/phonemodelwise', adminauth, (req, res) => {
	phonemodelreports
		.find()
		.then((result) => {
			res.json(result);
		})
		.catch((err) => res.status(422).json(err));
});

router.put('/phonemakebycampids', adminauth, (req, res) => {
	const { campaignId } = req.body;
	const dumd = [];
	var ids = campaignId ? campaignId.map((id) => mongoose.Types.ObjectId(id)) : dumd;
	phonemakereports
		.aggregate([
			{ $match: { campaignId: { $in: ids } } },
			{
				$project: {
					phoneMake: { $toLower: '$phoneMake' },
					campaignId: '$campaignId',
					impression: '$impression',
					CompanionClickTracking: '$CompanionClickTracking',
					SovClickTracking: '$SovClickTracking',
					start: '$start',
					midpoint: '$midpoint',
					thirdQuartile: '$thirdQuartile',
					complete: '$complete',
					createdOn: '$createdOn'
				}
			},
			{
				$group: {
					_id: { phoneMake: '$phoneMake' },
					campaignId: { $push: '$campaignId' },
					impression: { $sum: '$impression' },
					CompanionClickTracking: { $sum: '$CompanionClickTracking' },
					SovClickTracking: { $sum: '$SovClickTracking' },
					start: { $sum: '$start' },
					midpoint: { $sum: '$midpoint' },
					thirdQuartile: { $sum: '$thirdQuartile' },
					complete: { $sum: '$complete' },
					createdOn: { $push: '$createdOn' }
				}
			},
			{
				$project: {
					phoneMake: '$_id.phoneMake',
					campaignId: '$_id.campaignId',
					impression: 1,
					CompanionClickTracking: 1,
					SovClickTracking: 1,
					start: 1,
					midpoint: 1,
					thirdQuartile: 1,
					complete: 1,
					createdOn: 1,
					_id: 0
				}
			}
		])
		.then((result) => res.json(result))
		.catch((err) => res.status(422).json(err));
});

router.put('/zipbycampids', adminauth, (req, res) => {
	const { campaignId } = req.body;
	const dumd = [];
	var ids = campaignId ? campaignId.map((id) => mongoose.Types.ObjectId(id)) : dumd;
	zipreports
		.aggregate([
			{ $match: { campaignId: { $in: ids } } },
			{
				$group: {
					_id: { zip: '$zip' },
					campaignId: { $push: '$campaignId' },
					impression: { $sum: '$impression' },
					CompanionClickTracking: { $sum: '$CompanionClickTracking' },
					SovClickTracking: { $sum: '$SovClickTracking' },
					createdOn: { $push: '$createdOn' }
				}
			},
			{
				$lookup: {
					from: 'zipreports2',
					localField: '_id.zip',
					foreignField: 'pincode',
					as: 'extra'
				}
			},
			{ $unwind: { path: '$extra', preserveNullAndEmptyArrays: true } },
			{
				$project: {
					zip: '$_id.zip',
					campaignId: '$_id.campaignId',
					impression: 1,
					clicks: { $sum: [ '$CompanionClickTracking', '$SovClickTracking' ] },
					createdOn: 1,
					_id: 0,
					area: '$extra.area',
					lowersubcity: '$area.lowersubcity',
					subcity: '$extra.subcity',
					city: '$extra.city',
					grandcity: '$extra.grandcity',
					district: '$extra.district',
					comparison: '$extra.comparison',
					state: '$extra.state',
					grandstate: '$extra.grandstate',
					latitude: '$extra.latitude',
					longitude: '$extra.longitude'
				}
			}
		])
		.then((result) => res.json(result))
		.catch((err) => res.status(422).json(err));
});

router.put('/pinbycampids', adminauth, (req, res) => {
	const { campaignId } = req.body;
	req.setTimeout(6000000);
	const dumd = [];
	var ids = campaignId ? campaignId.map((id) => mongoose.Types.ObjectId(id)) : dumd;
	zipsumreport
		.aggregate([
			{ $match: { campaignId: { $in: ids } } },
			{
				$group: {
					_id: '$zip',
					campaignId: { $push: '$campaignId' },
					impression: { $sum: '$impression' },
					clicks: { $sum: '$clicks' },
					createdOn: { $push: '$createdOn' }
				}
			},
			{
				$lookup: {
					from: 'zipreports2',
					localField: '_id',
					foreignField: 'pincode',
					as: 'extra'
				}
			}
		])
		.then((result) => {
			var data = result;
			for (var i = 0; i < data.length; i++) {
				if (data[i].extra && data[i].extra[0]) {
					data[i].zip = data[i]._id;
					// data[i].impression = data[i].impression;
					// data[i].clicks = data[i].clicks;
					// data[i].campaignId = data[i].campaignId;
					data[i].area = data[i].extra[0].area;
					data[i].lowersubcity = data[i].area.lowersubcity;
					data[i].subcity = data[i].extra[0].subcity;
					data[i].city = data[i].extra[0].city;
					data[i].grandcity = data[i].extra[0].grandcity;
					data[i].district = data[i].extra[0].district;
					data[i].comparison = data[i].extra[0].comparison;
					data[i].state = data[i].extra[0].state;
					data[i].grandstate = data[i].extra[0].grandstate;
					data[i].latitude = data[i].extra[0].latitude;
					data[i].longitude = data[i].extra[0].longitude;
					data[i].extra = data[i].extra[0];
				}
			}
			res.json(data);
		})
		.catch((err) => res.status(422).json(err));
});

router.put('/pinbycampidsraw', adminauth, (req, res) => {
	const { campaignId } = req.body;
	req.setTimeout(6000000);
	const dumd = [];
	var ids = campaignId ? campaignId.map((id) => mongoose.Types.ObjectId(id)) : dumd;
	zipsumreport
		.aggregate([
			{ $match: { campaignId: { $in: ids } } },
			{
				$group: {
					_id: '$zip',
					impression: { $sum: '$impression' },
					clicks: { $sum: '$clicks' },
					createdOn: { $push: '$createdOn' }
				}
			}
		])
		.then((result) => {
			res.json(result);
		})
		.catch((err) => res.status(422).json(err));
});

router.put('/pinbycampidsrawtre', adminauth, (req, res) => {
	const { campaignId } = req.body;
	req.setTimeout(6000000);
	const dumd = [];
	var ids = campaignId ? campaignId.map((id) => mongoose.Types.ObjectId(id)) : dumd;
	zipsumreport
		.aggregate([
			{ $match: { campaignId: { $in: ids } } },
			{
				$group: {
					_id: '$zip',
					impression: { $sum: '$impression' },
					clicks: { $sum: '$clicks' },
					createdOn: { $push: '$createdOn' }
				}
			}
		])
		.then(async (result) => {
			var data = result;
			let pin = await Zipreports2.aggregate([ { $match: { pincode: { $gt: 99999, $lt: 1000000 } } } ]);
			var pan = {};
			for (var i = 0; i < pin.length; i++) {
				if (!pan[pin[i].pincode]) {
					pan[pin[i].pincode] = pin[i];
				}
			}
			for (var i = 0; i < data.length; i++) {
				if (pan[data[i]._id]) {
					data[i].zip = data[i]._id;
					data[i].area = pan[data[i]._id].area;
					data[i].lowersubcity = pan[data[i]._id].lowersubcity;
					data[i].subcity = pan[data[i]._id].subcity;
					data[i].city = pan[data[i]._id].city;
					data[i].grandcity = pan[data[i]._id].grandcity;
					data[i].district = pan[data[i]._id].district;
					data[i].state = pan[data[i]._id].state;
					data[i].grandstate = pan[data[i]._id].grandstate;
				}
			}
			res.json(data);
		})
		.catch((err) => res.status(422).json(err));
});

router.put('/pinbycampidsrawsup', adminauth, (req, res) => {
	const { campaignId } = req.body;
	req.setTimeout(6000000);
	const dumd = [];
	var ids = campaignId ? campaignId.map((id) => mongoose.Types.ObjectId(id)) : dumd;
	Zipreports2.aggregate([ { $match: { pincode: { $gt: 99999, $lt: 1000000 } } } ])
		.then((result) => {
			res.json(result);
		})
		.catch((err) => res.status(422).json(err));
});

router.put('/pinbycampidspage/:num', adminauth, (req, res) => {
	const { campaignId } = req.body;
	const { num } = req.params;
	req.setTimeout(6000000);
	const dumd = [];
	var ids = campaignId ? campaignId.map((id) => mongoose.Types.ObjectId(id)) : dumd;
	zipsumreport
		.aggregate([
			{ $match: { campaignId: { $in: ids } } },
			{
				$group: {
					_id: '$zip',
					campaignId: { $push: '$campaignId' },
					impression: { $sum: '$impression' },
					clicks: { $sum: '$clicks' },
					createdOn: { $push: '$createdOn' }
				}
			},
			{ $sort: { impression: -1 } },
			{ $skip: 200 * num },
			{ $limit: 200 },
			{
				$lookup: {
					from: 'zipreports2',
					localField: '_id',
					foreignField: 'pincode',
					as: 'extra'
				}
			}
		])
		.then((result) => {
			var data = result;
			for (var i = 0; i < data.length; i++) {
				if (data[i].extra && data[i].extra[0]) {
					data[i].zip = data[i]._id;
					data[i].impression = data[i].impression;
					data[i].clicks = data[i].clicks;
					data[i].campaignId = data[i].campaignId;
					data[i].area = data[i].extra[0].area;
					data[i].lowersubcity = data[i].area.lowersubcity;
					data[i].subcity = data[i].extra[0].subcity;
					data[i].city = data[i].extra[0].city;
					data[i].grandcity = data[i].extra[0].grandcity;
					data[i].district = data[i].extra[0].district;
					data[i].comparison = data[i].extra[0].comparison;
					data[i].state = data[i].extra[0].state;
					data[i].grandstate = data[i].extra[0].grandstate;
					data[i].latitude = data[i].extra[0].latitude;
					data[i].longitude = data[i].extra[0].longitude;
					data[i].extra = data[i].extra[0];
				}
			}
			res.json(data);
		})
		.catch((err) => res.status(422).json(err));
});

router.put('/zipbycampidsallcombo', adminauth, (req, res) => {
	const { campaignId } = req.body;
	// var ids = campaignId ? campaignId.map(id=>mongoose.Types.ObjectId(id)) : dumd
	try {
		var audio = campaignId.audio.map((id) => mongoose.Types.ObjectId(id));
		var display = campaignId.display.map((id) => mongoose.Types.ObjectId(id));
		var video = campaignId.video.map((id) => mongoose.Types.ObjectId(id));
		zipreports
			.aggregate([
				{
					$facet: {
						audio: [
							{ $match: { campaignId: { $in: audio }, impression: { $gt: 10 } } },
							{
								$group: {
									_id: { zip: '$zip' },
									campaignId: { $push: '$campaignId' },
									impression: { $sum: '$impression' },
									CompanionClickTracking: { $sum: '$CompanionClickTracking' },
									SovClickTracking: { $sum: '$SovClickTracking' },
									start: { $sum: '$start' },
									midpoint: { $sum: '$midpoint' },
									thirdQuartile: { $sum: '$thirdQuartile' },
									complete: { $sum: '$complete' },
									createdOn: { $push: '$createdOn' }
								}
							},
							{
								$lookup: {
									from: 'zipreports2',
									localField: '_id.zip',
									foreignField: 'pincode',
									as: 'extra'
								}
							},
							{ $unwind: { path: '$extra', preserveNullAndEmptyArrays: true } },
							{
								$project: {
									zip: '$_id.zip',
									campaignId: '$_id.campaignId',
									impression: 1,
									CompanionClickTracking: 1,
									SovClickTracking: 1,
									start: 1,
									midpoint: 1,
									thirdQuartile: 1,
									complete: 1,
									createdOn: 1,
									_id: 0,
									area: '$extra.area',
									lowersubcity: '$area.lowersubcity',
									subcity: '$extra.subcity',
									city: '$extra.city',
									grandcity: '$extra.grandcity',
									district: '$extra.district',
									comparison: '$extra.comparison',
									state: '$extra.state',
									grandstate: '$extra.grandstate',
									latitude: '$extra.latitude',
									longitude: '$extra.longitude'
								}
							}
						],
						display: [
							{ $match: { campaignId: { $in: display }, impression: { $gt: 10 } } },
							{
								$group: {
									_id: { zip: '$zip' },
									campaignId: { $push: '$campaignId' },
									impression: { $sum: '$impression' },
									CompanionClickTracking: { $sum: '$CompanionClickTracking' },
									SovClickTracking: { $sum: '$SovClickTracking' },
									start: { $sum: '$start' },
									midpoint: { $sum: '$midpoint' },
									thirdQuartile: { $sum: '$thirdQuartile' },
									complete: { $sum: '$complete' },
									createdOn: { $push: '$createdOn' }
								}
							},
							{
								$lookup: {
									from: 'zipreports2',
									localField: '_id.zip',
									foreignField: 'pincode',
									as: 'extra'
								}
							},
							{ $unwind: { path: '$extra', preserveNullAndEmptyArrays: true } },
							{
								$project: {
									zip: '$_id.zip',
									campaignId: '$_id.campaignId',
									impression: 1,
									CompanionClickTracking: 1,
									SovClickTracking: 1,
									start: 1,
									midpoint: 1,
									thirdQuartile: 1,
									complete: 1,
									createdOn: 1,
									_id: 0,
									area: '$extra.area',
									lowersubcity: '$area.lowersubcity',
									subcity: '$extra.subcity',
									city: '$extra.city',
									grandcity: '$extra.grandcity',
									district: '$extra.district',
									comparison: '$extra.comparison',
									state: '$extra.state',
									grandstate: '$extra.grandstate',
									latitude: '$extra.latitude',
									longitude: '$extra.longitude'
								}
							}
						],
						video: [
							{ $match: { campaignId: { $in: video }, impression: { $gt: 10 } } },
							{
								$group: {
									_id: { zip: '$zip' },
									campaignId: { $push: '$campaignId' },
									impression: { $sum: '$impression' },
									CompanionClickTracking: { $sum: '$CompanionClickTracking' },
									SovClickTracking: { $sum: '$SovClickTracking' },
									start: { $sum: '$start' },
									midpoint: { $sum: '$midpoint' },
									thirdQuartile: { $sum: '$thirdQuartile' },
									complete: { $sum: '$complete' },
									createdOn: { $push: '$createdOn' }
								}
							},
							{
								$lookup: {
									from: 'zipreports2',
									localField: '_id.zip',
									foreignField: 'pincode',
									as: 'extra'
								}
							},
							{ $unwind: { path: '$extra', preserveNullAndEmptyArrays: true } },
							{
								$project: {
									zip: '$_id.zip',
									campaignId: '$_id.campaignId',
									impression: 1,
									CompanionClickTracking: 1,
									SovClickTracking: 1,
									start: 1,
									midpoint: 1,
									thirdQuartile: 1,
									complete: 1,
									createdOn: 1,
									_id: 0,
									area: '$extra.area',
									lowersubcity: '$area.lowersubcity',
									subcity: '$extra.subcity',
									city: '$extra.city',
									grandcity: '$extra.grandcity',
									district: '$extra.district',
									comparison: '$extra.comparison',
									state: '$extra.state',
									grandstate: '$extra.grandstate',
									latitude: '$extra.latitude',
									longitude: '$extra.longitude'
								}
							}
						]
					}
				}
			])
			.then((result) => res.json(result))
			.catch((err) => res.status(422).json(err));
	} catch (e) {
		console.log(e);
		res.status(422).json(e);
	}
});

router.put('/regionbycampids', adminauth, (req, res) => {
	const { campaignId } = req.body;
	const dumd = [];
	var ids = campaignId ? campaignId.map((id) => mongoose.Types.ObjectId(id)) : dumd;
	regionreports
		.aggregate([
			{ $match: { campaignId: { $in: ids } } },
			{
				$project: {
					region: { $toLower: '$region' },
					campaignId: '$campaignId',
					impression: '$impression',
					CompanionClickTracking: '$CompanionClickTracking',
					SovClickTracking: '$SovClickTracking',
					start: '$start',
					midpoint: '$midpoint',
					thirdQuartile: '$thirdQuartile',
					complete: '$complete',
					createdOn: '$createdOn'
				}
			},
			{
				$group: {
					_id: { region: '$region' },
					campaignId: { $push: '$campaignId' },
					impression: { $sum: '$impression' },
					CompanionClickTracking: { $sum: '$CompanionClickTracking' },
					SovClickTracking: { $sum: '$SovClickTracking' },
					start: { $sum: '$start' },
					midpoint: { $sum: '$midpoint' },
					thirdQuartile: { $sum: '$thirdQuartile' },
					complete: { $sum: '$complete' },
					createdOn: { $push: '$createdOn' }
				}
			},
			{
				$project: {
					region: '$_id.region',
					campaignId: '$_id.campaignId',
					impression: 1,
					CompanionClickTracking: 1,
					SovClickTracking: 1,
					start: 1,
					midpoint: 1,
					thirdQuartile: 1,
					complete: 1,
					createdOn: 1,
					_id: 0
				}
			}
		])
		.then((result) => res.json(result))
		.catch((err) => res.status(422).json(err));
});

router.put('/pptypebycampids', adminauth, (req, res) => {
	const { campaignId } = req.body;
	const dumd = [];
	var ids = campaignId ? campaignId.map((id) => mongoose.Types.ObjectId(id)) : dumd;
	pptypereports
		.aggregate([
			{ $match: { campaignId: { $in: ids } } },
			{
				$project: {
					pptype: { $toLower: '$pptype' },
					campaignId: '$campaignId',
					impression: '$impression',
					CompanionClickTracking: '$CompanionClickTracking',
					SovClickTracking: '$SovClickTracking',
					start: '$start',
					midpoint: '$midpoint',
					thirdQuartile: '$thirdQuartile',
					complete: '$complete',
					createdOn: '$createdOn'
				}
			},
			{
				$group: {
					_id: { pptype: '$pptype' },
					campaignId: { $push: '$campaignId' },
					impression: { $sum: '$impression' },
					CompanionClickTracking: { $sum: '$CompanionClickTracking' },
					SovClickTracking: { $sum: '$SovClickTracking' },
					start: { $sum: '$start' },
					midpoint: { $sum: '$midpoint' },
					thirdQuartile: { $sum: '$thirdQuartile' },
					complete: { $sum: '$complete' },
					createdOn: { $push: '$createdOn' }
				}
			},
			{
				$project: {
					pptype: '$_id.pptype',
					campaignId: '$_id.campaignId',
					impression: 1,
					CompanionClickTracking: 1,
					SovClickTracking: 1,
					start: 1,
					midpoint: 1,
					thirdQuartile: 1,
					complete: 1,
					createdOn: 1,
					_id: 0
				}
			}
		])
		.then((result) => res.json(result))
		.catch((err) => res.status(422).json(err));
});

router.put('/platformTypebycampids', adminauth, (req, res) => {
	const { campaignId } = req.body;
	const dumd = [];
	var ids = campaignId ? campaignId.map((id) => mongoose.Types.ObjectId(id)) : dumd;
	platformtypereports
		.aggregate([
			{ $match: { campaignId: { $in: ids } } },
			{
				$project: {
					platformType: { $toLower: '$platformType' },
					campaignId: '$campaignId',
					impression: '$impression',
					CompanionClickTracking: '$CompanionClickTracking',
					SovClickTracking: '$SovClickTracking',
					start: '$start',
					midpoint: '$midpoint',
					thirdQuartile: '$thirdQuartile',
					complete: '$complete',
					createdOn: '$createdOn'
				}
			},
			{
				$group: {
					_id: { platformType: '$platformType' },
					campaignId: { $push: '$campaignId' },
					impression: { $sum: '$impression' },
					CompanionClickTracking: { $sum: '$CompanionClickTracking' },
					SovClickTracking: { $sum: '$SovClickTracking' },
					start: { $sum: '$start' },
					midpoint: { $sum: '$midpoint' },
					thirdQuartile: { $sum: '$thirdQuartile' },
					complete: { $sum: '$complete' },
					createdOn: { $push: '$createdOn' }
				}
			},
			{
				$project: {
					platformType: '$_id.platformType',
					campaignId: '$_id.campaignId',
					impression: 1,
					CompanionClickTracking: 1,
					SovClickTracking: 1,
					start: 1,
					midpoint: 1,
					thirdQuartile: 1,
					complete: 1,
					createdOn: 1,
					_id: 0
				}
			}
		])
		.then((result) => res.json(result))
		.catch((err) => res.status(422).json(err));
});

router.put('/platformTypebycampidstest', adminauth, (req, res) => {
	const { campaignId } = req.body;
	const dumd = [];
	var ids = campaignId ? campaignId.map((id) => mongoose.Types.ObjectId(id)) : dumd;
	platformtypereports
		.aggregate([
			{ $match: { campaignId: { $in: ids } } },
			{
				$project: {
					platformType: { $toLower: '$platformType' },
					campaignId: '$campaignId',
					impression: '$impression',
					CompanionClickTracking: '$CompanionClickTracking',
					SovClickTracking: '$SovClickTracking',
					start: '$start',
					midpoint: '$midpoint',
					thirdQuartile: '$thirdQuartile',
					complete: '$complete',
					createdOn: '$createdOn'
				}
			},
			{
				$group: {
					_id: { platformType: '$platformType' },
					campaignId: { $push: '$campaignId' },
					impression: { $sum: '$impression' },
					CompanionClickTracking: { $sum: '$CompanionClickTracking' },
					SovClickTracking: { $sum: '$SovClickTracking' },
					start: { $sum: '$start' },
					midpoint: { $sum: '$midpoint' },
					thirdQuartile: { $sum: '$thirdQuartile' },
					complete: { $sum: '$complete' },
					createdOn: { $push: '$createdOn' }
				}
			},
			{
				$project: {
					platformType: '$_id.platformType',
					campaignId: '$_id.campaignId',
					impression: 1,
					CompanionClickTracking: 1,
					SovClickTracking: 1,
					start: 1,
					midpoint: 1,
					thirdQuartile: 1,
					complete: 1,
					createdOn: 1,
					_id: 0
				}
			}
		])
		.then((result) => res.json(result))
		.catch((err) => res.status(422).json(err));
});

router.put('/citylanguagebycampids', adminauth, (req, res) => {
	const { campaignId } = req.body;
	const dumd = [];
	var ids = campaignId ? campaignId.map((id) => mongoose.Types.ObjectId(id)) : dumd;
	citylanguagereports
		.aggregate([
			{ $match: { campaignId: { $in: ids } } },
			{
				$project: {
					citylanguage: { $toLower: '$citylanguage' },
					campaignId: '$campaignId',
					impression: '$impression',
					CompanionClickTracking: '$CompanionClickTracking',
					SovClickTracking: '$SovClickTracking',
					start: '$start',
					midpoint: '$midpoint',
					thirdQuartile: '$thirdQuartile',
					complete: '$complete',
					createdOn: '$createdOn'
				}
			},
			{
				$group: {
					_id: { citylanguage: '$citylanguage' },
					campaignId: { $push: '$campaignId' },
					impression: { $sum: '$impression' },
					CompanionClickTracking: { $sum: '$CompanionClickTracking' },
					SovClickTracking: { $sum: '$SovClickTracking' },
					start: { $sum: '$start' },
					midpoint: { $sum: '$midpoint' },
					thirdQuartile: { $sum: '$thirdQuartile' },
					complete: { $sum: '$complete' },
					createdOn: { $push: '$createdOn' }
				}
			},
			{
				$project: {
					citylanguage: '$_id.citylanguage',
					campaignId: '$_id.campaignId',
					impression: 1,
					CompanionClickTracking: 1,
					SovClickTracking: 1,
					start: 1,
					midpoint: 1,
					thirdQuartile: 1,
					complete: 1,
					createdOn: 1,
					_id: 0
				}
			}
		])
		.then((result) => res.json(result))
		.catch((err) => res.status(422).json(err));
});

router.put('/phoneModelbycampids', adminauth, (req, res) => {
	const { campaignId } = req.body;
	const dumd = [];
	var ids = campaignId ? campaignId.map((id) => mongoose.Types.ObjectId(id)) : dumd;
	phonemodelreports
		.aggregate([
			{ $match: { campaignId: { $in: display } } },
			{ $addFields: { phoneModel_sub: { $toUpper: '$phoneModel' } } },
			{
				$lookup: {
					from: 'phonemodel2reports',
					localField: 'phoneModel_sub',
					foreignField: 'make_model',
					as: 'extra_details'
				}
			},
			{ $unwind: { path: '$extra_details', preserveNullAndEmptyArrays: true } },
			{
				$project: {
					phoneModel: 1,
					impression: 1,
					CompanionClickTracking: 1,
					SovClickTracking: 1,
					extra_details: {
						$ifNull: [
							'$extra_details',
							{
								make_model: '',
								cost: '',
								cumulative: '',
								release: '',
								company: '',
								type: '',
								total_percent: '',
								model: '',
								combined_make_model: ''
							}
						]
					}
				}
			},
			{
				$group: {
					_id: { combined_make_model: '$extra_details.combined_make_model' },
					impressions: { $sum: '$impression' },
					CompanionClickTracking: { $sum: '$CompanionClickTracking' },
					SovClickTracking: { $sum: '$SovClickTracking' },
					extra: { $first: '$extra_details' }
				}
			},
			{
				$project: {
					impression: '$impressions',
					phoneModel: '$_id.combined_make_model',
					extra: '$extra',
					CompanionClickTracking: 1,
					SovClickTracking: 1
				}
			},
			{ $sort: { impression: -1 } }
		])
		.then((result) => {
			var data = result;
			var store = {};
			store['unknown'] = { impression: 0, CompanionClickTracking: 0, SovClickTracking: 0 };
			data.map((x) => {
				if (x && x.extra && x.extra.type) {
					if (store[x.extra.type]) {
						store[x.extra.type].impression += parseInt(x.impression);
						store[x.extra.type].CompanionClickTracking += parseInt(x.CompanionClickTracking);
						store[x.extra.type].SovClickTracking += parseInt(x.SovClickTracking);
					} else {
						store[x.extra.type] = { impression: 0, CompanionClickTracking: 0, SovClickTracking: 0 };
						store[x.extra.type].impression = parseInt(x.impression);
						store[x.extra.type].CompanionClickTracking = parseInt(x.CompanionClickTracking);
						store[x.extra.type].SovClickTracking = parseInt(x.SovClickTracking);
					}
				} else {
					store['unknown'].impression += parseInt(x.impression);
					store['unknown'].CompanionClickTracking += parseInt(x.CompanionClickTracking);
					store['unknown'].SovClickTracking += parseInt(x.SovClickTracking);
				}
			});
			var solu = [];
			for (const [ x, y ] of Object.entries(store)) {
				solu.push({
					type: x,
					impression: y.impression,
					CompanionClickTracking: y.CompanionClickTracking,
					SovClickTracking: y.SovClickTracking
				});
			}
			res.json(solu);
		})
		.catch((err) => res.status(422).json(err));
});

router.put('/phoneModelbycampids2', adminauth, (req, res) => {
	const { campaignId } = req.body;
	const dumd = [];
	var ids = campaignId ? campaignId.map((id) => mongoose.Types.ObjectId(id)) : dumd;
	phonemodelreports
		.aggregate([
			{ $match: { campaignId: { $in: ids } } },
			{ $addFields: { phoneModel_sub: { $toUpper: '$phoneModel' } } },
			{
				$lookup: {
					from: 'phonemodel2reports',
					localField: 'phoneModel_sub',
					foreignField: 'make_model',
					as: 'extra_details'
				}
			},
			{ $unwind: { path: '$extra_details', preserveNullAndEmptyArrays: true } },
			{
				$project: {
					phoneModel: 1,
					impression: 1,
					CompanionClickTracking: 1,
					SovClickTracking: 1,
					extra_details: {
						$ifNull: [
							'$extra_details',
							{
								make_model: '',
								cost: '',
								cumulative: '',
								release: '',
								company: '',
								type: '',
								total_percent: '',
								model: '',
								combined_make_model: ''
							}
						]
					}
				}
			},
			{
				$group: {
					_id: { combined_make_model: '$extra_details.combined_make_model' },
					impressions: { $sum: '$impression' },
					CompanionClickTracking: { $sum: '$CompanionClickTracking' },
					SovClickTracking: { $sum: '$SovClickTracking' },
					extra: { $first: '$extra_details' }
				}
			},
			{
				$project: {
					impression: '$impressions',
					phoneModel: '$_id.combined_make_model',
					extra: '$extra',
					CompanionClickTracking: 1,
					SovClickTracking: 1
				}
			},
			{ $sort: { impression: -1 } }
		])
		.then((result) => {
			res.json(result);
		})
		.catch((err) => res.status(422).json(err));
});

router.put('/phoneModelbycampidsallcombo', adminauth, (req, res) => {
	const { campaignId } = req.body;
	var audio = campaignId.audio.map((id) => mongoose.Types.ObjectId(id));
	var display = campaignId.display.map((id) => mongoose.Types.ObjectId(id));
	var video = campaignId.video.map((id) => mongoose.Types.ObjectId(id));
	phonemodelreports
		.aggregate([
			{
				$facet: {
					audio: [
						{ $match: { campaignId: { $in: audio } } },
						{ $addFields: { phoneModel_sub: { $toUpper: '$phoneModel' } } },
						{
							$lookup: {
								from: 'phonemodel2reports',
								localField: 'phoneModel_sub',
								foreignField: 'make_model',
								as: 'extra_details'
							}
						},
						{ $unwind: { path: '$extra_details', preserveNullAndEmptyArrays: true } },
						{
							$project: {
								phoneModel: 1,
								impression: 1,
								CompanionClickTracking: 1,
								SovClickTracking: 1,
								extra_details: {
									$ifNull: [
										'$extra_details',
										{
											make_model: '',
											cost: '',
											cumulative: '',
											release: '',
											company: '',
											type: '',
											total_percent: '',
											model: '',
											combined_make_model: ''
										}
									]
								}
							}
						},
						{
							$group: {
								_id: { combined_make_model: '$extra_details.combined_make_model' },
								impressions: { $sum: '$impression' },
								CompanionClickTracking: { $sum: '$CompanionClickTracking' },
								SovClickTracking: { $sum: '$SovClickTracking' },
								extra: { $first: '$extra_details' }
							}
						},
						{
							$project: {
								impression: '$impressions',
								phoneModel: '$_id.combined_make_model',
								extra: '$extra',
								CompanionClickTracking: 1,
								SovClickTracking: 1
							}
						},
						{ $sort: { impression: -1 } }
					],
					display: [
						{ $match: { campaignId: { $in: display } } },
						{ $addFields: { phoneModel_sub: { $toUpper: '$phoneModel' } } },
						{
							$lookup: {
								from: 'phonemodel2reports',
								localField: 'phoneModel_sub',
								foreignField: 'make_model',
								as: 'extra_details'
							}
						},
						{ $unwind: { path: '$extra_details', preserveNullAndEmptyArrays: true } },
						{
							$project: {
								phoneModel: 1,
								impression: 1,
								CompanionClickTracking: 1,
								SovClickTracking: 1,
								extra_details: {
									$ifNull: [
										'$extra_details',
										{
											make_model: '',
											cost: '',
											cumulative: '',
											release: '',
											company: '',
											type: '',
											total_percent: '',
											model: '',
											combined_make_model: ''
										}
									]
								}
							}
						},
						{
							$group: {
								_id: { combined_make_model: '$extra_details.combined_make_model' },
								impressions: { $sum: '$impression' },
								CompanionClickTracking: { $sum: '$CompanionClickTracking' },
								SovClickTracking: { $sum: '$SovClickTracking' },
								extra: { $first: '$extra_details' }
							}
						},
						{
							$project: {
								impression: '$impressions',
								phoneModel: '$_id.combined_make_model',
								extra: '$extra',
								CompanionClickTracking: 1,
								SovClickTracking: 1
							}
						},
						{ $sort: { impression: -1 } }
					],
					video: [
						{ $match: { campaignId: { $in: video } } },
						{ $addFields: { phoneModel_sub: { $toUpper: '$phoneModel' } } },
						{
							$lookup: {
								from: 'phonemodel2reports',
								localField: 'phoneModel_sub',
								foreignField: 'make_model',
								as: 'extra_details'
							}
						},
						{ $unwind: { path: '$extra_details', preserveNullAndEmptyArrays: true } },
						{
							$project: {
								phoneModel: 1,
								impression: 1,
								CompanionClickTracking: 1,
								SovClickTracking: 1,
								extra_details: {
									$ifNull: [
										'$extra_details',
										{
											make_model: '',
											cost: '',
											cumulative: '',
											release: '',
											company: '',
											type: '',
											total_percent: '',
											model: '',
											combined_make_model: ''
										}
									]
								}
							}
						},
						{
							$group: {
								_id: { combined_make_model: '$extra_details.combined_make_model' },
								impressions: { $sum: '$impression' },
								CompanionClickTracking: { $sum: '$CompanionClickTracking' },
								SovClickTracking: { $sum: '$SovClickTracking' },
								extra: { $first: '$extra_details' }
							}
						},
						{
							$project: {
								impression: '$impressions',
								phoneModel: '$_id.combined_make_model',
								extra: '$extra',
								CompanionClickTracking: 1,
								SovClickTracking: 1
							}
						},
						{ $sort: { impression: -1 } }
					]
				}
			}
		])
		.allowDiskUse(true)
		.then((result) => res.json(result))
		.catch((err) => res.status(422).json(err));
});

router.put('/uniqueusersbypub', adminauth, (req, res) => {
	const { campaignId, appId } = req.body;
	const dumd = [];
	var ids = campaignId ? campaignId.map((id) => mongoose.Types.ObjectId(id)) : dumd;
	var apids = appId ? appId.map((id) => mongoose.Types.ObjectId(id)) : dumd;
	freqpublishreports
		.aggregate([
			{ $match: { campaignId: { $in: ids }, appId: { $in: { apids } } } },
			{ $group: { _id: '$appId', unique: { $sum: '$users' } } },
			{ $project: { id: '$_id', unique: 1, _id: 0 } }
		])
		.then((result) => res.json(result))
		.catch((err) => res.status(422).json(err));
});

router.put('/uniqueusersbycamppub', adminauth, (req, res) => {
	const { campaignId, appId } = req.body;
	const dumd = [];
	var ids = campaignId ? campaignId.map((id) => mongoose.Types.ObjectId(id)) : dumd;
	var apids = appId ? appId.map((id) => mongoose.Types.ObjectId(id)) : dumd;
	freqpublishreports
		.aggregate([
			{ $match: { campaignId: { $in: ids }, appId: { $in: { apids } } } },
			{ $group: { _id: '$appId', unique: { $sum: '$users' } } },
			{ $project: { id: '$_id', unique: 1, _id: 0 } }
		])
		.then((result) => res.json(result))
		.catch((err) => res.status(422).json(err));
});

router.put('/uniqueusersbycampids', adminauth, (req, res) => {
	const { campaignId } = req.body;
	const dumd = [];
	var ids = campaignId ? campaignId.map((id) => mongoose.Types.ObjectId(id)) : dumd;
	freqpublishreports
		.aggregate([
			{ $match: { campaignId: { $in: ids } } },
			{ $group: { _id: '$campaignId', unique: { $sum: '$uniqueusers' } } },
			{ $project: { campaignId: '$_id', unique: 1, _id: 0 } }
		])
		.then((result) => res.json(result))
		.catch((err) => res.status(422).json(err));
});

router.put('/uniqueusersbycampids2', adminauth, (req, res) => {
	const { campaignId } = req.body;
	const dumd = [];
	var ids = campaignId ? campaignId.map((id) => mongoose.Types.ObjectId(id)) : dumd;
	uniqueuserreports
		.aggregate([ { $match: { campaignId: { $in: ids } } } ])
		.then((result) => res.json(result))
		.catch((err) => res.status(422).json(err));
});

router.put('/spentallrepobyid', adminauth, (req, res) => {
	const { campaignId } = req.body;
	const dumd = [];
	var ids = campaignId ? campaignId.map((id) => mongoose.Types.ObjectId(id)) : dumd;
	spentreports
		.aggregate([
			{ $match: { campaignId: { $in: ids } } },
			{ $group: { _id: '$appId', totalspent: { $sum: '$totalSpent' } } },
			{ $project: { _id: 0, appId: '$_id', totalspent: 1 } }
		])
		.then((result) => res.json(result))
		.catch((err) => res.status(422).json(err));
});

router.put('/spentallrepobyid2', adminauth, (req, res) => {
	const { campaignId } = req.body;
	const dumd = [];
	var ids = campaignId ? campaignId.map((id) => mongoose.Types.ObjectId(id)) : dumd;
	spentreports
		.find({ campaignId: { $in: ids } })
		.then((result) => res.json(result))
		.catch((err) => res.status(422).json(err));
});

router.put('/categorywiseids', adminauth, async (req, res) => {
	const { campaignId } = req.body;
	try {
		var audio = campaignId.map((id) => mongoose.Types.ObjectId(id));
		const resultaudio = await CategoryReports.aggregate([
			{ $match: { campaignId: { $in: audio } } },
			{
				$group: {
					_id: { category: '$category' },
					impressions: { $sum: '$impression' },
					CompanionClickTracking: { $sum: '$CompanionClickTracking' },
					SovClickTracking: { $sum: '$SovClickTracking' }
				}
			},
			{
				$lookup: {
					from: 'categoryreports2',
					localField: '_id.category',
					foreignField: 'category',
					as: 'extra_details'
				}
			},
			// { $unwind: { path: '$extra_details', preserveNullAndEmptyArrays: true } },
			{
				$lookup: {
					from: 'categoryreports2',
					localField: '_id.category',
					foreignField: 'new_taxonamy',
					as: 'extra_details1'
				}
			},
			// { $unwind: { path: '$extra_details1', preserveNullAndEmptyArrays: true } },
			{ $sort: { impressions: -1 } },
			{
				$project: {
					impressions: 1,
					CompanionClickTracking: 1,
					SovClickTracking: 1,
					extra_details: { $ifNull: [ '$extra_details', '$extra_details1' ] }
				}
			},
			{
				$project: {
					impressions: 1,
					CompanionClickTracking: 1,
					SovClickTracking: 1,
					extra_details: { $ifNull: [ '$extra_details', [] ] }
				}
			}
		]).allowDiskUse(true);
		var soul = {};
		resultaudio.map((x) => {
			if (x.extra_details && x.extra_details.length) {
				if (x.extra_details[0].Name) {
					if (soul[x.extra_details[0].Name]) {
						soul[x.extra_details[0].Name].impressions += x.impressions;
						soul[x.extra_details[0].Name].CompanionClickTracking += x.CompanionClickTracking;
						soul[x.extra_details[0].Name].SovClickTracking += x.SovClickTracking;
					} else {
						soul[x.extra_details[0].Name] = {
							impressions: 0,
							CompanionClickTracking: 0,
							SovClickTracking: 0
						};
						soul[x.extra_details[0].Name].impressions = x.impressions;
						soul[x.extra_details[0].Name].CompanionClickTracking = x.CompanionClickTracking;
						soul[x.extra_details[0].Name].SovClickTracking = x.SovClickTracking;
					}
				}
			}
		});
		var sender = [];
		for (const [ y, z ] of Object.entries(soul)) {
			sender.push({
				Name: y,
				impressions: z.impressions,
				SovClickTracking: z.SovClickTracking,
				CompanionClickTracking: z.CompanionClickTracking
			});
		}
		res.status(200).json(sender);
	} catch (err) {
		console.log(err);
		res.status(400).json({ error: err.message });
	}
});

router.put('/categorywisereportsallcombo', adminauth, async (req, res) => {
	const { campaignId } = req.body;
	var audio = campaignId.audio.map((id) => mongoose.Types.ObjectId(id));
	var display = campaignId.display.map((id) => mongoose.Types.ObjectId(id));
	var video = campaignId.video.map((id) => mongoose.Types.ObjectId(id));

	try {
		const resultaudio = await CategoryReports.aggregate([
			{ $match: { campaignId: { $in: audio } } },
			// {$project:{
			// 	category:1,
			// 	impression:1,
			// 	CompanionClickTracking:1,
			// 	SovClickTracking:1,
			// 	test: { $dateToString: { format: '%Y-%m-%d', date: '$createdOn' } },
			// }},
			// {$match:{test:{$gt:setdate}}},
			{
				$group: {
					_id: { category: '$category' },
					impressions: { $sum: '$impression' },
					CompanionClickTracking: { $sum: '$CompanionClickTracking' },
					SovClickTracking: { $sum: '$SovClickTracking' }
				}
			},
			{
				$lookup: {
					from: 'categoryreports2',
					localField: '_id.category',
					foreignField: 'category',
					as: 'extra_details'
				}
			},
			// { $unwind: { path: '$extra_details', preserveNullAndEmptyArrays: true } },
			{
				$lookup: {
					from: 'categoryreports2',
					localField: '_id.category',
					foreignField: 'new_taxonamy',
					as: 'extra_details1'
				}
			},
			// { $unwind: { path: '$extra_details1', preserveNullAndEmptyArrays: true } },
			{ $sort: { impressions: -1 } },
			{
				$project: {
					impressions: 1,
					CompanionClickTracking: 1,
					SovClickTracking: 1,
					extra_details: { $ifNull: [ '$extra_details', '$extra_details1' ] }
				}
			},
			{
				$project: {
					impressions: 1,
					CompanionClickTracking: 1,
					SovClickTracking: 1,
					extra_details: { $ifNull: [ '$extra_details', [] ] }
				}
			}
			// {
			// 	$project: {
			// 		impressions: 1,
			// 		CompanionClickTracking: 1,
			// 		SovClickTracking: 1,
			// 		extra_details: { $ifNull: ['$extra_details', []] }
			// 	}
			// }
		]).allowDiskUse(true);
		const resultdisplay = await CategoryReports.aggregate([
			{ $match: { campaignId: { $in: display } } },
			{
				$group: {
					_id: { category: '$category' },
					impressions: { $sum: '$impression' },
					CompanionClickTracking: { $sum: '$CompanionClickTracking' },
					SovClickTracking: { $sum: '$SovClickTracking' }
				}
			},
			{
				$lookup: {
					from: 'categoryreports2',
					localField: '_id.category',
					foreignField: 'category',
					as: 'extra_details'
				}
			},
			// { $unwind: { path: '$extra_details', preserveNullAndEmptyArrays: true } },
			{
				$lookup: {
					from: 'categoryreports2',
					localField: '_id.category',
					foreignField: 'new_taxonamy',
					as: 'extra_details1'
				}
			},
			// { $unwind: { path: '$extra_details1', preserveNullAndEmptyArrays: true } },
			{ $sort: { impressions: -1 } },
			{
				$project: {
					impressions: 1,
					CompanionClickTracking: 1,
					SovClickTracking: 1,
					extra_details: { $ifNull: [ '$extra_details', '$extra_details1' ] }
				}
			},
			{
				$project: {
					impressions: 1,
					CompanionClickTracking: 1,
					SovClickTracking: 1,
					extra_details: { $ifNull: [ '$extra_details', [] ] }
				}
			}
		]).allowDiskUse(true);
		const resultvideo = await CategoryReports.aggregate([
			{ $match: { campaignId: { $in: video } } },
			{
				$group: {
					_id: { category: '$category' },
					impressions: { $sum: '$impression' },
					CompanionClickTracking: { $sum: '$CompanionClickTracking' },
					SovClickTracking: { $sum: '$SovClickTracking' }
				}
			},
			{
				$lookup: {
					from: 'categoryreports2',
					localField: '_id.category',
					foreignField: 'category',
					as: 'extra_details'
				}
			},
			// { $unwind: { path: '$extra_details', preserveNullAndEmptyArrays: true } },
			{
				$lookup: {
					from: 'categoryreports2',
					localField: '_id.category',
					foreignField: 'new_taxonamy',
					as: 'extra_details1'
				}
			},
			// { $unwind: { path: '$extra_details1', preserveNullAndEmptyArrays: true } },
			{ $sort: { impressions: -1 } },
			{
				$project: {
					impressions: 1,
					CompanionClickTracking: 1,
					SovClickTracking: 1,
					extra_details: { $ifNull: [ '$extra_details', '$extra_details1' ] }
				}
			},
			{
				$project: {
					impressions: 1,
					CompanionClickTracking: 1,
					SovClickTracking: 1,
					extra_details: { $ifNull: [ '$extra_details', [] ] }
				}
			}
		]).allowDiskUse(true);
		res.status(200).json({ audio: resultaudio, display: resultdisplay, video: resultvideo });
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
	// CategoryReports.aggregate([
	//     {$facet:{
	//         "audio":[
	//             {$match:{campaignId:{$in:audio}}},
	//             {$group:{_id:{category:"$category"},
	//                 impressions:{"$sum":"$impression"},
	//                 CompanionClickTracking:{$sum:"$CompanionClickTracking"},
	//                 SovClickTracking:{$sum:"$SovClickTracking"}
	//             }},
	//             {$lookup:{
	//                 from:'categoryreports2',
	//                 localField:'_id.category',
	//                 foreignField:'category',
	//                 as:'extra_details'
	//             }},
	//             {$unwind:{path:"$extra_details",preserveNullAndEmptyArrays:true}},
	//             {$sort:{"impressions":-1}}
	//         ],
	//         "display":[
	//             {$match:{campaignId:{$in:display}}},
	//             {$group:{_id:{category:"$category"},
	//                 impressions:{"$sum":"$impression"},
	//                 CompanionClickTracking:{$sum:"$CompanionClickTracking"},
	//                 SovClickTracking:{$sum:"$SovClickTracking"}
	//             }},
	//             {$lookup:{
	//                 from:'categoryreports2',
	//                 localField:'_id.category',
	//                 foreignField:'category',
	//                 as:'extra_details'
	//             }},
	//             {$unwind:{path:"$extra_details",preserveNullAndEmptyArrays:true}},
	//             {$sort:{"impressions":-1}}
	//         ],
	//         "video":[
	//             {$match:{campaignId:{$in:video}}},
	//             {$group:{_id:{category:"$category"},
	//                 impressions:{"$sum":"$impression"},
	//                 CompanionClickTracking:{$sum:"$CompanionClickTracking"},
	//                 SovClickTracking:{$sum:"$SovClickTracking"}
	//             }},
	//             {$lookup:{
	//                 from:'categoryreports2',
	//                 localField:'_id.category',
	//                 foreignField:'category',
	//                 as:'extra_details'
	//             }},
	//             {$unwind:{path:"$extra_details",preserveNullAndEmptyArrays:true}},
	//             {$sort:{"impressions":-1}}
	//         ]
	//     }}
	// ])
	// .then(result=>res.json(result))
	// .catch(err=>console.log(err))
});

router.put('/categorywisereportsids', adminauth, async (req, res) => {
	const { campaignId } = req.body;
	var audio = campaignId.map((id) => mongoose.Types.ObjectId(id));

	try {
		const resultaudio = await CategoryReports.aggregate([
			{ $match: { campaignId: { $in: audio } } },
			// {$project:{
			// 	category:1,
			// 	impression:1,
			// 	CompanionClickTracking:1,
			// 	SovClickTracking:1,
			// 	test: { $dateToString: { format: '%Y-%m-%d', date: '$createdOn' } },
			// }},
			// {$match:{test:{$gt:setdate}}},
			{
				$group: {
					_id: { category: '$category' },
					impressions: { $sum: '$impression' },
					CompanionClickTracking: { $sum: '$CompanionClickTracking' },
					SovClickTracking: { $sum: '$SovClickTracking' }
				}
			},
			{
				$lookup: {
					from: 'categoryreports2',
					localField: '_id.category',
					foreignField: 'category',
					as: 'extra_details'
				}
			},
			// { $unwind: { path: '$extra_details', preserveNullAndEmptyArrays: true } },
			{
				$lookup: {
					from: 'categoryreports2',
					localField: '_id.category',
					foreignField: 'new_taxonamy',
					as: 'extra_details1'
				}
			},
			// { $unwind: { path: '$extra_details1', preserveNullAndEmptyArrays: true } },
			{ $sort: { impressions: -1 } },
			{
				$project: {
					impressions: 1,
					CompanionClickTracking: 1,
					SovClickTracking: 1,
					extra_details: { $ifNull: [ '$extra_details', '$extra_details1' ] }
				}
			},
			{
				$project: {
					impressions: 1,
					CompanionClickTracking: 1,
					SovClickTracking: 1,
					extra_details: { $ifNull: [ '$extra_details', [] ] }
				}
			}
			// {
			// 	$project: {
			// 		impressions: 1,
			// 		CompanionClickTracking: 1,
			// 		SovClickTracking: 1,
			// 		extra_details: { $ifNull: ['$extra_details', []] }
			// 	}
			// }
		]).allowDiskUse(true);
		res.status(200).json(resultaudio);
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
	// CategoryReports.aggregate([
	//     {$facet:{
	//         "audio":[
	//             {$match:{campaignId:{$in:audio}}},
	//             {$group:{_id:{category:"$category"},
	//                 impressions:{"$sum":"$impression"},
	//                 CompanionClickTracking:{$sum:"$CompanionClickTracking"},
	//                 SovClickTracking:{$sum:"$SovClickTracking"}
	//             }},
	//             {$lookup:{
	//                 from:'categoryreports2',
	//                 localField:'_id.category',
	//                 foreignField:'category',
	//                 as:'extra_details'
	//             }},
	//             {$unwind:{path:"$extra_details",preserveNullAndEmptyArrays:true}},
	//             {$sort:{"impressions":-1}}
	//         ],
	//         "display":[
	//             {$match:{campaignId:{$in:display}}},
	//             {$group:{_id:{category:"$category"},
	//                 impressions:{"$sum":"$impression"},
	//                 CompanionClickTracking:{$sum:"$CompanionClickTracking"},
	//                 SovClickTracking:{$sum:"$SovClickTracking"}
	//             }},
	//             {$lookup:{
	//                 from:'categoryreports2',
	//                 localField:'_id.category',
	//                 foreignField:'category',
	//                 as:'extra_details'
	//             }},
	//             {$unwind:{path:"$extra_details",preserveNullAndEmptyArrays:true}},
	//             {$sort:{"impressions":-1}}
	//         ],
	//         "video":[
	//             {$match:{campaignId:{$in:video}}},
	//             {$group:{_id:{category:"$category"},
	//                 impressions:{"$sum":"$impression"},
	//                 CompanionClickTracking:{$sum:"$CompanionClickTracking"},
	//                 SovClickTracking:{$sum:"$SovClickTracking"}
	//             }},
	//             {$lookup:{
	//                 from:'categoryreports2',
	//                 localField:'_id.category',
	//                 foreignField:'category',
	//                 as:'extra_details'
	//             }},
	//             {$unwind:{path:"$extra_details",preserveNullAndEmptyArrays:true}},
	//             {$sort:{"impressions":-1}}
	//         ]
	//     }}
	// ])
	// .then(result=>res.json(result))
	// .catch(err=>console.log(err))
});

router.get('/publisherComplete', adminauth, (req, res) => {
	publisherwiseConsole
		.find()
		.then((result) => {
			res.json(result);
		})
		.catch((err) => console.log(err));
});

router.get('/frequencyComplete', adminauth, (req, res) => {
	frequencyConsole
		.find()
		.then((result) => {
			res.json(result);
		})
		.catch((err) => console.log(err));
});

router.get('/publisherComplete/usersCount', adminauth, async (req, res) => {
	// frequencyreports //adsetting
	try {
		// var campdata = await adsetting.find({}, { campaignId: 1, type: 1 });
		// var ids = { audio: [], display: [], video: [] };
		// campdata.map((x) => {
		// 	if (x.type === 'video') {
		// 		ids.video.push(x.campaignId);
		// 	} else if (x.type === 'display') {
		// 		ids.display.push(x.campaignId);
		// 	} else {
		// 		ids.audio.push(x.campaignId);
		// 	}
		// });
		// ids.audio = ids.audio.map((x) => mongoose.Types.ObjectId(x));
		// ids.display = ids.display.map((x) => mongoose.Types.ObjectId(x));
		// ids.video = ids.video.map((x) => mongoose.Types.ObjectId(x));
		var users = { audio: 0, display: 0, video: 0, summary: 0 };
		var audioCount = await overallfreqreport.aggregate([
			{ $match: { rtbType: 'audio' } },
			{ $group: { _id: null, users: { $sum: '$users' } } }
		]);
		var displayCount = await overallfreqreport.aggregate([
			{ $match: { rtbType: 'display' } },
			{ $group: { _id: null, users: { $sum: '$users' } } }
		]);
		var videoCount = await overallfreqreport.aggregate([
			{ $match: { rtbType: 'video' } },
			{ $group: { _id: null, users: { $sum: '$users' } } }
		]);
		var summaryCount = await overallfreqreport.aggregate([
			{ $match: { rtbType: 'summary' } },
			{ $group: { _id: null, users: { $sum: '$users' } } }
		]);
		users.audio = audioCount[0].users;
		users.display = displayCount[0].users;
		users.video = videoCount[0].users;
		users.summary = summaryCount[0].users;
		res.json(users);
	} catch (e) {
		console.log(e);
		res.status(400).json({ error: e });
	}
});

router.get('/publisherComplete2', adminauth, async (req, res) => {
	let audio = await publisherwiseConsole.find({ type: 'audio' }).catch((err) => console.log(err));
	let display = await publisherwiseConsole.find({ type: 'display' }).catch((err) => console.log(err));
	let video = await publisherwiseConsole.find({ type: 'video' }).catch((err) => console.log(err));
	let uadata = await uareqreports
		.aggregate([ { $group: { _id: '$publisherid', request: { $sum: '$ads' } } } ])
		.catch((err) => console.log(err));
	var sol = {};
	uadata.map((x) => {
		sol[x._id] = x.request;
	});
	var compo = {
		impression: 0,
		start: 0,
		firstQuartile: 0,
		midpoint: 0,
		thirdQuartile: 0,
		complete: 0
	};
	audio &&
		audio.forEach((x) => {
			compo.impression += x.impression;
			compo.start += x.start;
			compo.firstQuartile += x.firstQuartile;
			compo.midpoint += x.midpoint;
			compo.thirdQuartile += x.thirdQuartile;
			compo.complete += x.complete;
		});
	video &&
		video.forEach((x) => {
			compo.impression += x.impression;
			compo.start += x.start;
			compo.firstQuartile += x.firstQuartile;
			compo.midpoint += x.midpoint;
			compo.thirdQuartile += x.thirdQuartile;
			compo.complete += x.complete;
		});
	res.json({ audio: audio, display: display, video: video, complete: compo, sol });
});

router.get('/publisherCompletetest', adminauth, async (req, res) => {
	try {
		const { page, size, item, direction } = req.query;
		var pagedefault = 0;
		var sizedefault = 10;
		var itemdefault = 'impression';
		var directionDefault = -1;
		if (!Number.isNaN(page) && page > 0) {
			pagedefault = parseInt(page);
		}
		if (!Number.isNaN(size) && size > 0) {
			sizedefault = parseInt(size);
		}
		if (item) {
			itemdefault = item;
		}
		if (direction) {
			directionDefault = parseInt(direction);
		}
		var queryPassSort = {};
		queryPassSort[itemdefault] = directionDefault;
		// var dataCount = publisherwiseConsole.count().catch((err) => console.log(err));
		let audio = await publisherwiseConsole
			.find({ type: 'audio' })
			.sort(queryPassSort)
			.skip(sizedefault * pagedefault)
			.limit(sizedefault)
			.catch((err) => console.log(err));
		res.json({ audio: audio });
	} catch (e) {
		console.log(e);
		res.status(400).json({ Error: e });
	}
});

router.get('/publisherCompletetestcount', adminauth, async (req, res) => {
	try {
		var data = {
			complete: 0,
			audio: 0,
			display: 0,
			video: 0
		};
		data.audio = await publisherwiseConsole.countDocuments({ type: 'audio' }).catch((err) => console.log(err));
		data.display = await publisherwiseConsole.countDocuments({ type: 'display' }).catch((err) => console.log(err));
		data.video = await publisherwiseConsole.countDocuments({ type: 'video' }).catch((err) => console.log(err));
		data.complete = parseInt(data.audio) + parseInt(data.display) + parseInt(data.video);
		res.json(data);
	} catch (e) {
		console.log(e);
		res.status(400).json({ Error: e });
	}
});

///////////////////  new apis //////////////////////////////

router.post('/categorywisereports', adminauth, async (req, res) => {
	try {
		let { campaignId } = req.body;
		var ids = campaignId ? campaignId.map((id) => mongoose.Types.ObjectId(id)) : [];
		const result = await CategoryReports.aggregate([
			{ $match: { campaignId: { $in: ids } } },
			{
				$group: {
					_id: { category: '$category' },
					impressions: { $sum: '$impression' },
					CompanionClickTracking: { $sum: '$CompanionClickTracking' },
					SovClickTracking: { $sum: '$SovClickTracking' }
				}
			},
			{
				$lookup: {
					from: 'categoryreports2',
					localField: '_id.category',
					foreignField: 'category',
					as: 'extra_details'
				}
			},
			{ $unwind: { path: '$extra_details', preserveNullAndEmptyArrays: true } },
			{ $sort: { impressions: -1 } }
		]).allowDiskUse(true);
		res.status(200).json(result);
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
});

router.put('/editphonedata', adminauth, async (req, res) => {
	try {
		//data.make_model=data.make_model.toLowerCase()
		let { make_model, cost, cumulative, release, company, model, total_percent, type } = req.body;
		let updates = { make_model, cost, cumulative, release, company, model, total_percent, type };

		const ismatch = await phonemodel2.findOne({ make_model });
		if (!ismatch) {
			const phone = new phonemodel2({
				...updates
			});
			await phone.save();
			return res.status(200).json('Updated Successfuly!');
		}

		const updated = await phonemodel2.findOneAndUpdate({ make_model }, { $set: updates }, { new: true });
		if (!updated) {
			return res.status(400).json({ error: "Couldn't Update !" });
		}

		res.status(200).json('Updated Successfuly!');
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
});

router.get('/phonedata', adminauth, async (req, res) => {
	try {
		let startdate = new Date();
		startdate.setDate(01);
		startdate.setMonth(06); // 1 july
		startdate.setFullYear(2021);

		let date = new Date();
		let days = Math.round((date.getTime() - startdate.getTime()) / 86400000);
		if (days === 0) {
			days = 1;
		}

		const phone = await phonemodel2.aggregate([
			{
				$group: {
					_id: '$make_model',
					impression: { $sum: '$impression' },
					click: { $sum: '$click' },
					release: { $first: '$release' },
					cost: { $first: '$cost' },
					company: { $first: '$company' },
					city: { $first: '$city' },
					model: { $first: '$model' },
					type: { $first: '$type' }
				}
			},
			{ $addFields: { avgimpression: { $divide: [ '$impression', days ] } } },
			{ $sort: { impression: -1 } }
		]);
		res.status(200).json(phone);
	} catch (err) {
		console.log(err.message);
		res.status(400).json({ error: err });
	}
});

router.get('/phonedata_audio', adminauth, async (req, res) => {
	try {
		let startdate = new Date();
		startdate.setDate(30);
		startdate.setMonth(07); // 30 aug
		startdate.setFullYear(2021);

		let date = new Date();
		let days = Math.round((date.getTime() - startdate.getTime()) / 86400000);
		if (days === 0) {
			days = 1;
		}

		const phone = await phonemodel2.aggregate([
			{ $sort: { impression: -1 } },
			{ $addFields: { avgimpression: { $divide: [ '$impression', days ] } } },
			{ $match: { rtbType: 'audio' } }
		]);
		res.status(200).json(phone);
	} catch (err) {
		console.log(err.message);
		res.status(400).json({ error: err });
	}
});

router.get('/phonedata_video', adminauth, async (req, res) => {
	try {
		let startdate = new Date();
		startdate.setDate(30);
		startdate.setMonth(07); // 30 aug
		startdate.setFullYear(2021);

		let date = new Date();
		let days = Math.round((date.getTime() - startdate.getTime()) / 86400000);
		if (days === 0) {
			days = 1;
		}

		const phone = await phonemodel2.aggregate([
			{ $sort: { impression: -1 } },
			{ $addFields: { avgimpression: { $divide: [ '$impression', days ] } } },

			{ $match: { rtbType: 'video' } }
		]);
		res.status(200).json(phone);
	} catch (err) {
		console.log(err.message);
		res.status(400).json({ error: err });
	}
});

router.get('/zipdata', async (req, res) => {
	try {
		let startdate = new Date();
		startdate.setDate(01);
		startdate.setMonth(06);
		startdate.setFullYear(2021);

		let date = new Date();
		let days = Math.round((date.getTime() - startdate.getTime()) / 86400000);
		if (days === 0) {
			days = 1;
		}
		const result = await Zipreports2.aggregate([
			{ $match: { requests: { $exists: true }, pincode: { $gt: 99999, $lt: 1000000 } } },
			{
				$group: {
					_id: '$pincode',
					requests: { $sum: '$requests' },
					impression: { $sum: '$impression' },
					click: { $sum: '$click' },
					area: { $first: '$area' },
					lowersubcity: { $first: '$lowersubcity' },
					subcity: { $first: '$subcity' },
					city: { $first: '$city' },
					grandcity: { $first: '$grandcity' },
					district: { $first: '$district' },
					state: { $first: '$state' },
					grandstate: { $first: '$grandcity' },
					latitude: { $first: '$latitude' },
					longitude: { $first: '$longitude' }
				}
			},
			{ $addFields: { avgrequest: { $divide: [ '$requests', days ] } } },
			{ $addFields: { avgimpression: { $divide: [ '$impression', days ] } } },
			{ $sort: { impression: -1 } },
			{
				$project: {
					pincode: '$_id',
					area: 1,
					click: 1,
					lowersubcity: 1,
					subcity: 1,
					city: 1,
					grandcity: 1,
					district: 1,
					comparison: 1,
					state: 1,
					grandstate: 1,
					latitude: 1,
					longitude: 1,
					avgimpression: 1,
					avgrequest: 1,
					requests: 1,
					impression: 1
				}
			}
		]);

		res.status(200).json(result);
	} catch (err) {
		console.log(err.message);
		res.status(400).send({ error: err.mesaage });
	}
});
router.get('/zipdata_audio', adminauth, async (req, res) => {
	try {
		let startdate = new Date();
		startdate.setDate(30);
		startdate.setMonth(07); // 30 aug
		startdate.setFullYear(2021);

		let date = new Date();
		let days = Math.round((date.getTime() - startdate.getTime()) / 86400000);
		if (days === 0) {
			days = 1;
		}
		const result = await Zipreports2.aggregate([
			{ $match: { requests: { $exists: true }, pincode: { $gt: 99999, $lt: 1000000 } } },
			{ $addFields: { avgrequest: { $divide: [ '$requests', days ] } } },
			{ $addFields: { avgimpression: { $divide: [ '$impression', days ] } } },
			{ $sort: { impression: -1 } },
			{ $match: { rtbType: 'audio' } }
		]);

		res.status(200).json(result);
	} catch (err) {
		console.log(err.message);
		res.status(400).send({ error: err.mesaage });
	}
});

router.get('/zipdata_video', adminauth, async (req, res) => {
	try {
		let startdate = new Date();
		startdate.setDate(30);
		startdate.setMonth(07); // 30 aug
		startdate.setFullYear(2021);

		let date = new Date();
		let days = Math.round((date.getTime() - startdate.getTime()) / 86400000);
		if (days === 0) {
			days = 1;
		}
		const result = await Zipreports2.aggregate([
			{ $match: { requests: { $exists: true }, pincode: { $gt: 99999, $lt: 1000000 } } },
			{ $addFields: { avgrequest: { $divide: [ '$requests', days ] } } },
			{ $addFields: { avgimpression: { $divide: [ '$impression', days ] } } },
			{ $sort: { impression: -1 } },
			{ $match: { rtbType: 'video' } }
		]);

		res.status(200).json(result);
	} catch (err) {
		console.log(err.message);
		res.status(400).send({ error: err.mesaage });
	}
});

router.get('/zipdata_banner', adminauth, async (req, res) => {
	try {
		let startdate = new Date();
		startdate.setDate(30);
		startdate.setMonth(07); // 30 aug
		startdate.setFullYear(2021);

		let date = new Date();
		let days = Math.round((date.getTime() - startdate.getTime()) / 86400000);
		if (days === 0) {
			days = 1;
		}
		const result = await Zipreports2.aggregate([
			{ $match: { requests: { $exists: true }, pincode: { $gt: 99999, $lt: 1000000 } } },
			{ $addFields: { avgrequest: { $divide: [ '$requests', days ] } } },
			{ $addFields: { avgimpression: { $divide: [ '$impression', days ] } } },
			{ $sort: { impression: -1 } },
			{ $match: { rtbType: 'display' } }
		]);

		res.status(200).json(result);
	} catch (err) {
		console.log(err.message);
		res.status(400).send({ error: err.mesaage });
	}
});

router.put('/editzipdata', adminauth, async (req, res) => {
	try {
		//data.make_model=data.make_model.toLowerCase()

		let {
			area,
			pincode,
			lowersubcity,
			subcity,
			city,
			grandcity,
			district,
			comparison,
			state,
			grandstate,
			latitude,
			longitude
		} = req.body;
		let updates = {
			area,
			pincode,
			lowersubcity,
			subcity,
			city,
			grandcity,
			district,
			state,
			grandstate,
			latitude,
			longitude
		};
		console.log(pincode);

		const ismatch = await Zipreports2.findOne({ pincode });
		if (!ismatch) {
			const zip = new Zipreports2({
				...updates
			});
			await zip.save();
			return res.status(200).json('Updated Successfuly!');
		}

		const updated = await Zipreports2.findOneAndUpdate({ pincode }, { $set: updates }, { new: true });
		if (!updated) {
			return res.status(400).json({ error: "Couldn't Update !" });
		}

		res.status(200).json('Updated Successfuly!');
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
});

router.get('/categorydata', adminauth, async (req, res) => {
	try {
		let startdate = new Date();
		startdate.setDate(01);
		startdate.setMonth(06);
		startdate.setFullYear(2021);

		let date = new Date();
		let days = Math.round((date.getTime() - startdate.getTime()) / 86400000);
		if (days === 0) {
			days = 1;
		}

		const result = await CategoryReports2.aggregate([
			{ $match: { impression: { $exists: true }, click: { $exists: true } } },
			{ $addFields: { avgimpression: { $divide: [ '$impression', days ] } } },
			{ $sort: { impression: -1 } }
		]);
		res.status(200).json(result);
	} catch (err) {
		console.log(err.message);
		res.status(400).send({ error: err.message });
	}
});

router.put('/editcategorydata', adminauth, async (req, res) => {
	try {
		//data.make_model=data.make_model.toLowerCase()

		let { category, tier1, tier2, tier3, tier4, gendercategory, agecategory, taxonamy } = req.body;
		let updates = {
			category,
			tier1,
			tier2,
			tier3,
			tier4,
			genderCategory: gendercategory,
			AgeCategory: agecategory,
			new_taxonamy: taxonamy
		};

		const ismatch = await CategoryReports2.findOne({ category });
		if (!ismatch) {
			const category = new CategoryReports2({
				...updates
			});
			await category.save();
			return res.status(200).json('Updated Successfuly!');
		}

		const updated = await CategoryReports2.findOneAndUpdate({ category }, { $set: updates }, { new: true });
		if (!updated) {
			return res.status(400).json({ error: "Couldn't Update !" });
		}

		res.status(200).json('Updated Successfuly!');
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
});

router.put('/creativewisereports', adminauth, async (req, res) => {
	try {
		console.log(11);
		const { campaignId } = req.body;

		var ids = campaignId ? campaignId.map((id) => mongoose.Types.ObjectId(id)) : [];
		const result = await Campaignwisereports.aggregate([
			{ $match: { campaignId: { $in: ids } } },
			{
				$project: {
					creativeid: { $ifNull: [ '$creativesetId', null ] },
					campaignId: 1,
					impression: 1,
					CompanionClickTracking: 1,
					SovClickTracking: 1,
					start: 1,
					midpoint: 1,
					thirdQuartile: 1,
					complete: 1,
					createdOn: 1
				}
			},
			{
				$project: {
					creative_id: { $cond: [ { $eq: [ '$creativeid', '' ] }, null, '$creativeid' ] },
					campaignId: 1,
					impression: 1,
					CompanionClickTracking: 1,
					SovClickTracking: 1,
					start: 1,
					midpoint: 1,
					thirdQuartile: 1,
					complete: 1,
					createdOn: 1
				}
			},
			{
				$project: {
					creativeids: { $cond: [ { $eq: [ '$creative_id', 'null' ] }, null, '$creative_id' ] },
					campaignId: 1,
					impression: 1,
					CompanionClickTracking: 1,
					SovClickTracking: 1,
					start: 1,
					midpoint: 1,
					thirdQuartile: 1,
					complete: 1,
					createdOn: 1
				}
			},

			{ $addFields: { creative_id: { $toObjectId: '$creativeids' } } },
			{
				$lookup: {
					from: 'creativesets',
					localField: 'creative_id',
					foreignField: '_id',
					as: 'extra_details'
				}
			},
			{ $unwind: { path: '$extra_details', preserveNullAndEmptyArrays: true } },
			{
				$group: {
					_id: { creativeset: '$extra_details.name' },
					campaignId: { $push: '$campaignId' },
					impression: { $sum: '$impression' },
					CompanionClickTracking: { $sum: '$CompanionClickTracking' },
					SovClickTracking: { $sum: '$SovClickTracking' },
					start: { $sum: '$start' },
					midpoint: { $sum: '$midpoint' },
					thirdQuartile: { $sum: '$thirdQuartile' },
					complete: { $sum: '$complete' },
					createdOn: { $push: '$createdOn' },
					status: { $first: '$extra_details.status' }
				}
			},
			{ $sort: { impression: -1 } }
		]).allowDiskUse(true);
		res.status(200).json(result);
	} catch (err) {
		console.log(err.message);
		res.status(400).json({ error: err });
	}
});

router.post('/categorydata_podcast', adminauth, async (req, res) => {
	try {
		let startdate = new Date();
		startdate.setDate(01);
		startdate.setMonth(06);
		startdate.setFullYear(2021);

		let date = new Date();
		let days = Math.round((date.getTime() - startdate.getTime()) / 86400000);
		if (days === 0) {
			days = 1;
		}
		const result = await CategoryReports2.aggregate([
			{
				$project: {
					impression: '$impression',
					click: '$click',
					category: '$category',
					Name: '$Name',
					tier1: '$tier1',
					tier2: '$tier2',
					tier3: '$tier3',
					tier4: '$tier4',
					genderCategory: '$genderCategory',
					AgeCategory: '$AgeCategory',
					feed: '$feed',
					new_taxonamy: '$new_taxonamy'
				}
			},
			{ $addFields: { avgimpression: { $divide: [ '$impression', days ] } } },
			{ $match: { feed: '3' } },
			{ $sort: { impression: -1 } }
		]);
		res.status(200).json(result);
	} catch (err) {
		console.log(err.message);
		res.status(400).json({ error: err });
	}
});

router.post('/categorydata_ondemand', adminauth, async (req, res) => {
	try {
		let startdate = new Date();
		startdate.setDate(01);
		startdate.setMonth(06);
		startdate.setFullYear(2021);

		let date = new Date();
		let days = Math.round((date.getTime() - startdate.getTime()) / 86400000);
		if (days === 0) {
			days = 1;
		}
		const result = await CategoryReports2.aggregate([
			{
				$project: {
					impression: '$impression',
					click: '$click',
					category: '$category',
					Name: '$Name',
					tier1: '$tier1',
					tier2: '$tier2',
					tier3: '$tier3',
					tier4: '$tier4',
					genderCategory: '$genderCategory',
					AgeCategory: '$AgeCategory',
					feed: '$feed',
					new_taxonamy: '$new_taxonamy'
				}
			},
			{ $addFields: { avgimpression: { $divide: [ '$impression', days ] } } },
			{ $match: { feed: '' } },
			{ $sort: { impression: -1 } }
		]);
		res.status(200).json(result);
	} catch (err) {
		console.log(err.message);
		res.status(400).json({ error: err });
	}
});

router.post('/categorydata_video', adminauth, async (req, res) => {
	try {
		let startdate = new Date();
		startdate.setDate(18);
		startdate.setMonth(06);
		startdate.setFullYear(2021);

		let date = new Date();
		let days = Math.round((date.getTime() - startdate.getTime()) / 86400000);
		if (days === 0) {
			days = 1;
		}
		const result = await categoryreports.aggregate([
			{
				$project: {
					test: { $dateToString: { format: '%Y-%m-%d', date: '$createdOn' } },
					category: 1,
					rtbType: 1,
					CompanionClickTracking: 1,
					SovClickTracking: 1,
					impression: 1
				}
			},
			{ $match: { test: { $gt: '2021-07-18' } } },
			{
				$group: {
					_id: { category: '$category', rtbType: '$rtbType' },
					CompanionClickTracking: { $sum: '$CompanionClickTracking' },
					SovClickTracking: { $sum: '$SovClickTracking' },
					impressions: { $sum: '$impression' }
				}
			},

			{
				$lookup: {
					from: 'categoryreports2',
					localField: '_id.category',
					foreignField: 'category',
					as: 'extra_details'
				}
			},
			// { $unwind: { path: '$extra_details', preserveNullAndEmptyArrays: true } },
			{
				$lookup: {
					from: 'categoryreports2',
					localField: '_id.category',
					foreignField: 'new_taxonamy',
					as: 'extra_details1'
				}
			},
			// { $unwind: { path: '$extra_details1', preserveNullAndEmptyArrays: true } },
			{
				$project: {
					rtbType: '$_id.rtbType',
					category: '$_id.category',
					CompanionClickTracking: 1,
					SovClickTracking: 1,
					impressions: 1,
					extra_details: { $first: '$extra_details' },
					extra_details1: { $first: '$extra_details1' }
				}
			},
			{ $addFields: { avgimpression: { $divide: [ '$impressions', days ] } } },
			{
				$project: {
					rtbType: '$_id.rtbType',
					category: '$_id.category',
					CompanionClickTracking: 1,
					SovClickTracking: 1,
					impressions: 1,
					avgimpression: 1,
					extra_details: { $ifNull: [ '$extra_details', '$extra_details1' ] }
				}
			},
			{ $match: { rtbType: 'video' } },
			{ $sort: { impressions: -1 } }
		]);
		res.status(200).json(result);
	} catch (err) {
		console.log(err.message);
		res.status(400).json({ error: err });
	}
});

router.post('/get_server_report', adminauth, async (req, res) => {
	try {
		let result = await Serverreport.aggregate([
			{ $sort: { createdOn: -1 } },
			{ $limit: 3 },
			{
				$project: {
					test: { $dateToString: { format: '%Y-%m-%d', date: '$createdOn' } },
					name: '$servername',
					status: '$runningstatus',
					date: '$test'
				}
			}
		]);
		res.status(200).json(result);
	} catch (err) {
		console.log(err.message);
		res.status(400).json({ error: err.message });
	}
});

router.put('/podcastepisodereports', async (req, res) => {
	try {
		const { campaignId } = req.body;
		var ids = campaignId ? campaignId.map((id) => mongoose.Types.ObjectId(id)) : [];
		let result = await Campaignwisereports.aggregate([
			{ $match: { campaignId: { $in: ids } } },
			{ $match: { bundlename: { $exists: true } } },
			{ $match: { feed: '3' } },
			{
				$group: {
					_id: { episode: '$bundlename', publisher: '$appId' },
					impressions: { $sum: '$impression' },
					CompanionClickTracking: { $sum: '$CompanionClickTracking' },
					SovClickTracking: { $sum: '$SovClickTracking' }
				}
			},
			{
				$lookup: {
					from: 'podcastepisodes2',
					localField: '_id.episode',
					foreignField: 'episodename',
					as: 'episode_details'
				}
			},
			{ $addFields: { new_appid: { $toObjectId: '$_id.publisher' } } },
			{
				$lookup: {
					from: 'publisherapps',
					localField: 'new_appid',
					foreignField: '_id',
					as: 'publisher_details'
				}
			},
			{
				$project: {
					publisher: { $first: '$publisher_details' },
					episode: { $first: '$episode_details' },
					impressions: 1,
					CompanionClickTracking: '$CompanionClickTracking',
					SovClickTracking: '$SovClickTracking'
				}
			},
			{
				$project: {
					publishername: '$publisher.AppName',
					episode: '$episode_details.episodename',
					impressions: 1,
					click: { $add: [ '$CompanionClickTracking', '$SovClickTracking' ] }
				}
			},
			{
				$project: {
					publishername: 1,
					episode: 1,
					impressions: 1,
					click: 1,
					ctr: { $cond: [ { $ne: [ '$impressions', 0 ] }, { $divide: [ '$click', '$impressions' ] }, 0 ] }
				}
			},
			{
				$project: {
					publishername: 1,
					episode: 1,
					impressions: 1,
					click: 1,
					ctr: { $round: { $multiply: [ '$ctr', 100 ] } }
				}
			},
			{
				$project: {
					publishername: 1,
					episode: 1,
					impressions: 1,
					click: 1,
					ctr: { $divide: [ '$ctr', 100 ] }
				}
			},
			{ $sort: { impressions: -1 } }
		]);
		res.status(200).json(result);
	} catch (err) {
		console.log(err.message);
		res.status(400).json({ error: err.message });
	}
});

module.exports = router;
