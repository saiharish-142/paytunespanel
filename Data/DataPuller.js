const ObjectsToCsv = require('objects-to-csv');
var mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const adminauth = require('../authenMiddleware/adminauth');
// const freqpublishreports = mongoose.model('freqpublishreports');
const trackinglogs = mongoose.model('trackinglogs');
const trackinglogs8oct21 = mongoose.model('trackinglogs8oct21');
const trackinglogs_29jan22 = mongoose.model('trackinglogs_29jan22');
const tempModel = mongoose.model('tempModel');
const tempModel1 = mongoose.model('tempModel1');
const tempModel2 = mongoose.model('tempModel2');
const zipsumreport = mongoose.model('zipsumreport');
const StreamingAds = mongoose.model('streamingads');
const zipreports = mongoose.model('zipreports');
const CategoryReports2 = require('../models/categoryreports2');
const Zipreports2 = mongoose.model('zipreports2');
const adsetting = mongoose.model('adsetting');

router.get('/question1', adminauth, async (req, res) => {
	try {
		let data = await trackinglogs.aggregate([
			{
				$match: {
					type: {
						$in: [
							'impression',
							'complete',
							'click',
							'companionclicktracking',
							'clicktracking',
							'firstquartile',
							'thirdquartile',
							'midpoint',
							'start'
						]
					}
				}
			},
			{
				$project: {
					campaignId: '$campaignId',
					createdOn: { $hour: '$createdOn' },
					type: '$type'
				}
			},
			{
				$project: {
					campaignId: '$campaignId',
					createdOn: {
						$function: {
							body: function(createdOn) {
								if (createdOn >= 5 && createdOn < 9) {
									return '5 - 9';
								} else if (createdOn >= 9 && createdOn < 11) {
									return '9 - 11';
								} else if (createdOn >= 11 && createdOn < 15) {
									return '11 - 15';
								} else if (createdOn >= 15 && createdOn < 19) {
									return '15 - 19';
								} else if (createdOn >= 19) {
									return '19 - 24';
								} else {
									return '24 - 5';
								}
							},
							args: [ '$createdOn' ],
							lang: 'js'
						}
					},
					type: '$type'
				}
			},
			{
				$group: {
					_id: { campaignId: '$campaignId', createdOn: '$createdOn', type: '$type' },
					count: { $sum: 1 }
				}
			},
			{
				$group: {
					_id: { campaignId: '$_id.campaignId', createdOn: '$_id.createdOn' },
					data: { $push: { k: '$_id.type', v: '$count' } }
				}
			},
			{
				$project: {
					campaignId: '$_id.campaignId',
					createdOn: '$_id.createdOn',
					data: { $arrayToObject: '$data' }
				}
			}
		]);
		// var num = data.length;
		for (var i = 0; i < data.length; i++) {
			const storer = new tempModel({
				time: data[i].createdOn,
				campaignId: data[i].campaignId,
				firstquartile: data[i].data.firstquartile ? data[i].data.firstquartile : 0,
				thirdquartile: data[i].data.thirdquartile ? data[i].data.thirdquartile : 0,
				midpoint: data[i].data.midpoint ? data[i].data.midpoint : 0,
				start: data[i].data.start ? data[i].data.start : 0,
				impression: data[i].data.impression ? data[i].data.impression : 0,
				click: data[i].data.click
					? data[i].data.click
					: 0 + data[i].data.companionclicktracking
						? data[i].data.companionclicktracking
						: 0 + data[i].data.clicktracking ? data[i].data.clicktracking : 0,
				complete: data[i].data.complete ? data[i].data.complete : 0
			});
			storer
				.save()
				.then((result) => {
					console.log('saved', i--);
				})
				.catch((err) => {
					console.log('err', i--);
				});
		}
	} catch (e) {
		console.log(e);
		res.status(422).json({ err: e });
	}
});

