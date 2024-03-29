const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const StreamingAds = mongoose.model('streamingads');
const bindstreamingads = mongoose.model('bindstreamingads');
const adsetting = mongoose.model('adsetting');
const adminauth = require('../authenMiddleware/adminauth');
const campaignClient = mongoose.model('campaignClient');
const campaignwisereports = mongoose.model('campaignwisereports');
const publisherapps = mongoose.model('publisherapps');

router.get('/', adminauth, (req, res) => {
	StreamingAds.find()
		.sort('-createdOn')
		.then((ads) => {
			res.json(ads);
		})
		.catch((err) => console.log(err));
});

router.put('/byids', adminauth, (req, res) => {
	const { campaignId } = req.body;
	var ids = campaignId ? campaignId.map((id) => mongoose.Types.ObjectId(id)) : dumd;
	StreamingAds.find({ _id: { $in: ids } })
		.sort('-createdOn')
		.then((ads) => {
			res.json(ads);
		})
		.catch((err) => console.log(err));
});

router.get('/names', adminauth, (req, res) => {
	StreamingAds.find({}, { _id: 1, AdTitle: 1 })
		.sort('-createdOn')
		.then((ads) => {
			res.json(ads);
		})
		.catch((err) => console.log(err));
});

router.get('/allads', adminauth, (req, res) => {
	StreamingAds.find(
		{},
		{
			_id: 1,
			AdTitle: 1,
			Advertiser: 1,
			Category: 1,
			Pricing: 1,
			PricingModel: 1,
			startDate: 1,
			endDate: 1,
			createdOn: 1
		}
	)
		.sort('-createdOn')
		.then((ads) => {
			res.json(ads);
		})
		.catch((err) => console.log(err));
});

router.get('/allads/:id', adminauth, (req, res) => {
	StreamingAds.find({ _id: req.params.id })
		.sort('-createdOn')
		.then((ads) => {
			res.json(ads);
		})
		.catch((err) => console.log(err));
});

router.put('/updatename/:id', adminauth, (req, res) => {
	StreamingAds.findById(req.params.id)
		.then((streamad) => {
			if (req.body.adtitle) {
				streamad.AdTitle = req.body.adtitle;
			}
			streamad
				.save()
				.then((result) => {
					res.json({ result, message: 'title updated' });
				})
				.catch((err) => console.log(err));
		})
		.catch((err) => console.log(err));
});

router.put('/reqtarget', adminauth, (req, res) => {
	const { ids } = req.body;
	StreamingAds.find({ _id: { $in: ids } })
		.then((result) => {
			var resu = result;
			var resd = [];
			resu.map((ad) => resd.push({ _id: ad._id, TargetImpressions: ad.TargetImpressions }));
			res.json(resd);
		})
		.catch((err) => {
			console.log(err);
			res.status(404).json(err);
		});
});

router.get('/grouped', adminauth, (req, res) => {
	StreamingAds.aggregate([
		{
			$project: {
				AdTitle: { $toLower: '$AdTitle' },
				Category: '$Category',
				startDate: '$startDate',
				endDate: '$endDate',
				Advertiser: '$Advertiser',
				Pricing: '$Pricing',
				PricingModel: '$PricingModel',
				createdOn: '$createdOn'
			}
		},
		{
			$project: {
				AdTitle: { $split: [ '$AdTitle', '_' ] },
				Category: '$Category',
				Advertiser: '$Advertiser',
				Pricing: '$Pricing',
				startDate: '$startDate',
				endDate: '$endDate',
				PricingModel: '$PricingModel',
				createdOn: '$createdOn'
			}
		},
		{
			$project: {
				AdTitle: { $slice: [ '$AdTitle', 2 ] },
				Category: '$Category',
				Advertiser: '$Advertiser',
				Pricing: '$Pricing',
				startDate: '$startDate',
				endDate: '$endDate',
				PricingModel: '$PricingModel',
				createdOn: { $substr: [ '$createdOn', 0, 10 ] }
			}
		},
		{
			$project: {
				AdTitle: {
					$reduce: {
						input: '$AdTitle',
						initialValue: '',
						in: {
							$concat: [ '$$value', { $cond: [ { $eq: [ '$$value', '' ] }, '', '_' ] }, '$$this' ]
						}
					}
				},
				Category: '$Category',
				startDate: '$startDate',
				endDate: '$endDate',
				Advertiser: '$Advertiser',
				Pricing: '$Pricing',
				PricingModel: '$PricingModel',
				createdOn: '$createdOn'
			}
		},
		{ $sort: { createdOn: -1 } },
		{
			$group: {
				_id: '$AdTitle',
				Category: { $push: '$Category' },
				Advertiser: { $push: '$Advertiser' },
				Pricing: { $push: '$Pricing' },
				startDate: { $push: '$startDate' },
				endDate: { $push: '$endDate' },
				PricingModel: { $push: '$PricingModel' },
				createdOn: { $push: '$createdOn' }
			}
		},
		{
			$project: {
				Adtitle: '$_id',
				Category: '$Category',
				Advertiser: '$Advertiser',
				Pricing: '$Pricing',
				startDate: '$startDate',
				endDate: '$endDate',
				PricingModel: '$PricingModel',
				createdOn: { $arrayElemAt: [ '$createdOn', 0 ] }
			}
		},
		{ $sort: { createdOn: -1 } }
	])
		.then((respo) => {
			var data = [];
			data = respo;
			data.forEach((ad) => {
				var resCategory = [].concat.apply([], ad.Category);
				resCategory = [ ...new Set(resCategory) ];
				ad.Category = resCategory;
				var resAdvertiser = [].concat.apply([], ad.Advertiser);
				resAdvertiser = [ ...new Set(resAdvertiser) ];
				ad.Advertiser = resAdvertiser;
				var resPricing = [].concat.apply([], ad.Pricing);
				resPricing = [ ...new Set(resPricing) ];
				ad.Pricing = resPricing;
				var resPricingModel = [].concat.apply([], ad.PricingModel);
				resPricingModel = [ ...new Set(resPricingModel) ];
				ad.PricingModel = resPricingModel;
				return ad;
			});
			res.json(data);
		})
		.catch((err) => console.log(err));
});

