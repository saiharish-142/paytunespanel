const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const campaignifareports = mongoose.model('campaignifareports');
const frequencyreports = mongoose.model('frequencyreports');
const adminauth = require('../authenMiddleware/adminauth');

router.get('/reports', adminauth, (req, res) => {
	campaignifareports
		.find()
		.limit(300)
		.sort('-createdOn')
		.then(async (result) => {
			res.json(result);
		})
		.catch((er) => res.status(400).json(er));
});

router.put('/frequency', adminauth, (req, res) => {
	const { campaignId } = req.body;
	var audio = campaignId.audio.map((id) => mongoose.Types.ObjectId(id));
	var display = campaignId.display.map((id) => mongoose.Types.ObjectId(id));
	var video = campaignId.video.map((id) => mongoose.Types.ObjectId(id));
	campaignifareports
		.aggregate([
			{
				$facet: {
					audio: [
						{ $match: { campaignId: { $in: audio } } },
						{ $group: { _id: '$impression', count: { $sum: 1 } } }
					],
					display: [
						{ $match: { campaignId: { $in: display } } },
						{ $group: { _id: '$impression', count: { $sum: 1 } } }
					],
					video: [
						{ $match: { campaignId: { $in: video } } },
						{ $group: { _id: '$impression', count: { $sum: 1 } } }
					]
				}
			}
		])
		.then((respo) => {
			res.json(respo[0]);
		})
		.catch((err) => console.log(err));
});

router.put('/sumfrequency', adminauth, (req, res) => {
	const { campaignId } = req.body;
	var audio = campaignId.audio.map((id) => mongoose.Types.ObjectId(id));
	var display = campaignId.display.map((id) => mongoose.Types.ObjectId(id));
	var video = campaignId.video.map((id) => mongoose.Types.ObjectId(id));
	frequencyreports
		.aggregate([
			{
				$facet: {
					audio: [
						{ $match: { campaignId: { $in: audio } } },
						{ $group: { _id: '$frequency', users: { $sum: '$users' } } }
					],
					display: [
						{ $match: { campaignId: { $in: display } } },
						{ $group: { _id: '$frequency', users: { $sum: '$users' } } }
					],
					video: [
						{ $match: { campaignId: { $in: video } } },
						{ $group: { _id: '$frequency', users: { $sum: '$users' } } }
					]
				}
			}
		])
		.then((respo) => {
			res.json(respo[0]);
		})
		.catch((err) => console.log(err));
});

module.exports = router;
