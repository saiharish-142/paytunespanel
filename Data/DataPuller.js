const ObjectsToCsv = require('objects-to-csv');
var mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const adminauth = require('../authenMiddleware/adminauth');
// const freqpublishreports = mongoose.model('freqpublishreports');
const trackinglogs = mongoose.model('trackinglogs');
const tempModel = mongoose.model('tempModel');

router.get('/question1', adminauth, async (req, res) => {
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
		// var num = data.length;
		for (var i = 0; i < data.length; i++) {
			const storer = new tempModel({
				time: data[i].createdOn,
				campaignId: data[i].campaignId,
				impression: data[i].data.impression ? data[i].data.impression : 0,
				click: data[i].data.click ? data[i].data.click : 0,
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
	} catch (e) {
		console.log(e);
		res.status(422).json({ err: e });
	}
});

async function datareturner() {
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

const expo = {
	funca: datareturner,
	route: router
};
module.exports = expo;