router.get('/groupedMod1', adminauth, (req, res) => {
	StreamingAds.aggregate([
		{
			$project: {
				AdTitle: { $toLower: '$AdTitle' },
				Category: '$Category',
				startDate: '$startDate',
				endDate: '$endDate',
				Advertiser: '$Advertiser',
				Pricing: '$Pricing',
				PricingModel: '$PricingModel',
				createdOn: '$createdOn'
			}
		},
		{
			$project: {
				AdTitle: { $split: [ '$AdTitle', '_' ] },
				Category: '$Category',
				Advertiser: '$Advertiser',
				Pricing: '$Pricing',
				startDate: '$startDate',
				endDate: '$endDate',
				PricingModel: '$PricingModel',
				createdOn: '$createdOn'
			}
		},
		{
			$project: {
				AdTitle: { $slice: [ '$AdTitle', 2 ] },
				Category: '$Category',
				Advertiser: '$Advertiser',
				Pricing: '$Pricing',
				startDate: '$startDate',
				endDate: '$endDate',
				PricingModel: '$PricingModel',
				createdOn: { $substr: [ '$createdOn', 0, 10 ] }
			}
		},
		{
			$project: {
				AdTitle: {
					$reduce: {
						input: '$AdTitle',
						initialValue: '',
						in: {
							$concat: [ '$$value', { $cond: [ { $eq: [ '$$value', '' ] }, '', '_' ] }, '$$this' ]
						}
					}
				},
				Category: '$Category',
				startDate: '$startDate',
				endDate: '$endDate',
				Advertiser: '$Advertiser',
				Pricing: '$Pricing',
				PricingModel: '$PricingModel',
				createdOn: '$createdOn'
			}
		},
		{ $sort: { createdOn: -1 } },
		{
			$group: {
				_id: '$AdTitle',
				Category: { $push: '$Category' },
				Advertiser: { $push: '$Advertiser' },
				Pricing: { $push: '$Pricing' },
				startDate: { $push: '$startDate' },
				endDate: { $push: '$endDate' },
				PricingModel: { $push: '$PricingModel' },
				createdOn: { $push: '$createdOn' }
			}
		},
		{
			$project: {
				Adtitle: '$_id',
				Category: '$Category',
				Advertiser: '$Advertiser',
				Pricing: '$Pricing',
				startDate: '$startDate',
				endDate: '$endDate',
				PricingModel: '$PricingModel',
				createdOn: { $arrayElemAt: [ '$createdOn', 0 ] }
			}
		},
		{ $sort: { createdOn: -1 } }
	])
		.then((respo) => {
			var data = [];
			data = respo;
			data.forEach((ad) => {
				var resCategory = [].concat.apply([], ad.Category);
				resCategory = [ ...new Set(resCategory) ];
				ad.Category = resCategory.length ? resCategory[0] : '';
				var resAdvertiser = [].concat.apply([], ad.Advertiser);
				resAdvertiser = [ ...new Set(resAdvertiser) ];
				ad.Advertiser = resAdvertiser.length ? resAdvertiser[0] : '';
				var resPricing = [].concat.apply([], ad.Pricing);
				resPricing = [ ...new Set(resPricing) ];
				ad.Pricing = resPricing.length ? resPricing[0] : '';
				var resPricingModel = [].concat.apply([], ad.PricingModel);
				resPricingModel = [ ...new Set(resPricingModel) ];
				ad.PricingModel = resPricingModel.length ? resPricingModel[0] : '';
				var resEnddate =
					ad.endDate && ad.endDate.length
						? ad.endDate.sort(function(a, b) {
								var da = new Date(a);
								var db = new Date(b);
								return db - da;
							})
						: '';
				ad.endDate = resEnddate && resEnddate.length ? resEnddate[0] : '';
				var resstartDate =
					ad.startDate && ad.startDate.length
						? ad.startDate.sort(function(a, b) {
								var da = new Date(a);
								var db = new Date(b);
								return da - db;
							})
						: '';
				ad.startDate = resstartDate && resstartDate.length ? resstartDate[0] : '';
				var remainingdays = 0;
				var d1 = new Date(ad.endDate);
				var d2 = new Date(Date.now());
				// console.log(d1,d2)
				var show = d1.getTime() - d2.getTime();
				remainingdays = show / (1000 * 3600 * 24);
				if (remainingdays < 0) {
					remainingdays = 'completed campaign';
				}
				ad.remainingDays = remainingdays;
				return ad;
			});
			res.json(data);
		})
		.catch((err) => console.log(err));
});