router.get('/question2', adminauth, async (req, res) => {
	const { startDate, endDate } = req.body;
	console.log('started');
	try {
		let data = await trackinglogs_29jan22
			.aggregate([
				{
					$project: {
						type: '$type',
						zip: '$zip',
						test: { $dateToString: { format: '%Y-%m-%d', date: '$createdOn' } }
					}
				},
				{
					$match: {
						type: {
							$in: [ 'impression', 'complete', 'click', 'companionclicktracking', 'clicktracking' ]
						},
						test: { $gte: startDate, $lt: endDate }
					}
				},
				{
					$group: {
						_id: '$zip',
						impression: {
							$sum: {
								$cond: [ { $eq: [ '$type', 'impression' ] }, 1, 0 ]
							}
						},
						complete: {
							$sum: {
								$cond: [ { $eq: [ '$type', 'complete' ] }, 1, 0 ]
							}
						},
						click: {
							$sum: {
								$cond: [
									{ $in: [ '$type', [ 'click', 'companionclicktracking', 'clicktracking' ] ] },
									1,
									0
								]
							}
						}
					}
				}
			])
			.allowDiskUse(true);
		var num = data.length;
		console.log(num);
		for (var i = 0; i < data.length; i++) {
			let tempo = await tempModel1.findOne({ zip: data[i]._id });
			if (tempo) {
				if (tempo.startDate === startDate) {
					return console.log('Already Done', i);
				}
				tempo.startDate = startDate;
				tempo.impression += data[i].impression ? data[i].impression : 0;
				tempo.complete += data[i].complete ? data[i].complete : 0;
				tempo.click += data[i].click ? data[i].click : 0;
				tempo
					.save()
					.then((result) => {
						console.log('Updated', i);
					})
					.catch((err) => console.log('error', i, err));
			} else {
				const storer = new tempModel1({
					zip: data[i]._id,
					startDate,
					impression: data[i].impression ? data[i].impression : 0,
					click: data[i].click ? data[i].click : 0,
					complete: data[i].complete ? data[i].complete : 0
				});
				storer
					.save()
					.then((result) => {
						console.log('saved', i);
					})
					.catch((err) => {
						console.log('err', i);
					});
			}
		}
	} catch (e) {
		console.log(e);
		res.status(422).json({ err: e });
	}
});

router.get('/getdataPin', adminauth, async (req, res) => {
	var data = await tempModel1.find();
	var zipData = await Zipreports2.aggregate([ { $match: { pincode: { $gt: 99999, $lt: 1000000 } } } ]);
	console.log(data.length, zipData.length);
	var zipdataStore = {};
	var datareturner = [];
	zipData.map((x) => {
		zipdataStore[x.pincode] = x;
	});
	console.log(zipdataStore);
	data.map((x) => {
		if (x.impression <= 600) return;
		let temp = zipdataStore[x.zip];
		console.log(x.zip, temp);
		datareturner.push({
			zip: x.zip,
			area: temp ? temp.area : '',
			lowersubcity: temp ? temp.lowersubcity : '',
			subcity: temp ? temp.subcity : '',
			city: temp ? temp.city : '',
			grandcity: temp ? temp.grandcity : '',
			district: temp ? temp.district : '',
			state: temp ? temp.state : '',
			grandstate: temp ? temp.grandstate : '',
			impression: x.impression,
			click: x.click,
			complete: x.complete
		});
	});
	res.json(datareturner);
});

