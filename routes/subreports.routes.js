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
const Campaignwisereports = mongoose.model('campaignwisereports');
// const CategoryReports = mongoose.model('categoryreports');
const CategoryReports = require('../models/categoryreports');
const adminauth = require('../authenMiddleware/adminauth');
const categoryreports = require('../models/categoryreports');
const publisherwiseConsole = mongoose.model('publisherwiseConsole');
const frequencyConsole = mongoose.model('frequencyConsole');

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
		])
		.then((result) => res.json(result))
		.catch((err) => res.status(422).json(err));
});

router.put('/zipbycampidsallcombo', adminauth, (req, res) => {
	const { campaignId } = req.body;
	// var ids = campaignId ? campaignId.map(id=>mongoose.Types.ObjectId(id)) : dumd
	var audio = campaignId.audio.map((id) => mongoose.Types.ObjectId(id));
	var display = campaignId.display.map((id) => mongoose.Types.ObjectId(id));
	var video = campaignId.video.map((id) => mongoose.Types.ObjectId(id));
	zipreports
		.aggregate([
			{
				$facet: {
					audio: [
						{ $match: { campaignId: { $in: audio } } },
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
						{ $match: { campaignId: { $in: display } } },
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
						{ $match: { campaignId: { $in: video } } },
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
			{ $match: { campaignId: { $in: ids } } },
			// {$addFields:{"temp_phone":"$phoneModel"}},
			// {$project:{phoneModel:{$toLower:'$phoneModel'},
			//     campaignId:"$campaignId",
			//     impression:"$impression",
			//     CompanionClickTracking:"$CompanionClickTracking",
			//     SovClickTracking:"$SovClickTracking",
			//     start:"$start",
			//     midpoint:"$midpoint",
			//     thirdQuartile:"$thirdQuartile",
			//     complete:"$complete",
			//     createdOn:"$createdOn",
			//     temp_phone:1
			// }},
			{
				$lookup: {
					from: 'phonemodel2reports',
					localField: 'phoneModel',
					foreignField: 'make_model',
					as: 'extra'
				}
			},
			{ $unwind: { path: '$extra', preserveNullAndEmptyArrays: true } },
			{
				$group: {
					_id: { combined_make_and_model: '$extra.combined_make_model' },
					campaignId: { $push: '$campaignId' },
					impression: { $sum: '$impression' },
					CompanionClickTracking: { $sum: '$CompanionClickTracking' },
					SovClickTracking: { $sum: '$SovClickTracking' },
					start: { $sum: '$start' },
					midpoint: { $sum: '$midpoint' },
					thirdQuartile: { $sum: '$thirdQuartile' },
					complete: { $sum: '$complete' },
					createdOn: { $push: '$createdOn' },
					extra: { $first: '$extra' }
					// cost:{$first:"$extra.cost"},
					// release:{$first:"$extra.release"},
					// type:{$first:"$extra.type"}
				}
			},

			{
				$project: {
					phoneModel: '$_id.phoneModel',
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
					extra: '$extra'
				}
			}
		])
		.then((result) => res.json(result))
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

router.put('/uniqueusersbycampids', adminauth, (req, res) => {
	const { campaignId } = req.body;
	const dumd = [];
	var ids = campaignId ? campaignId.map((id) => mongoose.Types.ObjectId(id)) : dumd;
	uniqueuserreports
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
		.aggregate([{ $match: { campaignId: { $in: ids } } }])
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
			{ $unwind: { path: '$extra_details', preserveNullAndEmptyArrays: true } },
			{
				$lookup: {
					from: 'categoryreports2',
					localField: '_id.category',
					foreignField: 'new_taxonamy',
					as: 'extra_details1'
				}
			},
			{ $unwind: { path: '$extra_details1', preserveNullAndEmptyArrays: true } },
			{ $sort: { impressions: -1 } },
			{
				$project: {
					impressions: 1,
					CompanionClickTracking: 1,
					SovClickTracking: 1,
					extra_details: { $ifNull: ['$extra_details', '$extra_details1'] }
				}
			},
			{
				$project: {
					impressions: 1,
					CompanionClickTracking: 1,
					SovClickTracking: 1,
					extra_details: { $ifNull: ['$extra_details', {}] }
				}
			}
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
			{ $unwind: { path: '$extra_details', preserveNullAndEmptyArrays: true } },
			{
				$lookup: {
					from: 'categoryreports2',
					localField: '_id.category',
					foreignField: 'new_taxonamy',
					as: 'extra_details1'
				}
			},
			{ $unwind: { path: '$extra_details1', preserveNullAndEmptyArrays: true } },
			{ $sort: { impressions: -1 } },
			{
				$project: {
					impressions: 1,
					CompanionClickTracking: 1,
					SovClickTracking: 1,
					extra_details: { $ifNull: ['$extra_details', '$extra_details1'] }
				}
			},
			{
				$project: {
					impressions: 1,
					CompanionClickTracking: 1,
					SovClickTracking: 1,
					extra_details: { $ifNull: ['$extra_details', {}] }
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
			{ $unwind: { path: '$extra_details', preserveNullAndEmptyArrays: true } },
			{
				$lookup: {
					from: 'categoryreports2',
					localField: '_id.category',
					foreignField: 'new_taxonamy',
					as: 'extra_details1'
				}
			},
			{ $unwind: { path: '$extra_details1', preserveNullAndEmptyArrays: true } },
			{ $sort: { impressions: -1 } },
			{
				$project: {
					impressions: 1,
					CompanionClickTracking: 1,
					SovClickTracking: 1,
					extra_details: { $ifNull: ['$extra_details', '$extra_details1'] }
				}
			},
			{
				$project: {
					impressions: 1,
					CompanionClickTracking: 1,
					SovClickTracking: 1,
					extra_details: { $ifNull: ['$extra_details', {}] }
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

router.get('/publisherComplete2', adminauth, async (req, res) => {
	let audio = await publisherwiseConsole.find({ type: 'audio' }).catch((err) => console.log(err));
	let display = await publisherwiseConsole.find({ type: 'display' }).catch((err) => console.log(err));
	let video = await publisherwiseConsole.find({ type: 'video' }).catch((err) => console.log(err));
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
	res.json({ audio: audio, display: display, video: video, complete: compo });
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
		const phone = await phonemodel2.aggregate([{ $sort: { impression: -1 } }]);

		// const phone = await phonemodelreports.aggregate([
		// 	{
		// 		$lookup: {
		// 			from: 'phonemodel2reports',
		// 			localField: 'phoneModel',
		// 			foreignField: 'make_model',
		// 			as: 'extra_details'
		// 		}
		// 	},
		// 	{ $unwind: { path: '$extra_details', preserveNullAndEmptyArrays: true } },
		// 	{
		// 		$project: {
		// 			phoneModel: 1,
		// 			impression: 1,
		// 			extra_details: {
		// 				$ifNull: [
		// 					'$extra_details',
		// 					{
		// 						make_model: '',
		// 						cost: '',
		// 						cumulative: '',
		// 						release: '',
		// 						company: '',
		// 						type: '',
		// 						total_percent: '',
		// 						model: '',
		// 						combined_make_model: ''
		// 					}
		// 				]
		// 			}
		// 		}
		// 	},
		// 	{
		// 		$match: {
		// 			$or: [
		// 				{ 'extra_details.make_model': '' },
		// 				{ 'extra_details.cumulative': '' },
		// 				{ 'extra_details.release': '' },
		// 				{ 'extra_details.company': '' },
		// 				{ 'extra_details.type': '' },
		// 				{ 'extra_details.total_percent': '' },
		// 				{ 'extra_details.model': '' },
		// 				{ 'extra_details.cost': '' }
		// 			]
		// 		}
		// 	},
		// 	{
		// 		$group: {
		// 			_id: { make_model: '$phoneModel' },
		// 			impressions: { $sum: '$impression' },
		// 			extra: { $first: '$extra_details' }
		// 		}
		// 	},
		// 	{
		// 		$project: {
		// 			impressions: 1,
		// 			make_model: '$_id.make_model',
		// 			cost: '$extra.cost',
		// 			cumulative: '$extra.cumulative',
		// 			release: '$extra.release',
		// 			company: '$extra.company',
		// 			type: '$extra.type',
		// 			model: '$extra.model',
		// 			total_percent: '$extra.total_percent',
		// 			combined_make_and_model: '$extra.combined_make_model'
		// 		}
		// 	},
		// 	{ $sort: { impressions: -1 } }
		//]);

		res.status(200).json(phone);
	} catch (err) {
		console.log(err.message);
		res.status(400).json({ error: err });
	}
});

router.get('/zipdata', adminauth, async (req, res) => {
	try {
		let startdate=new Date();
		startdate.setDate(21);
		startdate.setMonth(06);
		startdate.setFullYear(2021);
		

		let date = new Date();
		let days= Math.round((date.getTime()-startdate.getTime())/86400000)
		if(days===0){
			days=1;
		}
		const result = await Zipreports2.aggregate([

			{ $match: { requests: { $exists: true } } },
			{$addFields:{avgrequest:{$divide:["$requests",days]}}},
			{ $sort: { impression: -1 } }
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
		const result = await CategoryReports2.aggregate([
			{ $match: { impression: { $exists: true }, click: { $exists: true } } },
			// 	{$group:{_id:{category:"$category",feed:"$feed"},
			// 	Name:{$first:"$Name"},
			// 	tier1:{$first:"$tier1"},
			// 	tier2:{$first:"$tier2"},
			// 	tier3:{$first:"$tier3"},
			// 	tier4:{$first:"$tier4"},
			// 	genderCategory:{$first:"$gendercategory"},
			// 	AgeCategory:{$first:"$AgeCategory"},
			// 	new_taxonamy:{$first:"$new_taxonamy"},
			// 	impression:{$sum:"$impression"},
			// 	click:{$sum:"$click"}
			// }}
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
					creativeid: { $ifNull: ['$creativesetId', null] },
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
					creative_id: { $cond: [{ $eq: ['$creativeid', ''] }, null, '$creativeid'] },
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
					creativeids: { $cond: [{ $eq: ['$creative_id', 'null'] }, null, '$creative_id'] },
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
		const result = await CategoryReports2.find({ feed: '3' });
		res.status(200).json(result);
	} catch (err) {
		console.log(err.message);
		res.status(400).json({ error: err });
	}
});

router.post('/categorydata_ondemand', adminauth, async (req, res) => {
	try {
		const result = await CategoryReports2.find({ feed: '' });
		res.status(200).json(result);
	} catch (err) {
		console.log(err.message);
		res.status(400).json({ error: err });
	}
});

router.post('/categorydata_video', adminauth, async (req, res) => {
	try {
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
					_id: { category: "$category", rtbType: "$rtbType" },
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
					rtbType: "$_id.rtbType",
					category: "$_id.category",
					CompanionClickTracking: 1,
					SovClickTracking: 1,
					impressions: 1,
					extra_details: { $first: "$extra_details" },
					extra_details1: { $first: "$extra_details1" },
				}
			},
			{
				$project: {
					rtbType: "$_id.rtbType",
					category: "$_id.category",
					CompanionClickTracking: 1,
					SovClickTracking: 1,
					impressions: 1,
					extra_details: { $ifNull: ['$extra_details', '$extra_details1'] }
				}
			},
			{ $match: { rtbType: "video" } },
		])
		res.status(200).json(result);
	} catch (err) {
		console.log(err.message);
		res.status(400).json({ error: err });
	}
});

module.exports = router;