router.get('/groupedMangename', adminauth, (req, res) => {
	StreamingAds.aggregate([
		{
			$project: {
				AdTitle: { $toLower: '$AdTitle' },
				createdOn: '$createdOn'
			}
		},
		{
			$project: {
				AdTitle: { $split: [ '$AdTitle', '_' ] },
				createdOn: '$createdOn'
			}
		},
		{
			$project: {
				AdTitle: { $slice: [ '$AdTitle', 2 ] },
				createdOn: { $substr: [ '$createdOn', 0, 10 ] }
			}
		},
		{
			$project: {
				AdTitle: {
					$reduce: {
						input: '$AdTitle',
						initialValue: '',
						in: {
							$concat: [ '$$value', { $cond: [ { $eq: [ '$$value', '' ] }, '', '_' ] }, '$$this' ]
						}
					}
				},
				createdOn: '$createdOn'
			}
		},
		{ $sort: { createdOn: -1 } },
		{
			$group: {
				_id: '$AdTitle',
				createdOn: { $push: '$createdOn' }
			}
		},
		{
			$project: {
				Adtitle: '$_id',
				createdOn: { $arrayElemAt: [ '$createdOn', 0 ] }
			}
		},
		{ $sort: { createdOn: -1 } }
	])
		.then((result) => {
			res.json(result);
		})
		.catch((err) => {
			console.log(err);
			res.status(404).json({ error: 'something went wrong', err });
		});
});

router.get('/clientcamps', adminauth, (req, res) => {
	campaignClient
		.find({ userid: res.locals.user._id })
		.then((result) => {
			var sao = result;
			sao.map((ad) => {
				var remainingdays = 0;
				var d1 = new Date(ad.endDate);
				var d2 = new Date(Date.now());
				// console.log(d1,d2)
				var show = d1.getTime() - d2.getTime();
				remainingdays = show / (1000 * 3600 * 24);
				if (remainingdays < 0) {
					remainingdays = 'completed campaign';
				}
				ad.remainingDays = remainingdays;
				return ad;
			});
			res.json(sao);
		})
		.catch((err) => {
			console.log(err);
			res.status(400).json({ err, error: 'Something went wrong' });
		});
});

router.get('/Acampaigns', adminauth, (req, res) => {
	campaignClient
		.find({})
		.populate({ path: 'userid', select: 'username' })
		.then((result) => {
			var sao = result;
			sao.map((ad) => {
				var remainingdays = 0;
				var d1 = new Date(ad.endDate);
				var d2 = new Date(Date.now());
				// console.log(d1,d2)
				var show = d1.getTime() - d2.getTime();
				remainingdays = show / (1000 * 3600 * 24);
				if (remainingdays < 0) {
					remainingdays = 'completed campaign';
				}
				ad.remainingDays = remainingdays;
				return ad;
			});
			res.json(sao);
		})
		.catch((err) => {
			console.log(err);
			res.status(400).json({ err, error: 'Something went wrong' });
		});
});