router.get('/question3', adminauth, async (req, res) => {
	const { startDate, endDate } = req.body;
	try {
		let data = await trackinglogs
			.aggregate([
				{
					$match: {
						type: {
							$in: [ 'impression', 'complete', 'click', 'companionclicktracking', 'clicktracking' ]
						},
						date: { $gte: startDate, $lt: endDate }
					}
				},
				{
					$group: {
						_id: { zip: '$zip', type: '$type' },
						count: { $sum: 1 }
					}
				},
				{
					$group: {
						_id: { zip: '$_id.zip' },
						data: { $push: { k: '$_id.type', v: '$count' } }
					}
				},
				{
					$project: {
						zip: '$_id.zip',
						data: { $arrayToObject: '$data' }
					}
				}
			])
			.allowDiskUse(true);
		var num = data.length;
		console.log(num);
		for (var i = 0; i < data.length; i++) {
			let tempo = await tempModel1.findOne({ zip: data[i].zip });
			if (tempo) {
				if (tempo.startDate === startDate) {
					return console.log('Already Done', i);
				}
				tempo.startDate = startDate;
				tempo.impression += data[i].data.impression ? data[i].data.impression : 0;
				tempo.click += data[i].data.click
					? data[i].data.click
					: 0 + data[i].data.companionclicktracking
						? data[i].data.companionclicktracking
						: 0 + data[i].data.clicktracking ? data[i].data.clicktracking : 0;
				tempo.complete += data[i].data.complete ? data[i].data.complete : 0;
				tempo
					.save()
					.then((result) => {
						console.log('Updated', i);
					})
					.catch((err) => console.log('error', i, err));
			} else {
				const storer = new tempModel1({
					zip: data[i].zip,
					startDate,
					impression: data[i].data.impression ? data[i].data.impression : 0,
					click: data[i].data.click
						? data[i].data.click
						: 0 + data[i].data.companionclicktracking
							? data[i].data.companionclicktracking
							: 0 + data[i].data.clicktracking ? data[i].data.clicktracking : 0,
					complete: data[i].data.complete ? data[i].data.complete : 0
				});
				storer
					.save()
					.then((result) => {
						console.log('saved', i);
					})
					.catch((err) => {
						console.log('err', i);
					});
			}
		}
	} catch (e) {
		console.log(e);
		res.status(422).json({ err: e });
	}
});

router.get('/question4', adminauth, async (req, res) => {
	try {
		let data = await trackinglogs
			.aggregate([
				{
					$match: {
						type: {
							$in: [
								'impression',
								'complete',
								'click',
								'companionclicktracking',
								'clicktracking',
								'firstquartile',
								'thirdquartile',
								'midpoint',
								'start'
							]
						}
					}
				},
				{
					$project: {
						campaignId: '$campaignId',
						phoneModel: '$phoneModel',
						type: '$type'
					}
				},
				{
					$project: {
						campaignId: '$campaignId',
						phoneModel: '$phoneModel',
						type: '$type'
					}
				},
				{
					$group: {
						_id: { campaignId: '$campaignId', phoneModel: '$phoneModel', type: '$type' },
						count: { $sum: 1 }
					}
				},
				{
					$group: {
						_id: { campaignId: '$_id.campaignId', phoneModel: '$_id.phoneModel' },
						data: { $push: { k: '$_id.type', v: '$count' } }
					}
				},
				{
					$project: {
						campaignId: '$_id.campaignId',
						phoneModel: '$_id.phoneModel',
						data: { $arrayToObject: '$data' }
					}
				}
			])
			.allowDiskUse(true);
		var num = data.length;
		console.log(num);
		for (var i = 0; i < data.length; i++) {
			const storer = new tempModel2({
				phoneModel: data[i].phoneModel,
				campaignId: data[i].campaignId,
				firstquartile: data[i].data.firstquartile ? data[i].data.firstquartile : 0,
				thirdquartile: data[i].data.thirdquartile ? data[i].data.thirdquartile : 0,
				midpoint: data[i].data.midpoint ? data[i].data.midpoint : 0,
				start: data[i].data.start ? data[i].data.start : 0,
				impression: data[i].data.impression ? data[i].data.impression : 0,
				click: data[i].data.click
					? data[i].data.click
					: 0 + data[i].data.companionclicktracking
						? data[i].data.companionclicktracking
						: 0 + data[i].data.clicktracking ? data[i].data.clicktracking : 0,
				complete: data[i].data.complete ? data[i].data.complete : 0
			});
			storer
				.save()
				.then((result) => {
					console.log('saved', i--);
				})
				.catch((err) => {
					console.log('err', i--);
				});
		}
	} catch (e) {
		console.log(e);
		res.status(422).json({ err: e });
	}
});

