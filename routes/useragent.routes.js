const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const adminauth = require('../authenMiddleware/adminauth');
const useragentdata = mongoose.model('useragentdata');
const uareqreports = mongoose.model('uareqreports');

router.get('/getuseragentdata', adminauth, async (req, res) => {
	try {
		let startdate = new Date('2021-09-05');
		let date = new Date();
		let days = Math.round((date.getTime() - startdate.getTime()) / 86400000);
		if (days === 0) {
			days = 1;
		}
		let data = await uareqreports.aggregate([ { $group: { _id: '$ua', requests: { $sum: '$ads' } } } ]);
		var search = [];
		data.map((x) => search.push(x._id));
		let final = await useragentdata.find({ ua: { $in: search } });
		var solu = [];
		var temp = {};
		for (var i = 0; i < final.length; i++) {
			temp[final[i].ua] = final[i].display;
		}
		for (var j = 0; j < data.length; j++) {
			if (data[j] && data[j]._id)
				solu.push({
					ua: data[j]._id,
					display: temp[data[j]._id] ? temp[data[j]._id] : '',
					requests: data[j].requests,
					avgreq: data[j].requests / days
				});
		}
		res.json(solu);
	} catch (err) {
		console.log(err);
		res.status(400).json({ error: err });
	}
});

router.post('/adddisplay', adminauth, async (req, res) => {
	try {
		const { display, ua } = req.body;
		let match = await useragentdata.findOne({ ua: ua });
		if (match) {
			match.display = display;
			match.save().then((result) => {
				res.json({ message: 'saved..', result });
			});
		} else {
			const newdis = new useragentdata({
				ua: ua,
				display: display
			});
			newdis.save().then((result) => {
				res.json({ message: 'saved..', result });
			});
		}
	} catch (err) {
		res.status(400).json({ error: err.message });
		console.log(err.message);
	}
});

module.exports = router;