router.put('/clientgrouped', adminauth, (req, res) => {
	const { Advertiser } = req.body;
	StreamingAds.aggregate([
		{ $match: { Advertiser: Advertiser } },
		{
			$project: {
				AdTitle: { $toLower: '$AdTitle' },
				Category: '$Category',
				startDate: '$startDate',
				endDate: '$endDate',
				Advertiser: '$Advertiser',
				Pricing: '$Pricing',
				PricingModel: '$PricingModel',
				createdOn: '$createdOn'
			}
		},
		{
			$project: {
				AdTitle: { $split: [ '$AdTitle', '_' ] },
				Category: '$Category',
				Advertiser: '$Advertiser',
				Pricing: '$Pricing',
				startDate: '$startDate',
				endDate: '$endDate',
				PricingModel: '$PricingModel',
				createdOn: '$createdOn'
			}
		},
		{
			$project: {
				AdTitle: { $slice: [ '$AdTitle', 2 ] },
				Category: '$Category',
				Advertiser: '$Advertiser',
				Pricing: '$Pricing',
				startDate: '$startDate',
				endDate: '$endDate',
				PricingModel: '$PricingModel',
				createdOn: { $substr: [ '$createdOn', 0, 10 ] }
			}
		},
		{
			$project: {
				AdTitle: {
					$reduce: {
						input: '$AdTitle',
						initialValue: '',
						in: {
							$concat: [ '$$value', { $cond: [ { $eq: [ '$$value', '' ] }, '', '_' ] }, '$$this' ]
						}
					}
				},
				Category: '$Category',
				startDate: '$startDate',
				endDate: '$endDate',
				Advertiser: '$Advertiser',
				Pricing: '$Pricing',
				PricingModel: '$PricingModel',
				createdOn: '$createdOn'
			}
		},
		{ $sort: { createdOn: -1 } },
		{
			$group: {
				_id: '$AdTitle',
				Category: { $push: '$Category' },
				Advertiser: { $push: '$Advertiser' },
				Pricing: { $push: '$Pricing' },
				startDate: { $push: '$startDate' },
				endDate: { $push: '$endDate' },
				PricingModel: { $push: '$PricingModel' },
				createdOn: { $push: '$createdOn' }
			}
		},
		{
			$project: {
				Adtitle: '$_id',
				Category: '$Category',
				Advertiser: '$Advertiser',
				Pricing: '$Pricing',
				startDate: '$startDate',
				endDate: '$endDate',
				PricingModel: '$PricingModel',
				createdOn: { $arrayElemAt: [ '$createdOn', 0 ] }
			}
		},
		{ $sort: { createdOn: -1 } }
	])
		.then((respo) => {
			var data = [];
			data = respo;
			data.forEach((ad) => {
				var resCategory = [].concat.apply([], ad.Category);
				resCategory = [ ...new Set(resCategory) ];
				ad.Category = resCategory;
				var resAdvertiser = [].concat.apply([], ad.Advertiser);
				resAdvertiser = [ ...new Set(resAdvertiser) ];
				ad.Advertiser = resAdvertiser;
				var resPricing = [].concat.apply([], ad.Pricing);
				resPricing = [ ...new Set(resPricing) ];
				ad.Pricing = resPricing;
				var resPricingModel = [].concat.apply([], ad.PricingModel);
				resPricingModel = [ ...new Set(resPricingModel) ];
				ad.PricingModel = resPricingModel;
				return ad;
			});
			res.json(data);
		})
		.catch((err) => console.log(err));
});