async function datareturner22() {
	try {
		let data = await trackinglogs.aggregate([
			{ $match: { type: { $in: [ 'impression', 'complete', 'click' ] } } },
			{
				$project: {
					campaignId: '$campaignId',
					createdOn: { $hour: '$createdOn' },
					type: '$type'
				}
			},
			{
				$project: {
					campaignId: '$campaignId',
					createdOn: {
						$function: {
							body: function(createdOn) {
								if (createdOn >= 5 && createdOn < 9) {
									return '5-9';
								} else if (createdOn >= 9 && createdOn < 11) {
									return '9-11';
								} else if (createdOn >= 11 && createdOn < 15) {
									return '11-15';
								} else if (createdOn >= 15 && createdOn < 19) {
									return '15-19';
								} else if (createdOn >= 19) {
									return '19-24';
								} else {
									return '24-5';
								}
							},
							args: [ '$createdOn' ],
							lang: 'js'
						}
					},
					type: '$type'
				}
			},
			{
				$group: {
					_id: { campaignId: '$campaignId', createdOn: '$createdOn', type: '$type' },
					count: { $sum: 1 }
				}
			},
			{
				$group: {
					_id: { campaignId: '$_id.campaignId', createdOn: '$_id.createdOn' },
					data: { $push: { k: '$_id.type', v: '$count' } }
				}
			},
			{
				$project: {
					campaignId: '$_id.campaignId',
					createdOn: '$_id.createdOn',
					data: { $arrayToObject: '$data' }
				}
			}
		]);
		//
	} catch (e) {
		console.log(e);
	}
}
// datareturner();
async function datareturner() {
	try {
		var data = await tempModel.find();
		var obj = {};
		obj.arr = new Array();
		data.map((x) => {
			if (!obj[x.time + x.campaignId]) {
				obj[x.time + x.campaignId] = true;
				obj.arr.push(x);
			}
		});
		data = obj.arr;
		// console.log(data.length);
		// data = obj.arr.filter((value, index) => {
		// 	const _value = JSON.stringify(value);
		// 	return (
		// 		index ===
		// 		obj.arr.findIndex((obj) => {
		// 			return JSON.stringify(obj) === _value;
		// 		})
		// 	);
		// });
		var categoryData = await CategoryReports2.find().catch((err) => console.log(err));
		var categoryObj = {};
		categoryData.map((x) => {
			if (!categoryObj[x.category]) categoryObj[x.category] = x;
		});
		var adsSet = await adsetting.find({}).select('adCategory type campaignId').catch((err) => console.log(err));
		var adsSetObj = {};
		adsSet.map((x) => {
			if (!adsSetObj[x.campaignId]) {
				if (x.adCategory) {
					x.category = categoryObj[x.adCategory];
				}
				adsSetObj[x.campaignId] = x;
			}
		});
		console.log(data.length);
		StreamingAds.populate(
			data,
			{ path: 'campaignId', select: 'AdTitle startDate endDate Duration' },
			async function(err, populatedreports) {
				if (err) console.log(err);
				var temp = [];
				populatedreports.map((da) => {
					var type = '',
						category = '',
						name = '',
						tier1 = '',
						tier2 = '',
						tier3 = '',
						tier4 = '';
					if (adsSetObj[da.campaignId._id]) {
						type = adsSetObj[da.campaignId._id].type;
						category = adsSetObj[da.campaignId._id].adCategory;
						name = adsSetObj[da.campaignId._id].category ? adsSetObj[da.campaignId._id].category.Name : '';
						tier1 = adsSetObj[da.campaignId._id].category
							? adsSetObj[da.campaignId._id].category.tier1
							: '';
						tier2 = adsSetObj[da.campaignId._id].category
							? adsSetObj[da.campaignId._id].category.tier2
							: '';
						tier3 = adsSetObj[da.campaignId._id].category
							? adsSetObj[da.campaignId._id].category.tier3
							: '';
						tier4 = adsSetObj[da.campaignId._id].category
							? adsSetObj[da.campaignId._id].category.tier4
							: '';
					}
					temp.push({
						time: da.time,
						impression: da.impression,
						click: da.click,
						firstquartile: da.firstquartile,
						thirdquartile: da.thirdquartile,
						midpoint: da.midpoint,
						start: da.start,
						complete: da.complete,
						type,
						category,
						categoryName: name,
						tier1,
						tier2,
						tier3,
						tier4,
						AdTitle: da.campaignId.AdTitle,
						Duration: da.campaignId.Duration
					});
				});
				console.log(temp);
				const csv = new ObjectsToCsv(temp);
				await csv.toDisk('./Data1.csv').then((sol) => console.log(sol)).catch((er) => console.log(er));
			}
		);
	} catch (e) {
		console.log(e);
	}
}
// datareturner1();
async function datareturner1() {
	try {
		// var zipData = await Zipreports2.aggregate([ { $match: { pincode: { $gt: 99999, $lt: 1000000 } } } ]);
		// console.log(zipData.length);
		var data = await tempModel1.aggregate([
			{ $match: { impression: { $gte: 500 } } },
			{
				$lookup: {
					from: 'zipreports2',
					localField: 'zip',
					foreignField: 'pincode',
					as: 'extra'
				}
			},
			{ $unwind: { path: '$extra', preserveNullAndEmptyArrays: true } }
		]);
		console.log(data.length);
		// var zips = [];
		// data.map((x) => zips.push(x.zip));
		// var zippin = {};
		// zipData.map((x) => {
		// 	zippin[x.pincode] = x;
		// });
		var fileStore = [];
		data.map((x) => {
			console.log(XMLHttpRequest);
			fileStore.push({
				pincode: x.zip,
				city: x.extra ? x.extra.city : '',
				grandcity: x.extra ? x.extra.grandcity : '',
				district: x.extra ? x.extra.district : '',
				state: x.extra ? x.extra.state : '',
				grandstate: x.extra ? x.extra.grandstate : '',
				impression: x.impression,
				cilck: x.cilck,
				complete: x.complete
			});
		});
		const csv = new ObjectsToCsv(fileStore);
		await csv.toDisk('./Data2.csv').then((sol) => console.log(sol)).catch((er) => console.log(er));
		// var obj = {};
		// obj.arr = new Array();
		// data.map((x) => {
		// 	if (!obj[x.time + x.campaignId]) {
		// 		obj[x.time + x.campaignId] = true;
		// 		obj.arr.push(x);
		// 	}
		// });
		// data = obj.arr;
		// console.log(data.length);
		// data = obj.arr.filter((value, index) => {
		// 	const _value = JSON.stringify(value);
		// 	return (
		// 		index ===
		// 		obj.arr.findIndex((obj) => {
		// 			return JSON.stringify(obj) === _value;
		// 		})
		// 	);
		// });
		// var categoryData = await CategoryReports2.find().catch((err) => console.log(err));
		// var categoryObj = {};
		// categoryData.map((x) => {
		// 	if (!categoryObj[x.category]) categoryObj[x.category] = x;
		// });
		// var adsSet = await adsetting.find({}).select('adCategory type campaignId').catch((err) => console.log(err));
		// var adsSetObj = {};
		// adsSet.map((x) => {
		// 	if (!adsSetObj[x.campaignId]) {
		// 		if (x.adCategory) {
		// 			x.category = categoryObj[x.adCategory];
		// 		}
		// 		adsSetObj[x.campaignId] = x;
		// 	}
		// });
		// console.log(data.length);
		// StreamingAds.populate(
		// 	data,
		// 	{ path: 'campaignId', select: 'AdTitle startDate endDate Duration' },
		// 	async function(err, populatedreports) {
		// 		if (err) console.log(err);
		// 		var temp = [];
		// 		populatedreports.map((da) => {
		// 			var type = '',
		// 				category = '',
		// 				name = '',
		// 				tier1 = '',
		// 				tier2 = '',
		// 				tier3 = '',
		// 				tier4 = '';
		// 			if (adsSetObj[da.campaignId._id]) {
		// 				type = adsSetObj[da.campaignId._id].type;
		// 				category = adsSetObj[da.campaignId._id].adCategory;
		// 				name = adsSetObj[da.campaignId._id].category ? adsSetObj[da.campaignId._id].category.Name : '';
		// 				tier1 = adsSetObj[da.campaignId._id].category
		// 					? adsSetObj[da.campaignId._id].category.tier1
		// 					: '';
		// 				tier2 = adsSetObj[da.campaignId._id].category
		// 					? adsSetObj[da.campaignId._id].category.tier2
		// 					: '';
		// 				tier3 = adsSetObj[da.campaignId._id].category
		// 					? adsSetObj[da.campaignId._id].category.tier3
		// 					: '';
		// 				tier4 = adsSetObj[da.campaignId._id].category
		// 					? adsSetObj[da.campaignId._id].category.tier4
		// 					: '';
		// 			}
		// 			temp.push({
		// 				time: da.time,
		// 				impression: da.impression,
		// 				click: da.click,
		// 				firstquartile: da.firstquartile,
		// 				thirdquartile: da.thirdquartile,
		// 				midpoint: da.midpoint,
		// 				start: da.start,
		// 				complete: da.complete,
		// 				type,
		// 				category,
		// 				categoryName: name,
		// 				tier1,
		// 				tier2,
		// 				tier3,
		// 				tier4,
		// 				AdTitle: da.campaignId.AdTitle,
		// 				Duration: da.campaignId.Duration
		// 			});
		// 		});
		// 		console.log(temp);
		// 		const csv = new ObjectsToCsv(temp);
		// 		await csv.toDisk('./Data1.csv').then((sol) => console.log(sol)).catch((er) => console.log(er));
		// 	}
		// );
	} catch (e) {
		console.log(e);
	}
}
// datareturner3();
async function datareturner3() {
	try {
		let result = await zipreports.aggregate([
			{
				$group: {
					_id: { zip: '$zip', campaignId: '$campaignId' },
					impression: { $sum: '$impression' },
					start: { $sum: '$start' },
					midpoint: { $sum: '$midpoint' },
					thirdQuartile: { $sum: '$thirdQuartile' },
					complete: { $sum: '$complete' },
					impression: { $sum: '$impression' },
					clicks: { $add: [ '$CompanionClickTracking', '$SovClickTracking' ] },
					createdOn: { $push: '$createdOn' }
				}
			}
		]);
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
		// data;
		// console.log(data.length);
		// data = obj.arr.filter((value, index) => {
		// 	const _value = JSON.stringify(value);
		// 	return (
		// 		index ===
		// 		obj.arr.findIndex((obj) => {
		// 			return JSON.stringify(obj) === _value;
		// 		})
		// 	);
		// });
		// var categoryData = await CategoryReports2.find().catch((err) => console.log(err));
		// var categoryObj = {};
		// categoryData.map((x) => {
		// 	if (!categoryObj[x.category]) categoryObj[x.category] = x;
		// });
		// var adsSet = await adsetting.find({}).select('adCategory type campaignId').catch((err) => console.log(err));
		// var adsSetObj = {};
		// adsSet.map((x) => {
		// 	if (!adsSetObj[x.campaignId]) {
		// 		if (x.adCategory) {
		// 			x.category = categoryObj[x.adCategory];
		// 		}
		// 		adsSetObj[x.campaignId] = x;
		// 	}
		// });
		console.log(data.length);
		StreamingAds.populate(
			data,
			{ path: 'campaignId', select: 'AdTitle startDate endDate Duration' },
			async function(err, populatedreports) {
				if (err) console.log(err);
				var temp = [];
				populatedreports.map((da) => {
					temp.push({
						zip: da.zip,
						city: da.city,
						greatercity: da.grandcity,
						district: da.district,
						state: da.state,
						grandstate: da.grandstate,
						impression: da.impression,
						click: da.click,
						firstquartile: da.firstquartile,
						thirdquartile: da.thirdquartile,
						midpoint: da.midpoint,
						start: da.start,
						complete: da.complete,
						type,
						category,
						categoryName: name,
						tier1,
						tier2,
						tier3,
						tier4,
						AdTitle: da.campaignId.AdTitle,
						Duration: da.campaignId.Duration
					});
				});
				console.log(temp);
				const csv = new ObjectsToCsv(temp);
				await csv.toDisk('./Data1.csv').then((sol) => console.log(sol)).catch((er) => console.log(er));
			}
		);
	} catch (e) {
		console.log(e);
	}
}

const expo = {
	funca: datareturner,
	route: router
};
module.exports = expo;