router.put('/clientgroupedbyids', adminauth, (req, res) => {
	const { campaignId } = req.body;
	console.log(campaignId);
	var ids = campaignId ? campaignId.map((id) => mongoose.Types.ObjectId(id)) : [];
	StreamingAds.aggregate([
		{ $match: { _id: { $in: ids } } },
		{
			$project: {
				AdTitle: { $toLower: '$AdTitle' },
				Category: '$Category',
				startDate: '$startDate',
				endDate: '$endDate',
				Advertiser: '$Advertiser',
				Pricing: '$Pricing',
				PricingModel: '$PricingModel',
				createdOn: '$createdOn'
			}
		},
		{
			$project: {
				AdTitle: { $split: [ '$AdTitle', '_' ] },
				Category: '$Category',
				Advertiser: '$Advertiser',
				Pricing: '$Pricing',
				startDate: '$startDate',
				endDate: '$endDate',
				PricingModel: '$PricingModel',
				createdOn: '$createdOn'
			}
		},
		{
			$project: {
				AdTitle: { $slice: [ '$AdTitle', 2 ] },
				Category: '$Category',
				Advertiser: '$Advertiser',
				Pricing: '$Pricing',
				startDate: '$startDate',
				endDate: '$endDate',
				PricingModel: '$PricingModel',
				createdOn: { $substr: [ '$createdOn', 0, 10 ] }
			}
		},
		{
			$project: {
				AdTitle: {
					$reduce: {
						input: '$AdTitle',
						initialValue: '',
						in: {
							$concat: [ '$$value', { $cond: [ { $eq: [ '$$value', '' ] }, '', '_' ] }, '$$this' ]
						}
					}
				},
				Category: '$Category',
				startDate: '$startDate',
				endDate: '$endDate',
				Advertiser: '$Advertiser',
				Pricing: '$Pricing',
				PricingModel: '$PricingModel',
				createdOn: '$createdOn'
			}
		},
		{ $sort: { createdOn: -1 } },
		{
			$group: {
				_id: '$AdTitle',
				Category: { $push: '$Category' },
				Advertiser: { $push: '$Advertiser' },
				Pricing: { $push: '$Pricing' },
				startDate: { $push: '$startDate' },
				endDate: { $push: '$endDate' },
				PricingModel: { $push: '$PricingModel' },
				createdOn: { $push: '$createdOn' }
			}
		},
		{
			$project: {
				Adtitle: '$_id',
				Category: '$Category',
				Advertiser: '$Advertiser',
				Pricing: '$Pricing',
				startDate: '$startDate',
				endDate: '$endDate',
				PricingModel: '$PricingModel',
				createdOn: { $arrayElemAt: [ '$createdOn', 0 ] }
			}
		},
		{ $sort: { createdOn: -1 } }
	])
		.then((respo) => {
			var data = [];
			data = respo;
			data.forEach((ad) => {
				var resCategory = [].concat.apply([], ad.Category);
				resCategory = [ ...new Set(resCategory) ];
				ad.Category = resCategory.length ? resCategory[0] : '';
				var resAdvertiser = [].concat.apply([], ad.Advertiser);
				resAdvertiser = [ ...new Set(resAdvertiser) ];
				ad.Advertiser = resAdvertiser.length ? resAdvertiser[0] : '';
				var resPricing = [].concat.apply([], ad.Pricing);
				resPricing = [ ...new Set(resPricing) ];
				ad.Pricing = resPricing.length ? resPricing[0] : '';
				var resPricingModel = [].concat.apply([], ad.PricingModel);
				resPricingModel = [ ...new Set(resPricingModel) ];
				ad.PricingModel = resPricingModel.length ? resPricingModel[0] : '';
				var resEnddate =
					ad.endDate && ad.endDate.length
						? ad.endDate.sort(function(a, b) {
								var da = new Date(a);
								var db = new Date(b);
								return db - da;
							})
						: '';
				ad.endDate = resEnddate && resEnddate.length ? resEnddate[0] : '';
				var resstartDate =
					ad.startDate && ad.startDate.length
						? ad.startDate.sort(function(a, b) {
								var da = new Date(a);
								var db = new Date(b);
								return da - db;
							})
						: '';
				ad.startDate = resstartDate && resstartDate.length ? resstartDate[0] : '';
				var remainingdays = 0;
				var d1 = new Date(ad.endDate);
				var d2 = new Date(Date.now());
				// console.log(d1,d2)
				var show = d1.getTime() - d2.getTime();
				remainingdays = show / (1000 * 3600 * 24);
				if (remainingdays < 0) {
					remainingdays = 'completed campaign';
				}
				ad.remainingDays = remainingdays;
				return ad;
			});
			res.json(data);
		})
		.catch((err) => console.log(err));
});

function arr_diff(a1, a2) {
	var a = [],
		diff = [];
	for (var i = 0; i < a1.length; i++) {
		a[a1[i]] = true;
	}
	for (var i = 0; i < a2.length; i++) {
		if (a[a2[i]]) {
			delete a[a2[i]];
		}
	}
	for (var k in a) {
		diff.push(k);
	}
	return diff;
}

function remove_duplicates_arrayobject(gotarray, unique) {
	var obj = {};
	var array = gotarray;
	// console.log(array)
	for (var i = 0, len = array.length; i < len; i++) obj[array[i][unique]] = array[i];

	array = new Array();
	for (var key in obj) array.push(obj[key]);

	return array;
}

const removeDuplicates = (inputArray) => {
	const ids = [];
	console.log(inputArray);
	if (inputArray) {
		return inputArray.reduce((sum, element) => {
			if (!ids.includes(element.toString())) {
				sum.push(element);
				ids.push(element.toString());
			}
			return sum;
		}, []);
	} else {
		return [];
	}
};

router.put('/groupedsingle', adminauth, (req, res) => {
	const { adtitle } = req.body;
	StreamingAds.aggregate([
		{
			$project: {
				id: '$_id',
				AdTitle: { $toLower: '$AdTitle' },
				startDate: '$startDate',
				endDate: '$endDate',
				TargetImpressions: '$TargetImpressions',
				createdOn: '$createdOn'
			}
		},
		{
			$match: {
				AdTitle: { $regex: adtitle.toLowerCase() }
			}
		},
		{
			$project: {
				id: '$id',
				AdTitle: { $split: [ '$AdTitle', '_' ] },
				startDate: '$startDate',
				endDate: '$endDate',
				TargetImpressions: '$TargetImpressions',
				createdOn: '$createdOn'
			}
		},
		{
			$project: {
				id: '$id',
				AdTitle: { $slice: [ '$AdTitle', 2 ] },
				startDate: '$startDate',
				endDate: '$endDate',
				TargetImpressions: '$TargetImpressions',
				createdOn: { $substr: [ '$createdOn', 0, 10 ] }
			}
		},
		{
			$project: {
				id: '$id',
				AdTitle: {
					$reduce: {
						input: '$AdTitle',
						initialValue: '',
						in: {
							$concat: [ '$$value', { $cond: [ { $eq: [ '$$value', '' ] }, '', '_' ] }, '$$this' ]
						}
					}
				},
				startDate: '$startDate',
				endDate: '$endDate',
				TargetImpressions: '$TargetImpressions',
				createdOn: '$createdOn'
			}
		},
		{ $sort: { createdOn: -1 } },
		{
			$group: {
				id: { $push: '$id' },
				_id: '$AdTitle',
				startDate: { $push: '$startDate' },
				endDate: { $push: '$endDate' },
				TargetImpressions: { $push: { TR: '$TargetImpressions', id: '$id' } },
				createdOn: { $push: '$createdOn' }
			}
		},
		{
			$project: {
				id: '$id',
				Adtitle: '$_id',
				startDate: '$startDate',
				endDate: '$endDate',
				TargetImpressions: '$TargetImpressions',
				createdOn: { $arrayElemAt: [ '$createdOn', 0 ] }
			}
		},
		{ $sort: { createdOn: -1 } }
	])
		.then(async (respo) => {
			var data;
			data = respo.length && respo[0];
			if (data) {
				var ids =
					typeof campaignId !== 'undefined' &&
					typeof campaignId !== 'string' &&
					typeof campaignId !== 'object'
						? data.id.map((id) => mongoose.Types.ObjectId(id))
						: data.id;
				let id_spliter = await adsetting
					.find({ campaignId: { $in: ids } }, { campaignId: 1, type: 1, targetImpression: 1 })
					.catch((err) => console.log(err));
				data.ids = { audio: [], audimpression: 0, display: [], disimpression: 0, video: [], vidimpression: 0 };
				data.TargetImpressions = [ ...new Set(data.TargetImpressions) ];
				id_spliter = remove_duplicates_arrayobject(id_spliter, 'campaignId');
				if (id_spliter.length) {
					var audioids = id_spliter.filter((x) => x.type === 'audio');
					var displayids = id_spliter.filter((x) => x.type === 'display');
					var videoids = id_spliter.filter((x) => x.type === 'video');
					var selectedids = [];
					audioids.map((x) => {
						data.ids.audio.push(x.campaignId.toString());
						selectedids.push(x.campaignId.toString());
						data.ids.audimpression += parseInt(x.targetImpression);
						// data.TargetImpressions.map((tar) => {
						// 	// console.log(tar.id,x.campaignId,tar.id===x.campaignId,tar.id==x.campaignId,x.campaignId.equals(tar.id))
						// 	if (x.campaignId.equals(tar.id)) {
						// 		// console.log(tar)
						// 		data.ids.audimpression += parseInt(tar.TR);
						// 	}
						// });
					});
					data.ids.audio = [ ...new Set(data.ids.audio) ];
					// data.ids.audimpression = audioimpre;
					displayids.map((x) => {
						data.ids.display.push(x.campaignId.toString());
						selectedids.push(x.campaignId.toString());
						data.ids.disimpression += parseInt(x.targetImpression);
						// data.TargetImpressions.map((tar) => {
						// 	if (x.campaignId.equals(tar.id)) {
						// 		// console.log(tar)
						// 		data.ids.disimpression += parseInt(tar.TR);
						// 	}
						// });
					});
					data.ids.display = [ ...new Set(data.ids.display) ];
					videoids.map((x) => {
						data.ids.video.push(x.campaignId.toString());
						selectedids.push(x.campaignId.toString());
						data.ids.vidimpression += parseInt(x.targetImpression);
						// data.TargetImpressions.map((tar) => {
						// 	if (x.campaignId.equals(tar.id)) {
						// 		// console.log(tar)
						// 		data.ids.vidimpression += parseInt(tar.TR);
						// 	}
						// });
					});
					data.ids.video = [ ...new Set(data.ids.video) ];
					var leftids = [];
					leftids = arr_diff(selectedids, data.id);
					// var leftids = ids.filter(x=> !selectedids.includes(x))
					data.leftids = leftids;
					if (leftids && leftids.length) {
						await leftids.map((id) => data.ids.audio.push(id));
						data.ids.audio = [ ...new Set(data.ids.audio) ];
						data.ids.audio = removeDuplicates(data.ids.audio);
						// var tagr = data.TargetImpressions.filter((x) => leftids.includes(x.id));
						// console.log(tagr)
						// console.log(data.ids.audimpression,leftids,data.TargetImpressions)
						leftids.map((x) => {
							data.TargetImpressions.map((tar) => {
								// console.log(x,tar.id)
								// console.log(x===tar.id)
								// console.log(tar.id.equals(x))
								if (tar.id.equals(x)) {
									// console.log(tar,x,data.ids.audimpression)
									data.ids.audimpression += parseInt(tar.TR);
								}
							});
						});
						console.log(data.ids.audimpression);
						data.ids.audio = [ ...new Set(data.ids.audio) ];
					}
				} else {
					data.ids.audio = ids;
					var dattarget = data.TargetImpressions;
					dattarget.map((ar) => {
						data.ids.audimpression += parseInt(ar.TR);
					});
				}
				var resstartDate = [].concat.apply([], data.startDate);
				resstartDate = [ ...new Set(resstartDate) ];
				data.startDate = resstartDate;
				var resendDate = [].concat.apply([], data.endDate);
				resendDate = [ ...new Set(resendDate) ];
				data.endDate = resendDate;
				// data.splendid = id_spliter
				// var tottar = 0;
				// data.TargetImpressions.forEach(num=> tottar += parseInt(num))
				// data.TargetImpressions = tottar
				res.json(data);
			} else {
				res.status(422).json({ error: 'somthing went wrong try again' });
			}
		})
		.catch((err) => console.log(err));
});

const musicids = [
	'13698',
	'jiosaavn',
	'18880',
	'18878',
	'22308',
	'22310',
	'11726',
	'5efac6f9aeeeb92b8a1ee056',
	'5a1e46beeb993dc67979412e',
	'5b2210af504f3097e73e0d8b',
	'5adeeb79cf7a7e3e5d822106',
	'5d10c405844dd970bf41e2af'
];

function idmatchCheker(id, arr) {
	for (var i = 0; i < arr.length; i++) {
		if (arr[i].toString() === id.toString()) {
			return true;
		}
	}
	return false;
}

async function idsreturnspliter(ids) {
	var dads = { dem: [], pod: [], mus: [] };
	var audio = ids && ids.length ? ids.map((id) => mongoose.Types.ObjectId(id)) : [];
	var music = [];
	var podca = [];
	var onDem = [];
	let depo = await campaignwisereports
		.aggregate([
			{ $match: { campaignId: { $in: audio }, feed: { $in: [ '3', 3 ] } } },
			{
				$group: {
					_id: null,
					campaignId: { $push: '$campaignId' }
				}
			}
		])
		.catch((err) => console.log(err));
	if (depo.length) {
		depo[0].campaignId.map((x) => podca.push(x));
		audio = arr_diff(audio, podca);
		podca = removeDuplicates(podca);
		audio = audio && audio.length ? audio.map((id) => mongoose.Types.ObjectId(id)) : [];
		let som = await campaignwisereports
			.aggregate([
				{ $match: { apppubid: { $in: musicids }, campaignId: { $in: audio } } },
				{ $group: { _id: null, campaignId: { $push: '$campaignId' } } }
			])
			.catch((err) => console.log(err));
		som = som[0] && som[0].campaignId;
		som = [ ...new Set(som) ];
		som.map((x) => music.push(x));
		audio = arr_diff(audio, som);
		audio.map((x) => onDem.push(x));
		music = removeDuplicates(music);
		podca = removeDuplicates(podca);
		onDem = removeDuplicates(onDem);
		dads.pod = podca;
		dads.dem = onDem;
		dads.mus = music;
	} else {
		dads.dem = ids;
	}
	return dads;
}

router.put('/groupedsingleClient', adminauth, (req, res) => {
	const { adtitle, onDemand, podcast, audio, display, video, musicapps } = req.body;
	try {
		StreamingAds.aggregate([
			{
				$project: {
					id: '$_id',
					startDate: '$startDate',
					endDate: '$endDate',
					AdTitle: { $toLower: '$AdTitle' }
				}
			},
			{
				$match: {
					AdTitle: { $regex: adtitle.toLowerCase() }
				}
			},
			{
				$group: {
					_id: null,
					id: { $push: '$id' },
					Adtitle: { $push: '$AdTitle' },
					startDate: { $push: '$startDate' },
					endDate: { $push: '$endDate' }
				}
			}
		])
			.then(async (respo) => {
				var data;
				data = respo.length && respo[0];
				if (data) {
					var startD =
						data.startDate && data.startDate.length
							? data.startDate.sort(function(a, b) {
									return new Date(a) - new Date(b);
								})[0]
							: '';
					var endD =
						data.endDate && data.endDate.length
							? data.endDate.sort(function(b, a) {
									return new Date(a) - new Date(b);
								})[0]
							: '';
					var ids =
						typeof campaignId !== 'undefined' &&
						typeof campaignId !== 'string' &&
						typeof campaignId !== 'object'
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
					data.startDate = startD;
					data.endDate = endD;
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
								var dataonDem = id_spliter.filter((x) =>
									idmatchCheker(x.campaignId, data.ids.onDemand)
								);
								dataonDem.map((im) => {
									data.ids.subimpression.dem += parseInt(im.targetImpression);
								});
							}
							if (data.ids.podcast.length) {
								var datapodcast = id_spliter.filter((x) =>
									idmatchCheker(x.campaignId, data.ids.podcast)
								);
								datapodcast.map((im) => {
									data.ids.subimpression.pod += parseInt(im.targetImpression);
								});
							}
							if (data.ids.musicapps.length) {
								var datamusic = id_spliter.filter((x) =>
									idmatchCheker(x.campaignId, data.ids.musicapps)
								);
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
							var dattarget =
								data.TargetImpressions && data.TargetImpressions.length ? data.TargetImpressions : [];
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
					res.json(data);
				} else {
					console.log(respo);
					res.status(422).json({ error: 'somthing went wrong try again' });
				}
			})
			.catch((err) => console.log(err));
	} catch (e) {
		console.log(e);
		res.status(422).json({ error: 'somthing went wrong try again', e });
	}
});

router.put('/groupedbundleClient', adminauth, (req, res) => {
	const { id, onDemand, podcast, audio, display, video, musicapps } = req.body;
	bindstreamingads
		.findById(id)
		.then(async (respo) => {
			var data = {};
			if (respo.ids) data['id'] = respo.ids;
			if (data.id) {
				var ids =
					typeof campaignId !== 'undefined' &&
					typeof campaignId !== 'string' &&
					typeof campaignId !== 'object'
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
					data.ids.audio = ids;
					var dattarget = data.TargetImpressions;
					dattarget.map((ar) => {
						data.ids.audimpression += parseInt(ar.TR);
					});
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
				res.json(data);
			} else {
				res.status(422).json({ error: 'somthing went wrong try again' });
			}
		})
		.catch((err) => console.log(err));
});
// ## $split and then $slice it

router.put('/getids', adminauth, (req, res) => {
	const { adtitle } = req.body;
	StreamingAds.aggregate([
		{
			$project: {
				_id: '$_id',
				AdTitle: { $toLower: '$AdTitle' }
			}
		},
		{
			$match: {
				AdTitle: { $regex: adtitle.toLowerCase() }
			}
		},
		{
			$project: {
				id: '$_id'
			}
		}
	])
		.then((resp) => {
			var ids = [];
			resp.map((re) => {
				ids.push(re.id);
			});
			res.json(ids);
		})
		.catch((err) => console.log(err));
});

router.get('/alladsp', adminauth, (req, res) => {
	StreamingAds.find({ endDate: { $gte: req.body.date } })
		.sort('-createdOn')
		.then((ads) => {
			res.json(ads);
		})
		.catch((err) => console.log(err));
});

router.get('/allads2', adminauth, (req, res) => {
	const { date } = req.body;
	var dat = new Date(date);
	StreamingAds.find({ createdAt: { $gte: dat } })
		.sort('-createdOn')
		.then((ads) => {
			res.json(ads);
		})
		.catch((err) => console.log(err));
});

router.post('/addAds', adminauth, (req, res) => {
	const {
		AdTitle,
		adType,
		offset,
		Category,
		Description,
		Advertiser,
		AudioPricing,
		BannerPricing,
		Pricing,
		PricingModel,
		Expires,
		minAge,
		maxAge,
		Gender,
		Billing,
		enable,
		Genre,
		platformType,
		language,
		ConnectionType,
		phoneValue,
		phoneType,
		ARPU,
		City,
		State,
		Age,
		Companion,
		Linear,
		endDate,
		startDate,
		Duration,
		maxARPU,
		minARPU,
		TargetImpressions
	} = req.body;
	if (!AdTitle || !Category || !Advertiser) {
		return res.status(422).json({ error: 'Enter the required Fields' });
	}
	const streamad = new StreamingAds({
		AdTitle,
		adType,
		offset,
		Category,
		Description,
		Advertiser,
		AudioPricing,
		BannerPricing,
		Pricing,
		PricingModel,
		Expires,
		minAge,
		maxAge,
		Gender,
		Billing,
		enable,
		Genre,
		platformType,
		language,
		ConnectionType,
		phoneValue,
		phoneType,
		ARPU,
		City,
		State,
		Age,
		Companion,
		Linear,
		endDate,
		startDate,
		Duration,
		maxARPU,
		minARPU,
		TargetImpressions
	});
	streamad
		.save()
		.then((result) => {
			res.json(result);
		})
		.catch((err) => console.log(err));
});

module.exports = router;

// MyModel.find({$text: {$search: searchString}})
//        .skip(20)
//        .limit(10)
//        .exec(function(err, docs) { ... });
