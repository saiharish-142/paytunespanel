const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const mongoose = require('mongoose');
const cors = require('cors');
const { MONGOURI } = require('./config/keys');
// require('./db')
// require('./utils/script')
const cron = require('node-cron');
const phonemodel2reports = require('./models/phonemodel2reports');
// var connectTimeout = require('connect-timeout')

app.use(express.json({ limit: '50mb' }));
app.use(cors({ limit: '50mb' }));

const options = {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	serverSelectionTimeoutMS: 9000000,
	socketTimeoutMS: 9000000,
	useCreateIndex: true,
	useFindAndModify: false
};

mongoose.connect(MONGOURI, options);
mongoose.connection.on('connected', () => {
	console.log('connected to database.....');
});
mongoose.connection.on('error', (err) => {
	console.log('error in connection', err);
});

require('./models/user.model');
require('./models/streamingads.model');
require('./models/publisherapps.model');
require('./models/trackinglogs.model');
require('./models/oldtracking.model');
require('./models/wrappers.model');
require('./models/rtbrequests.model');
require('./models/report.model');
require('./models/campaignwisereports.model');
require('./models/adsettings.model');
require('./models/uniqueuser.model');
require('./models/bundlenamereports');
require('./models/campaignifareports');
require('./models/citylanguagereports');
require('./models/phonemakereports');
require('./models/phonemodelreports');
require('./models/phonemodel2reports');
require('./models/platformtypereports');
require('./models/frequencyreports.model');
require('./models/pptypereports');
require('./models/regionreports');
require('./models/spentreports');
require('./models/uniqueuserreports');
require('./models/zipreports');
require('./models/zipsumrepo.model');
require('./models/zipdata2reports');
require('./models/zipuniqueuserreports');
require('./models/bindingcollections.model');
require('./models/reqreports.js');
require('./models/resreports.js');
require('./models/phonemodel2reports.js');
require('./models/categoryreports');
require('./models/categoryreports2');
require('./models/apppublishers.model');
require('./models/publisherwiseConsole.model');
require('./models/frequencyConsole.model');
require('./models/campaignsClientmanage');
require('./models/freqencypublishcount.model');
require('./models/uareqreports.models');
require('./models/useragent.model');
require('./models/freqCampaignWise.model');
require('./models/campaignreportsum.model');

app.use('/auth', require('./routes/user.routes'));
app.use('/streamingads', require('./routes/streamingads.routes'));
app.use('/ads', require('./routes/adsetting.routes'));
app.use('/publishers', require('./routes/publisherapps.routes'));
app.use('/logs', require('./routes/trackinglogs.routes'));
app.use('/oldlogs', require('./routes/oldtracking.routes'));
app.use('/wrapper', require('./routes/wrapper.routes'));
app.use('/report', require('./routes/report.routes'));
app.use('/offreport', require('./routes/campaignwisereports.routes'));
app.use('/ifas', require('./routes/campaignifareports.routes'));
app.use('/rtbreq', require('./routes/rtbrequest.routes'));
app.use('/bundle', require('./routes/bundlenamereports.routes'));
app.use('/subrepo', require('./routes/subreports.routes'));
app.use('/bundles', require('./routes/bundling.routes'));
app.use('/useragent', require('./routes/useragent.routes'));

const commonfunctions = require('./repeater');
// commonfunctions.func1();
// commonfunctions.func2();
// commonfunctions.func3();
app.use('/repeat', commonfunctions.route);

if (process.env.NODE_ENV === 'production') {
	app.use(express.static('client/build'));
	const path = require('path');
	app.get('*', (req, res) => {
		res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
	});
}

app.listen(port, () => console.log(`app listening on port ${port}!`));

cron.schedule('04 00 * * *', function() {
	commonfunctions.func1('2021-10-10');
});

cron.schedule('00 09 * * *', function() {
	commonfunctions.func2();
});

cron.schedule('00 02 * * *', function() {
	var d = new Date();
	d.setDate(d.getDate());
	if (d.getDate() < 10) {
		if (d.getMonth() + 1 > 10) {
			var date = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + '0' + d.getDate();
		} else {
			var date = d.getFullYear() + '-' + '0' + (d.getMonth() + 1) + '-' + '0' + d.getDate();
		}
	} else {
		if (d.getMonth() + 1 > 10) {
			var date = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
		} else {
			var date = d.getFullYear() + '-' + '0' + (d.getMonth() + 1) + '-' + d.getDate();
		}
	}
	var currentTime = new Date();
	var currentOffset = currentTime.getTimezoneOffset();
	var ISTOffset = 330; // IST offset UTC +5:30
	var ISTTime = new Date(currentTime.getTime() + (ISTOffset * 2 + currentOffset - 5) * 60000);
	console.log(ISTTime);
	ReportsRefresher(date, ISTTime);
});

cron.schedule('00 04 * * *', function() {
	var d = new Date();
	d.setDate(d.getDate());
	if (d.getDate() < 10) {
		if (d.getMonth() + 1 > 10) {
			var date = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + '0' + d.getDate();
		} else {
			var date = d.getFullYear() + '-' + '0' + (d.getMonth() + 1) + '-' + '0' + d.getDate();
		}
	} else {
		if (d.getMonth() + 1 > 10) {
			var date = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
		} else {
			var date = d.getFullYear() + '-' + '0' + (d.getMonth() + 1) + '-' + d.getDate();
		}
	}
	var currentTime = new Date();
	var currentOffset = currentTime.getTimezoneOffset();
	var ISTOffset = 330; // IST offset UTC +5:30
	var ISTTime = new Date(currentTime.getTime() + (ISTOffset * 2 + currentOffset - 5) * 60000);
	console.log(ISTTime);
	ReportsRefresher(date, ISTTime);
});

cron.schedule('00 06 * * *', function() {
	var d = new Date();
	d.setDate(d.getDate());
	if (d.getDate() < 10) {
		if (d.getMonth() + 1 > 10) {
			var date = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + '0' + d.getDate();
		} else {
			var date = d.getFullYear() + '-' + '0' + (d.getMonth() + 1) + '-' + '0' + d.getDate();
		}
	} else {
		if (d.getMonth() + 1 > 10) {
			var date = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
		} else {
			var date = d.getFullYear() + '-' + '0' + (d.getMonth() + 1) + '-' + d.getDate();
		}
	}
	var currentTime = new Date();
	var currentOffset = currentTime.getTimezoneOffset();
	var ISTOffset = 330; // IST offset UTC +5:30
	var ISTTime = new Date(currentTime.getTime() + (ISTOffset * 2 + currentOffset - 5) * 60000);
	console.log(ISTTime);
	ReportsRefresher(date, ISTTime);
});

cron.schedule('00 08 * * *', function() {
	var d = new Date();
	d.setDate(d.getDate());
	if (d.getDate() < 10) {
		if (d.getMonth() + 1 > 10) {
			var date = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + '0' + d.getDate();
		} else {
			var date = d.getFullYear() + '-' + '0' + (d.getMonth() + 1) + '-' + '0' + d.getDate();
		}
	} else {
		if (d.getMonth() + 1 > 10) {
			var date = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
		} else {
			var date = d.getFullYear() + '-' + '0' + (d.getMonth() + 1) + '-' + d.getDate();
		}
	}
	var currentTime = new Date();
	var currentOffset = currentTime.getTimezoneOffset();
	var ISTOffset = 330; // IST offset UTC +5:30
	var ISTTime = new Date(currentTime.getTime() + (ISTOffset * 2 + currentOffset - 5) * 60000);
	console.log(ISTTime);
	ReportsRefresher(date, ISTTime);
});

cron.schedule('00 10 * * *', function() {
	var d = new Date();
	d.setDate(d.getDate());
	if (d.getDate() < 10) {
		if (d.getMonth() + 1 > 10) {
			var date = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + '0' + d.getDate();
		} else {
			var date = d.getFullYear() + '-' + '0' + (d.getMonth() + 1) + '-' + '0' + d.getDate();
		}
	} else {
		if (d.getMonth() + 1 > 10) {
			var date = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
		} else {
			var date = d.getFullYear() + '-' + '0' + (d.getMonth() + 1) + '-' + d.getDate();
		}
	}
	var currentTime = new Date();
	var currentOffset = currentTime.getTimezoneOffset();
	var ISTOffset = 330; // IST offset UTC +5:30
	var ISTTime = new Date(currentTime.getTime() + (ISTOffset * 2 + currentOffset - 5) * 60000);
	console.log(ISTTime);
	ReportsRefresher(date, ISTTime);
});

cron.schedule('00 12 * * *', function() {
	var d = new Date();
	d.setDate(d.getDate());
	if (d.getDate() < 10) {
		if (d.getMonth() + 1 > 10) {
			var date = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + '0' + d.getDate();
		} else {
			var date = d.getFullYear() + '-' + '0' + (d.getMonth() + 1) + '-' + '0' + d.getDate();
		}
	} else {
		if (d.getMonth() + 1 > 10) {
			var date = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
		} else {
			var date = d.getFullYear() + '-' + '0' + (d.getMonth() + 1) + '-' + d.getDate();
		}
	}
	var currentTime = new Date();
	var currentOffset = currentTime.getTimezoneOffset();
	var ISTOffset = 330; // IST offset UTC +5:30
	var ISTTime = new Date(currentTime.getTime() + (ISTOffset * 2 + currentOffset - 5) * 60000);
	console.log(ISTTime, date);
	ReportsRefresher(date, ISTTime);
});

cron.schedule('00 14 * * *', function() {
	var d = new Date();
	d.setDate(d.getDate());
	if (d.getDate() < 10) {
		if (d.getMonth() + 1 > 10) {
			var date = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + '0' + d.getDate();
		} else {
			var date = d.getFullYear() + '-' + '0' + (d.getMonth() + 1) + '-' + '0' + d.getDate();
		}
	} else {
		if (d.getMonth() + 1 > 10) {
			var date = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
		} else {
			var date = d.getFullYear() + '-' + '0' + (d.getMonth() + 1) + '-' + d.getDate();
		}
	}
	var currentTime = new Date();
	var currentOffset = currentTime.getTimezoneOffset();
	var ISTOffset = 330; // IST offset UTC +5:30
	var ISTTime = new Date(currentTime.getTime() + (ISTOffset * 2 + currentOffset - 5) * 60000);
	console.log(ISTTime);
	ReportsRefresher(date, ISTTime);
});

cron.schedule('00 16 * * *', function() {
	var d = new Date();
	d.setDate(d.getDate());
	if (d.getDate() < 10) {
		if (d.getMonth() + 1 > 10) {
			var date = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + '0' + d.getDate();
		} else {
			var date = d.getFullYear() + '-' + '0' + (d.getMonth() + 1) + '-' + '0' + d.getDate();
		}
	} else {
		if (d.getMonth() + 1 > 10) {
			var date = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
		} else {
			var date = d.getFullYear() + '-' + '0' + (d.getMonth() + 1) + '-' + d.getDate();
		}
	}
	var currentTime = new Date();
	var currentOffset = currentTime.getTimezoneOffset();
	var ISTOffset = 330; // IST offset UTC +5:30
	var ISTTime = new Date(currentTime.getTime() + (ISTOffset * 2 + currentOffset - 5) * 60000);
	console.log(ISTTime);
	ReportsRefresher(date, ISTTime);
});

cron.schedule('00 18 * * *', function() {
	var d = new Date();
	d.setDate(d.getDate());
	if (d.getDate() < 10) {
		if (d.getMonth() + 1 > 10) {
			var date = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + '0' + d.getDate();
		} else {
			var date = d.getFullYear() + '-' + '0' + (d.getMonth() + 1) + '-' + '0' + d.getDate();
		}
	} else {
		if (d.getMonth() + 1 > 10) {
			var date = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
		} else {
			var date = d.getFullYear() + '-' + '0' + (d.getMonth() + 1) + '-' + d.getDate();
		}
	}
	var currentTime = new Date();
	var currentOffset = currentTime.getTimezoneOffset();
	var ISTOffset = 330; // IST offset UTC +5:30
	var ISTTime = new Date(currentTime.getTime() + (ISTOffset * 2 + currentOffset - 5) * 60000);
	console.log(ISTTime);
	ReportsRefresher(date, ISTTime);
});

cron.schedule('00 20 * * *', function() {
	var d = new Date();
	d.setDate(d.getDate());
	if (d.getDate() < 10) {
		if (d.getMonth() + 1 > 10) {
			var date = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + '0' + d.getDate();
		} else {
			var date = d.getFullYear() + '-' + '0' + (d.getMonth() + 1) + '-' + '0' + d.getDate();
		}
	} else {
		if (d.getMonth() + 1 > 10) {
			var date = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
		} else {
			var date = d.getFullYear() + '-' + '0' + (d.getMonth() + 1) + '-' + d.getDate();
		}
	}
	var currentTime = new Date();
	var currentOffset = currentTime.getTimezoneOffset();
	var ISTOffset = 330; // IST offset UTC +5:30
	var ISTTime = new Date(currentTime.getTime() + (ISTOffset * 2 + currentOffset - 5) * 60000);
	console.log(ISTTime);
	ReportsRefresher(date, ISTTime);
});

cron.schedule('00 22 * * *', function() {
	var d = new Date();
	d.setDate(d.getDate());
	if (d.getDate() < 10) {
		if (d.getMonth() + 1 > 10) {
			var date = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + '0' + d.getDate();
		} else {
			var date = d.getFullYear() + '-' + '0' + (d.getMonth() + 1) + '-' + '0' + d.getDate();
		}
	} else {
		if (d.getMonth() + 1 > 10) {
			var date = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
		} else {
			var date = d.getFullYear() + '-' + '0' + (d.getMonth() + 1) + '-' + d.getDate();
		}
	}
	var currentTime = new Date();
	var currentOffset = currentTime.getTimezoneOffset();
	var ISTOffset = 330; // IST offset UTC +5:30
	var ISTTime = new Date(currentTime.getTime() + (ISTOffset * 2 + currentOffset - 5) * 60000);
	console.log(ISTTime);
	ReportsRefresher(date, ISTTime);
});

cron.schedule('10 00 * * *', function() {
	var d = new Date();
	d.setDate(d.getDate() - 1);
	if (d.getDate() < 10) {
		var date = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + '0' + d.getDate();
	} else {
		var date = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
	}
	var currentTime = new Date();
	var currentOffset = currentTime.getTimezoneOffset();
	var ISTOffset = 330; // IST offset UTC +5:30
	var ISTTime = new Date(currentTime.getTime() + (ISTOffset * 2 + currentOffset) * 60000);
	console.log(ISTTime);
	ReportsRefresher(date, ISTTime);
	uniqueMaker(date);
});

//Pincode

// cron.schedule('00 00 * * *', function () {
// 	TempJob();
// });

// async function TempJob() {
// 	const Zipreports2 = require('./models/zipdata2reports');
// 	const PhoneModelReports=require('./models/phonemodelreports')
// 	const ZipModelReports = require('./models/zipreports');
// 	let phones = await PhoneModelReports.aggregate([
// 		{
// 			$project: {
// 				test: { $dateToString: { format: '%Y-%m-%d', date: '$createdOn' } },
// 				phoneModel: { $toUpper: "$phoneModel" }
// 			}
// 		},
// 		{ $match: { test: "2021-08-30" } },
// 		{ $group: { _id: "$phoneModel" } }
// 	])

// 	phones.forEach(async (phn) => {
// 		let val = await phonemodel2reports.findOne({ make_model: phn._id, rtbType: { $exists: false } })
// 		let updates = {
// 			cost: val ? val.cost : '',
// 			cumulative: val ? val.cumulative : '',
// 			release: val ? val.release : '',
// 			company: val ? val.company : '',
// 			type: val ? val.type : '',
// 			total_percent: val ? val.total_percent : '',
// 			model: val ? val.model : '',
// 			combined_make_model: val ? val.combined_make_model : '',
// 		}
// 		await phonemodel2reports.updateMany({ make_model: phn._id, rtbType: { $exists: true } }, { $set: updates })
// 	})

// 	let pincodes = await ZipModelReports.aggregate([
// 		{
// 			$project: {
// 				test: { $dateToString: { format: '%Y-%m-%d', date: '$createdOn' } },
// 				zip: "$zip"
// 			}
// 		},
// 		{ $match: { test: "2021-08-30" } },
// 		{ $group: { _id: "$zip" } }
// 	])

// 	pincodes.forEach(async (pincode) => {
// 		let val = await Zipreports2.findOne({ pincode: pincode._id, rtbType: { $exists: false } })
// 		let updates = {
// 			area: val ? val.area : '',
// 			lowersubcity: val ? val.lowersubcity : '',
// 			subcity: val ? val.subcity : '',
// 			city: val ? val.city : '',
// 			grandcity: val ? val.grandcity : '',
// 			district: val ? val.district : '',
// 			comparison: val ? val.comparison : '',
// 			state: val ? val.state : '',
// 			grandstate: val ? val.grandstate : '',
// 			latitude: val ? val.latitude : '',
// 			longitude: val ? val.longitude : '',
// 		}
// 		await Zipreports2.updateMany({ pincode: pincode._id, rtbType: { $exists: true } }, { $set: updates })
// 	})

// }

cron.schedule('00 1 * * *', function() {
	PincodeRefresher();
});

async function PincodeRefresher() {
	let date = new Date(new Date());
	date.setDate(date.getDate() - 1);
	date = new Date(date);
	const year = date.getFullYear();
	let month;
	if (date.getMonth() + 1 >= 10) {
		month = `${date.getMonth() + 1}`;
	} else {
		month = `0${date.getMonth() + 1}`;
	}

	let date1 = date.getDate();
	if (date1 < 10) {
		date1 = `0${date1}`;
	}
	let yesterday = `${year}-${month}-${date1}`;
	console.log('yesterday', yesterday);

	const setdate = '2021-07-01';

	const ZipModelReports = require('./models/zipreports');
	const Zipreports2 = require('./models/zipdata2reports');
	const pincodes = await ZipModelReports.aggregate([
		{
			$project: {
				test: { $dateToString: { format: '%Y-%m-%d', date: '$createdOn' } },
				zip: '$zip',
				impression: '$impression',
				CompanionClickTracking: 1,
				rtbType: 1,
				SovClickTracking: 1
			}
		},
		{ $match: { test: yesterday, zip: { $gt: 99999, $lt: 1000000 } } },
		{
			$group: {
				_id: { zip: '$zip', rtbType: '$rtbType' },
				CompanionClickTracking: { $sum: '$CompanionClickTracking' },
				SovClickTracking: { $sum: '$SovClickTracking' },
				impressions: { $sum: '$impression' }
			}
		}
	]);

	console.log(pincodes);
	pincodes.forEach(async (pincode) => {
		const match = await Zipreports2.findOne({ pincode: pincode._id.zip, rtbType: pincode._id.rtbType });
		if (!match) {
			let val = await Zipreports2.findOne({ pincode: parseInt(pincode._id.zip), rtbType: { $exists: false } });
			const newzip = new Zipreports2({
				area: val ? val.area : '',
				pincode: parseInt(pincode._id.zip),
				rtbType: pincode._id.rtbType,
				lowersubcity: val ? val.lowersubcity : '',
				subcity: val ? val.subcity : '',
				city: val ? val.city : '',
				grandcity: val ? val.grandcity : '',
				district: val ? val.district : '',
				comparison: val ? val.comparison : '',
				state: val ? val.state : '',
				grandstate: val ? val.grandstate : '',
				latitude: val ? val.latitude : '',
				longitude: val ? val.longitude : '',
				impression: 0,
				click: 0,
				requests: 0
			});
			await newzip.save();
		} else {
			const updateddoc = await Zipreports2.findOneAndUpdate(
				{ pincode: pincode._id.zip, rtbType: pincode._id.rtbType },
				{
					$inc: {
						impression: pincode.impressions,
						click: pincode.CompanionClickTracking + pincode.SovClickTracking
					}
				},
				{ new: true }
			);
			console.log('updated', updateddoc);
		}
	});
}

cron.schedule('30 1 * * *', function() {
	PincodeRequestsRefresher();
});

async function PincodeRequestsRefresher() {
	let date = new Date(new Date());
	date.setDate(date.getDate() - 1);
	date = new Date(date);
	const year = date.getFullYear();
	let month;
	if (date.getMonth() + 1 >= 10) {
		month = `${date.getMonth() + 1}`;
	} else {
		month = `0${date.getMonth() + 1}`;
	}
	let date1 = date.getDate();
	if (date1 < 10) {
		date1 = `0${date1}`;
	}
	let yesterday = `${year}-${month}-${date1}`;
	console.log('yesterday', yesterday);

	const setdate = '2021-07-01';

	const ZipModelReports = require('./models/zipreports');
	const Zipreports2 = require('./models/zipdata2reports');
	const ZipReqReports = require('./models/zipreqreports');
	const pincodes = await ZipReqReports.aggregate([
		{ $match: { pincode: { $exists: true } } },
		{
			$project: {
				test: '$date',
				zip: '$pincode',
				rtbType: '$rtbType',
				ads: '$ads'
			}
		},
		{ $match: { test: yesterday } },
		{
			$group: {
				_id: { zip: '$zip', rtbType: '$rtbType' },
				ads: { $sum: '$ads' }
			}
		}
	]);

	console.log(pincodes);
	pincodes.forEach(async (pincode) => {
		const match = await Zipreports2.findOne({ pincode: parseInt(pincode._id.zip), rtbType: pincode._id.rtbType });
		if (!match) {
			let val = await Zipreports2.findOne({ pincode: parseInt(pincode._id.zip), rtbType: { $exists: false } });
			const newzip = new Zipreports2({
				area: val ? val.area : '',
				pincode: pincode._id.zip ? parseInt(pincode._id.zip) : null,
				rtbType: pincode._id.rtbType,
				lowersubcity: val ? val.lowersubcity : '',
				subcity: val ? val.subcity : '',
				city: val ? val.city : '',
				grandcity: val ? val.grandcity : '',
				district: val ? val.district : '',
				comparison: val ? val.comparison : '',
				state: val ? val.state : '',
				grandstate: val ? val.grandstate : '',
				latitude: val ? val.latitude : '',
				longitude: val ? val.longitude : '',
				impression: 0,
				click: 0,
				requests: pincode.ads
			});
			await newzip.save();
		} else {
			const updateddoc = await Zipreports2.findOneAndUpdate(
				{ pincode: parseInt(pincode._id.zip), rtbType: pincode._id.rtbType },
				{
					$inc: {
						requests: pincode.ads
					}
				},
				{ new: true }
			);
			console.log('updated', updateddoc);
		}
	});
}

cron.schedule('00 2 * * *', function() {
	PhoneRefresher();
});

async function PhoneRefresher() {
	let date = new Date(new Date());
	date.setDate(date.getDate() - 1);
	date = new Date(date);
	const year = date.getFullYear();
	let month;
	if (date.getMonth() + 1 >= 10) {
		month = `${date.getMonth() + 1}`;
	} else {
		month = `0${date.getMonth() + 1}`;
	}
	let date1 = date.getDate();
	if (date1 < 10) {
		date1 = `0${date1}`;
	}
	let yesterday = `${year}-${month}-${date1}`;
	console.log('yesterday', yesterday);
	const PhoneModelReports = require('./models/phonemodelreports');
	const Phonereports2 = require('./models/phonemodel2reports');
	const setdate = '2021-07-01';
	const phones = await PhoneModelReports.aggregate([
		{
			$project: {
				test: { $dateToString: { format: '%Y-%m-%d', date: '$createdOn' } },
				phoneModel: { $toUpper: '$phoneModel' },
				rtbType: '$rtbType',
				impression: '$impression',
				CompanionClickTracking: 1,
				SovClickTracking: 1
			}
		},
		{ $match: { test: yesterday } },
		{
			$group: {
				_id: { phone: '$phoneModel', rtbType: '$rtbType' },
				CompanionClickTracking: { $sum: '$CompanionClickTracking' },
				SovClickTracking: { $sum: '$SovClickTracking' },
				impressions: { $sum: '$impression' }
			}
		}
	]);
	console.log(phones);
	phones.forEach(async (phone) => {
		const match = await Phonereports2.findOne({ make_model: phone._id.phone, rtbType: phone._id.rtbType });
		if (!match) {
			let val = await Phonereports2.findOne({ make_model: phone._id.phone, rtbType: { $exists: false } });
			const newzip = new Phonereports2({
				cost: val ? val.cost : '',
				make_model: phone._id.phone,
				cumulative: val ? val.cumulative : '',
				release: val ? val.release : '',
				company: val ? val.company : '',
				type: val ? val.type : '',
				rtbType: phone._id.rtbType,
				total_percent: val ? val.total_percent : '',
				model: val ? val.model : '',
				combined_make_model: val ? val.combined_make_model : '',
				impression: phone.impressions,
				click: phone.CompanionClickTracking + phone.SovClickTracking
			});
			await newzip.save();
		} else {
			const updateddoc = await Phonereports2.findOneAndUpdate(
				{ make_model: phone._id.phone, rtbType: phone._id.rtbType },
				{
					$inc: {
						impression: phone.impressions,
						click: phone.CompanionClickTracking + phone.SovClickTracking
					}
				},
				{ new: true }
			);
			console.log('updated', updateddoc);
		}
	});
}

cron.schedule('00 3 * * *', function() {
	CategoryRefresher();
});

async function CategoryRefresher() {
	let date = new Date(new Date());
	date.setDate(date.getDate() - 1);
	date = new Date(date);
	const year = date.getFullYear();
	let month;
	if (date.getMonth() + 1 >= 10) {
		month = `${date.getMonth() + 1}`;
	} else {
		month = `0${date.getMonth() + 1}`;
	}
	let date1 = date.getDate();
	if (date1 < 10) {
		date1 = `0${date1}`;
	}
	let yesterday = `${year}-${month}-${date1}`;
	console.log('yesterday', yesterday);
	const CategoryReports = require('./models/categoryreports');
	const Categoryreports2 = require('./models/categoryreports2');
	const setdate = '2021-07-01';

	const phones = await CategoryReports.aggregate([
		{
			$project: {
				test: { $dateToString: { format: '%Y-%m-%d', date: '$createdOn' } },
				category: '$category',
				impression: '$impression',
				CompanionClickTracking: 1,
				SovClickTracking: 1,
				feed: 1
			}
		},
		{ $match: { test: yesterday } },
		{
			$group: {
				_id: { category: '$category', feed: '$feed' },
				CompanionClickTracking: { $sum: '$CompanionClickTracking' },
				SovClickTracking: { $sum: '$SovClickTracking' },
				impressions: { $sum: '$impression' }
			}
		}
	]);
	console.log(phones);
	phones.forEach(async (cat) => {
		const match = await Categoryreports2.findOne({
			$or: [ { category: cat._id.category }, { new_taxonamy: cat._id.category } ],
			feed: cat._id.feed
		});

		if (!match) {
			const val = await Categoryreports2.findOne({
				$or: [ { category: cat._id.category }, { new_taxonamy: cat._id.category } ]
			});
			const newzip = new Categoryreports2({
				parent: val ? val.parent : '',
				category: cat._id.category,
				Name: val ? val.Name : '',
				tier1: val ? val.tier1 : '',
				tier2: val ? val.tier2 : '',
				tier3: val ? val.tier3 : '',
				tier4: val ? val.tier4 : '',
				genderCategory: val ? val.genderCategory : '',
				AgeCategory: val ? val.AgeCategory : '',
				new_taxonamy: val ? val.new_taxonamy : '',
				impression: cat.impressions,
				click: cat.CompanionClickTracking + cat.SovClickTracking,
				feed: cat._id.feed
			});
			await newzip.save();
		} else {
			await Categoryreports2.findOneAndUpdate(
				{ $or: [ { category: cat._id.category }, { new_taxonamy: cat._id.category } ], feed: cat._id.feed },
				{
					$inc: {
						impression: cat.impressions,
						click: cat.CompanionClickTracking + cat.SovClickTracking
					}
				}
			);
		}
	});

	// console.log('updated', updateddoc);
}

let tempfunc = async () => {
	const EpisodeModel2 = require('./models/episodemodel2');
	const EpisodeModel2Copy = require('./models/episodemodel2copy');
	let data = await EpisodeModel2.find({ createdOn: { $gt: new Date(`2021-10-26T00:00:00.000Z`) } });
	console.log(data.length);
	data.map(async (dat) => {
		let res = await EpisodeModel2Copy.findOne({ episodename: dat.episodename, category: dat.category });
		// console.log(res)
		if (res) {
			console.log(3);
			let updates = {
				publishername: res.publishername ? res.publishername : '',
				displayname: res.displayname ? res.displayname : '',
				hostPossibility: res.hostPossibility ? res.hostPossibility : ''
			};
			console.log(2);
			await EpisodeModel2.findOneAndUpdate(
				{ episodename: dat.episodename, category: dat.category },
				{ $set: updates }
			);
			console.log(1);
		}
	});
};

// tempfunc();

cron.schedule('30 1 * * *', function() {
	PodcastEpisodeRefresher();
});
// PodcastEpisodeRefresher();
async function PodcastEpisodeRefresher() {
	let date = new Date(new Date());
	date.setDate(date.getDate() - 1);
	date = new Date(date);
	const year = date.getFullYear();
	let month;
	if (date.getMonth() + 1 >= 10) {
		month = `${date.getMonth() + 1}`;
	} else {
		month = `0${date.getMonth() + 1}`;
	}
	let date1 = date.getDate();
	if (date1 < 10) {
		date1 = `0${date1}`;
	}
	let yesterday = `${year}-${month}-${date1}`;
	console.log('yesterday', yesterday);
	const EpisodeModel = require('./models/episodemodel');
	const EpisodeModel2 = require('./models/episodemodel2');
	const setdate = '2021-07-01';

	const result = await EpisodeModel.aggregate([
		{
			$project: {
				test: { $dateToString: { format: '%Y-%m-%d', date: '$createdOn' } },
				episodename: 1,
				category: 1,
				publisherid: 1,
				requests: 1,
				language: 1,
				displayname: 1,
				hostPossibility: 1
			}
		},
		{ $match: { test: yesterday } },
		{
			$project: {
				episodename: 1,
				category: 1,
				publisherid: 1,
				requests: 1,
				displayname: 1,
				language: 1,
				hostPossibility: 1
			}
		},
		{
			$lookup: {
				from: 'categoryreports2',
				localField: 'category',
				foreignField: 'category',
				as: 'extra_details'
			}
		},
		// { $unwind: { path: '$extra_details', preserveNullAndEmptyArrays: true } },
		{
			$lookup: {
				from: 'categoryreports2',
				localField: 'category',
				foreignField: 'new_taxonamy',
				as: 'extra_details1'
			}
		},
		// { $unwind: { path: '$extra_details1', preserveNullAndEmptyArrays: true } },
		{
			$project: {
				episodename: 1,
				category: 1,
				publisherid: 1,
				language: 1,
				requests: 1,
				displayname: 1,
				hostPossibility: 1,
				// extra_details: { $ifNull: ['$extra_details', '$extra_details1'] },
				extra_details: {
					$cond: [
						{ $eq: [ { $size: '$extra_details' }, 0 ] },
						{ $first: '$extra_details1' },
						{ $first: '$extra_details' }
					]
				}
			}
		},
		{
			$lookup: {
				from: 'apppublishers',
				localField: 'publisherid',
				foreignField: 'publisherid',
				as: 'publisher_details'
			}
		},
		{
			$project: {
				episodename: 1,
				category: '$extra_details',
				publisher: { $setUnion: [ '$publisher_details.publishername', [] ] },
				language: 1,
				request: '$requests',
				displayname: 1,
				hostPossibility: 1
			}
		},
		{
			$project: {
				episodename: 1,
				category: 1,
				publisher: {
					$filter: {
						input: '$publisher',
						as: 'pub',
						cond: { $ne: [ '$$pub', '' ] }
					}
				},
				language: 1,
				request: 1,
				displayname: 1,
				hostPossibility: 1
			}
		},
		{
			$project: {
				episodename: 1,
				category: '$category.category',
				publisher: { $first: '$publisher' },
				language: 1,
				request: 1,
				displayname: 1,
				hostPossibility: 1,
				tier1: '$category.tier1',
				tier2: '$category.tier2',
				tier3: '$category.tier3',
				new_taxonamy: '$category.new_taxonamy'
			}
		},
		{
			$group: {
				_id: {
					episodename: '$episodename',
					category: '$category',
					publisher: '$publisher',
					language: '$language'
				},
				request: { $sum: '$request' },
				displayname: { $first: '$displayname' },
				hostPossibility: { $first: '$hostPossibility' },
				tier1: { $first: '$tier1' },
				tier2: { $first: '$tier2' },
				tier3: { $first: '$tier3' },
				new_taxonamy: { $first: '$new_taxonamy' }
			}
		}
	]);

	// console.log(result);
	console.log(result.length);

	result.forEach(async (podcast) => {
		const ismatch = await EpisodeModel2.findOne({
			$and: [
				{ episodename: podcast._id.episodename },
				{ category: podcast._id.category },
				{ publisher: podcast._id.publisher },
				{ language: podcast._id.language }
			]
		});
		if (!ismatch) {
			const episode = new EpisodeModel2({
				publisher: podcast._id.publisher,
				episodename: podcast._id.episodename,
				category: podcast._id.category,
				requests: podcast.request,
				language: podcast._id.language,
				displayname: podcast.displayname,
				hostPossibility: podcast.hostPossibility,
				publishername: '',
				tier1: podcast.tier1,
				tier2: podcast.tier2,
				tier3: podcast.tier3,
				new_taxonamy: podcast.new_taxonamy,
				createdOn: Date.now()
			});
			await episode.save();
		} else {
			await EpisodeModel2.findOneAndUpdate(
				{
					$and: [
						{ episodename: podcast._id.episodename },
						{ publisher: podcast._id.publisher },
						{ category: podcast._id.category },
						{ language: podcast._id.language }
					]
				},
				{
					$inc: {
						requests: podcast.request
					}
				}
			);
		}
	});
}

async function uniqueMaker({ date }) {
	let uniqueids = await trackinglogs
		.distinct('campaignId', { date: date, type: 'impression' })
		.catch((err) => console.log(err));
	uniqueids = uniqueids.map((id) => mongoose.Types.ObjectId(id));
	let response = await StreamingAds.aggregate([
		{ $match: { _id: { $in: uniqueids } } },
		{ $project: { AdTitle: { $toLower: '$AdTitle' } } },
		{ $project: { AdTitle: { $split: [ '$AdTitle', '_' ] } } },
		{ $project: { AdTitle: { $slice: [ '$AdTitle', 2 ] } } },
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
				_id: 0
			}
		},
		{ $group: { _id: '$AdTitle' } }
	]).catch((err) => console.log(err));
	var ree = [];
	response = await response.map(async (da) => {
		let doudt = await StreamingAds.aggregate([
			{ $project: { _id: '$_id', AdTitle: { $toLower: '$AdTitle' } } },
			{ $match: { AdTitle: { $regex: da._id } } },
			{ $group: { _id: null, ids: { $push: '$_id' } } }
		]).catch((err) => console.log(err));
		var title = da._id;
		doudt = doudt[0].ids;
		doudt = doudt.map((id) => mongoose.Types.ObjectId(id));
		let splited = await adsetting.find({ campaignId: { $in: doudt } }).catch((err) => console.log(err));
		var audio = [];
		var display = [];
		splited = await splited.map((ids) => {
			if (ids.type === 'display') display.push(ids.campaignId);
			else {
				audio.push(ids.campaignId);
			}
		});
		// console.log(audio)
		audio = audio && audio.map((id) => id.toString());
		let audioUnique = await trackinglogs.db.db
			.command({
				aggregate: 'trackinglogs',
				pipeline: [
					{ $match: { type: 'impression', campaignId: { $in: audio } } },
					{ $group: { _id: '$ifa', total: { $sum: 1 } } },
					{ $count: 'count' }
				],
				allowDiskUse: true,
				cursor: {}
			})
			.catch((err) => console.log(err));
		audioUnique = audioUnique.cursor.firstBatch && audioUnique.cursor.firstBatch[0];
		console.log(audioUnique);
		display = display && display.map((id) => id.toString());
		let displayUnique = await trackinglogs.db.db
			.command({
				aggregate: 'trackinglogs',
				pipeline: [
					{ $match: { type: 'impression', campaignId: { $in: display } } },
					{ $group: { _id: '$ifa', total: { $sum: 1 } } },
					{ $count: 'count' }
				],
				allowDiskUse: true,
				cursor: {}
			})
			.catch((err) => console.log(err));
		displayUnique = displayUnique.cursor.firstBatch && displayUnique.cursor.firstBatch[0];
		audioCount = audioUnique && audioUnique.count;
		displayCount = displayUnique && displayUnique.count;
		console.log(displayUnique);
		const uniquedata = new Unique({
			audiouser: audioCount ? audioCount : 0,
			displayuser: displayCount ? displayCount : 0,
			AdTitle: title
		});
		let dala = await Unique.deleteMany({ AdTitle: title }).catch((err) => console.log(err));
		console.log(dala);
		uniquedata
			.save()
			.then((resu) => {
				return console.log('completeunique', dala);
			})
			.catch((err) => {
				console.log(audioCount, displayCount, title, uniquedata);
				return console.log(err, dala);
			});
	});
}

async function ReportsRefresher(date, credate) {
	// var d = new Date()
	// d.setDate(d.getDate());
	// if(d.getDate() < 10){
	//     var date = d.getFullYear() + '-' + (d.getMonth()+1) + '-' + '0' + d.getDate()
	// }else{
	//     var date = d.getFullYear() + '-' + (d.getMonth()+1) + '-' + d.getDate()
	// }
	const Report = mongoose.model('Report');
	Report.deleteMany({ date: date }).then((repon) => {
		console.log({ relt: repon, mess: 'deleted' });
	});
	console.log(date, credate);
	const trackinglogs = mongoose.model('trackinglogs');
	try {
		let logids = await trackinglogs
			.aggregate([
				{ $match: { date: date } },
				{ $group: { _id: null, ids: { $addToSet: '$campaignId' } } },
				{ $project: { _id: 0, ids: 1 } }
			])
			.catch((err) => console.log(err));
		logids = logids[0].ids;
		let uniqueuserslist = await trackinglogs.db.db.command({
			aggregate: 'trackinglogs',
			pipeline: [
				{
					$facet: {
						uniquesumdatawise: [
							{ $match: { campaignId: { $in: logids }, type: { $in: [ 'impression' ] } } },
							{
								$group: {
									_id: { campaignId: '$campaignId', appId: '$appId' },
									ifa: { $addToSet: '$ifa' }
								}
							},
							{
								$group: {
									_id: '$_id.campaignId',
									unique: { $addToSet: '$ifa' },
									publishdata: { $push: { appId: '$_id.appId', uniqueuser: { $size: '$ifa' } } }
								}
							},
							{
								$addFields: {
									unique: {
										$reduce: {
											input: '$unique',
											initialValue: [],
											in: { $concatArrays: [ '$$value', '$$this' ] }
										}
									}
								}
							},
							{ $project: { _id: 0, campaignId: '$_id', unique: { $size: '$unique' }, publishdata: 1 } }
						],
						regionwiseunique: [
							{ $match: { campaignId: { $in: logids }, type: { $in: [ 'impression' ] } } },
							{
								$group: {
									_id: { campaignId: '$campaignId', appId: '$appId', region: '$region' },
									ifa: { $addToSet: '$ifa' }
								}
							},
							{
								$group: {
									_id: { campaignId: '$_id.campaignId', appId: '$_id.appId' },
									uniquerepo: { $push: { region: '$_id.region', unique: { $size: '$ifa' } } }
								}
							},
							{
								$group: {
									_id: '$_id.campaignId',
									results: { $push: { appId: '$_id.appId', result: '$uniquerepo' } }
								}
							},
							{ $project: { _id: 0, campaignId: '$_id', results: 1 } }
						],
						pinwiseunique: [
							{ $match: { campaignId: { $in: logids }, type: { $in: [ 'impression' ] } } },
							{
								$group: {
									_id: { campaignId: '$campaignId', appId: '$appId', zip: '$zip' },
									ifa: { $addToSet: '$ifa' }
								}
							},
							{
								$group: {
									_id: { campaignId: '$_id.campaignId', appId: '$_id.appId' },
									uniquerepo: { $push: { zip: '$_id.zip', unique: { $size: '$ifa' } } }
								}
							},
							{
								$group: {
									_id: '$_id.campaignId',
									results: { $push: { appId: '$_id.appId', result: '$uniquerepo' } }
								}
							},
							{ $project: { _id: 0, campaignId: '$_id', results: 1 } }
						],
						lanwiseunique: [
							{ $match: { campaignId: { $in: logids }, type: { $in: [ 'impression' ] } } },
							{
								$group: {
									_id: { campaignId: '$campaignId', appId: '$appId', language: '$language' },
									ifa: { $addToSet: '$ifa' }
								}
							},
							{
								$group: {
									_id: { campaignId: '$_id.campaignId', appId: '$_id.appId' },
									uniquerepo: { $push: { language: '$_id.language', unique: { $size: '$ifa' } } }
								}
							},
							{
								$group: {
									_id: '$_id.campaignId',
									results: { $push: { appId: '$_id.appId', result: '$uniquerepo' } }
								}
							},
							{ $project: { _id: 0, campaignId: '$_id', results: 1 } }
						]
					}
				}
			],
			allowDiskUse: true,
			cursor: {}
		});
		uniqueuserslist = uniqueuserslist.cursor.firstBatch;
		let wholetypelist = await trackinglogs.db.db
			.command({
				aggregate: 'trackinglogs',
				pipeline: [
					{
						$facet: {
							appIds: [
								{ $match: { date: date } },
								{ $group: { _id: { campaignId: '$campaignId', date: '$date', appId: '$appId' } } },
								{
									$group: {
										_id: { campaignId: '$_id.campaignId', date: '$_id.date' },
										ids: { $push: '$_id.appId' }
									}
								},
								{ $project: { _id: 0, campaignId: '$_id.campaignId', date: '$_id.date', ids: '$ids' } }
							],
							typeValues: [
								{ $match: { date: date } },
								{
									$group: {
										_id: { campaignId: '$campaignId', type: '$type', appId: '$appId' },
										count: { $sum: 1 }
									}
								},
								{
									$group: {
										_id: { appId: '$_id.appId', campaignId: '$_id.campaignId' },
										result: { $push: { k: '$_id.type', v: '$count' } }
									}
								},
								{
									$group: {
										_id: '$_id.campaignId',
										report: {
											$push: { appId: '$_id.appId', result: { $arrayToObject: '$result' } }
										}
									}
								},
								{ $project: { campaignId: '$_id', report: '$report', _id: 0 } }
							],
							typebyRegion: [
								{ $match: { date: date } },
								{
									$group: {
										_id: {
											campaignId: '$campaignId',
											type: '$type',
											appId: '$appId',
											region: '$region'
										},
										count: { $sum: 1 }
									}
								},
								{
									$group: {
										_id: {
											appId: '$_id.appId',
											campaignId: '$_id.campaignId',
											region: '$_id.region'
										},
										result: { $push: { k: '$_id.type', v: '$count' } }
									}
								},
								{
									$group: {
										_id: { appId: '$_id.appId', campaignId: '$_id.campaignId' },
										result: {
											$push: { region: '$_id.region', result: { $arrayToObject: '$result' } }
										}
									}
								},
								{
									$group: {
										_id: '$_id.campaignId',
										report: { $push: { appId: '$_id.appId', result: '$result' } }
									}
								},
								{ $project: { _id: 0, campaignId: '$_id', report: '$report' } }
							],
							typeByLan: [
								{ $match: { date: date } },
								{
									$group: {
										_id: {
											campaignId: '$campaignId',
											type: '$type',
											appId: '$appId',
											language: '$language'
										},
										count: { $sum: 1 }
									}
								},
								{
									$group: {
										_id: {
											campaignId: '$_id.campaignId',
											appId: '$_id.appId',
											language: '$_id.language'
										},
										result: { $push: { k: '$_id.type', v: '$count' } }
									}
								},
								{
									$group: {
										_id: { appId: '$_id.appId', campaignId: '$_id.campaignId' },
										result: {
											$push: { language: '$_id.language', result: { $arrayToObject: '$result' } }
										}
									}
								},
								{
									$group: {
										_id: '$_id.campaignId',
										report: { $push: { appId: '$_id.appId', result: '$result' } }
									}
								},
								{ $project: { _id: 0, campaignId: '$_id', report: '$report' } }
							],
							typeByPhModel: [
								{ $match: { date: date } },
								{
									$group: {
										_id: {
											campaignId: '$campaignId',
											type: '$type',
											appId: '$appId',
											phoneMake: '$phoneMake',
											phoneModel: '$phoneModel'
										},
										count: { $sum: 1 }
									}
								},
								{
									$group: {
										_id: {
											campaignId: '$_id.campaignId',
											appId: '$_id.appId',
											phoneMake: '$_id.phoneMake',
											phoneModel: '$_id.phoneModel'
										},
										result: { $push: { k: '$_id.type', v: '$count' } }
									}
								},
								{
									$group: {
										_id: { appId: '$_id.appId', campaignId: '$_id.campaignId' },
										result: {
											$push: {
												phoneModel: { $concat: [ '$_id.phoneMake', ' - ', '$_id.phoneModel' ] },
												result: { $arrayToObject: '$result' }
											}
										}
									}
								},
								{
									$group: {
										_id: '$_id.campaignId',
										report: { $push: { appId: '$_id.appId', result: '$result' } }
									}
								},
								{ $project: { _id: 0, campaignId: '$_id', report: '$report' } }
							],
							typeByPT: [
								{ $match: { date: date } },
								{
									$group: {
										_id: {
											campaignId: '$campaignId',
											type: '$type',
											appId: '$appId',
											platformType: '$platformType',
											osVersion: '$osVersion'
										},
										count: { $sum: 1 }
									}
								},
								{
									$group: {
										_id: {
											campaignId: '$_id.campaignId',
											appId: '$_id.appId',
											platformType: '$_id.platformType',
											osVersion: '$_id.osVersion'
										},
										result: { $push: { k: '$_id.type', v: '$count' } }
									}
								},
								{
									$group: {
										_id: { appId: '$_id.appId', campaignId: '$_id.campaignId' },
										result: {
											$push: {
												platformType: {
													$concat: [ '$_id.platformType', ' - ', '$_id.osVersion' ]
												},
												result: { $arrayToObject: '$result' }
											}
										}
									}
								},
								{
									$group: {
										_id: '$_id.campaignId',
										report: { $push: { appId: '$_id.appId', result: '$result' } }
									}
								},
								{ $project: { _id: 0, campaignId: '$_id', report: '$report' } }
							],
							typeByPlatform: [
								{ $match: { date: date } },
								{
									$group: {
										_id: {
											campaignId: '$campaignId',
											type: '$type',
											appId: '$appId',
											platformType: '$platformType'
										},
										count: { $sum: 1 }
									}
								},
								{
									$group: {
										_id: {
											campaignId: '$_id.campaignId',
											appId: '$_id.appId',
											platformType: '$_id.platformType'
										},
										result: { $push: { k: '$_id.type', v: '$count' } }
									}
								},
								{
									$group: {
										_id: { appId: '$_id.appId', campaignId: '$_id.campaignId' },
										result: {
											$push: {
												platformType: '$_id.platformType',
												result: { $arrayToObject: '$result' }
											}
										}
									}
								},
								{
									$group: {
										_id: '$_id.campaignId',
										report: { $push: { appId: '$_id.appId', result: '$result' } }
									}
								},
								{ $project: { _id: 0, campaignId: '$_id', report: '$report' } }
							],
							typeByPin: [
								{ $match: { date: date } },
								{
									$group: {
										_id: { campaignId: '$campaignId', type: '$type', appId: '$appId', zip: '$zip' },
										count: { $sum: 1 }
									}
								},
								{
									$group: {
										_id: { campaignId: '$_id.campaignId', appId: '$_id.appId', zip: '$_id.zip' },
										result: { $push: { k: '$_id.type', v: '$count' } }
									}
								},
								{
									$group: {
										_id: { appId: '$_id.appId', campaignId: '$_id.campaignId' },
										result: { $push: { zip: '$_id.zip', result: { $arrayToObject: '$result' } } }
									}
								},
								{
									$group: {
										_id: '$_id.campaignId',
										report: { $push: { appId: '$_id.appId', result: '$result' } }
									}
								},
								{ $project: { _id: 0, campaignId: '$_id', report: '$report' } }
							],
							typeByDev: [
								{ $match: { date: date } },
								{
									$group: {
										_id: {
											campaignId: '$campaignId',
											type: '$type',
											appId: '$appId',
											pptype: '$pptype'
										},
										count: { $sum: 1 }
									}
								},
								{
									$group: {
										_id: {
											campaignId: '$_id.campaignId',
											appId: '$_id.appId',
											pptype: '$_id.pptype'
										},
										result: { $push: { k: '$_id.type', v: '$count' } }
									}
								},
								{
									$group: {
										_id: { appId: '$_id.appId', campaignId: '$_id.campaignId' },
										result: {
											$push: { pptype: '$_id.pptype', result: { $arrayToObject: '$result' } }
										}
									}
								},
								{
									$group: {
										_id: '$_id.campaignId',
										report: { $push: { appId: '$_id.appId', result: '$result' } }
									}
								},
								{ $project: { _id: 0, campaignId: '$_id', report: '$report' } }
							]
						}
					}
				],
				allowDiskUse: true,
				cursor: {}
			})
			.catch((err) => console.log(err));
		wholetypelist = wholetypelist.cursor.firstBatch;
		wholetypelist[0].appIds.map((caompoids) => {
			var campId = caompoids.campaignId;
			var repodate = caompoids.date;
			var uniquedatareq = uniqueuserslist[0];
			var uniquedataofcamp = uniquedatareq.uniquesumdatawise.filter((x) => x.campaignId === campId);
			var uniquecountofcamp = 0;
			uniquedataofcamp.map((dd) => {
				uniquecountofcamp = dd.unique;
			});
			var uniqueregiondatacamp = uniquedatareq.regionwiseunique.filter((x) => x.campaignId === campId);
			var uniquepindatacamp = uniquedatareq.pinwiseunique.filter((x) => x.campaignId === campId);
			var uniquelangdatacamp = uniquedatareq.lanwiseunique.filter((x) => x.campaignId === campId);
			var resdatareq = wholetypelist[0];
			var impredatacamp = resdatareq.typeValues.filter((x) => x.campaignId === campId);
			var regiondatacamp = resdatareq.typebyRegion.filter((x) => x.campaignId === campId);
			var languagedatacamp = resdatareq.typeByLan.filter((x) => x.campaignId === campId);
			var pindatacamp = resdatareq.typeByPin.filter((x) => x.campaignId === campId);
			var devicedatacamp = resdatareq.typeByDev.filter((x) => x.campaignId === campId);
			var phmodatacamp = resdatareq.typeByPhModel.filter((x) => x.campaignId === campId);
			var plattypedatacamp = resdatareq.typeByPT.filter((x) => x.campaignId === campId);
			var platformdatacamp = resdatareq.typeByPlatform.filter((x) => x.campaignId === campId);
			// console.log(pindatacamp[0])
			caompoids.ids.map((app_id) => {
				var appIdreq = app_id;
				var appuniquedata = uniquedataofcamp[0];
				var appuniquecount = 0;
				uniquedataofcamp.map((dd) => {
					appuniquedata = dd.publishdata.filter((x) => x.appId === appIdreq);
					appuniquecount = appuniquedata[0].uniqueuser;
				});
				var uniqueregiondataapp = [];
				uniqueregiondatacamp.map((dd) => {
					uniqueregiondataapp = dd.results.filter((x) => x.appId === appIdreq);
					uniqueregiondataapp = uniqueregiondataapp[0].result;
				});
				var uniquepindataapp = [];
				uniquepindatacamp.map((dd) => {
					uniquepindataapp = dd.results.filter((x) => x.appId === appIdreq);
					uniquepindataapp = uniquepindataapp[0].result;
				});
				// console.log(typeof uniquepindataapp)
				var uniquelangdataapp = [];
				uniquelangdatacamp.map((dd) => {
					uniquelangdataapp = dd.results.filter((x) => x.appId === appIdreq);
					uniquelangdataapp = uniquelangdataapp[0].result;
				});
				// console.log(uniquelangdataapp)
				var impressionsapp;
				var completeapp;
				var clickapp;
				var firstqapp;
				var thirdqapp;
				var midpointapp;
				var appimpredata = [];
				impredatacamp.map((dd) => {
					appimpredata = dd.report.filter((x) => x.appId === appIdreq);
					appimpredata = appimpredata[0].result;
					impressionsapp = appimpredata.impression ? appimpredata.impression : 0;
					completeapp = appimpredata.complete ? appimpredata.complete : 0;
					clickapp = appimpredata.click
						? appimpredata.click
						: 0 + appimpredata.companionclicktracking
							? appimpredata.companionclicktracking
							: 0 + appimpredata.clicktracking ? appimpredata.clicktracking : 0;
					firstqapp = appimpredata.firstquartile ? appimpredata.firstquartile : 0;
					thirdqapp = appimpredata.thirdquartile ? appimpredata.thirdquartile : 0;
					midpointapp = appimpredata.midpoint ? appimpredata.midpoint : 0;
				});
				var regiondataapp = [];
				regiondatacamp.map((dd) => {
					regiondataapp = dd.report.filter((x) => x.appId === appIdreq);
					regiondataapp = regiondataapp[0].result;
					regiondataapp = regiondataapp.map((ad) => {
						var regionlocal = uniqueregiondataapp.filter((x) => x.region === ad.region);
						regionlocal.map((mad) => {
							ad.unique = mad.unique;
						});
						return ad;
					});
					// console.log(regiondataapp)
				});
				var pindataapp = [];
				pindatacamp.map((dd) => {
					pindataapp = dd.report.filter((x) => x.appId === appIdreq);
					pindataapp = pindataapp[0].result;
					pindataapp = pindataapp.map((ad) => {
						var pinlocal = uniquepindataapp.filter((x) => x.zip === ad.zip);
						// console.log(JSON.stringify(pinlocal[0]))
						pinlocal.map((mad) => {
							ad.unique = mad.unique;
						});
						return ad;
					});
					// console.log(pindataapp)
				});
				var langdataapp = [];
				languagedatacamp.map((dd) => {
					langdataapp = dd.report.filter((x) => x.appId === appIdreq);
					langdataapp = langdataapp[0].result;
					langdataapp = langdataapp.map((ad) => {
						var langlocal = uniquelangdataapp.filter((x) => x.zip === ad.zip);
						// console.log(JSON.stringify(langlocal[0]))
						langlocal.map((mad) => {
							ad.unique = mad.unique;
						});
						return ad;
					});
					// console.log(langdataapp)
				});
				var devicedataapp = [];
				devicedatacamp.map((dd) => {
					devicedataapp = dd.report.filter((x) => x.appId === appIdreq);
					devicedataapp = devicedataapp[0].result;
					// console.log(devicedataapp)
				});
				var phmodataapp = [];
				phmodatacamp.map((dd) => {
					phmodataapp = dd.report.filter((x) => x.appId === appIdreq);
					phmodataapp = phmodataapp[0].result;
					// console.log(phmodataapp)
				});
				var plattypedataapp = [];
				plattypedatacamp.map((dd) => {
					plattypedataapp = dd.report.filter((x) => x.appId === appIdreq);
					plattypedataapp = plattypedataapp[0].result;
					// console.log(plattypedataapp)
				});
				var platformbasedataapp = [];
				platformdatacamp.map((dd) => {
					platformbasedataapp = dd.report.filter((x) => x.appId === appIdreq);
					platformbasedataapp = platformbasedataapp[0].result;
					// console.log(platformbasedataapp)
				});
				const Report = mongoose.model('Report');
				const report = new Report({
					date: repodate,
					Publisher: appIdreq,
					campaignId: campId,
					impressions: impressionsapp,
					firstQuartile: firstqapp,
					midpoint: midpointapp,
					thirdQuartile: thirdqapp,
					complete: completeapp,
					clicks: clickapp,
					publishunique: appuniquecount,
					campunique: uniquecountofcamp,
					region: regiondataapp,
					platformtype: plattypedataapp,
					language: langdataapp,
					pincode: pindataapp,
					phoneModel: phmodataapp,
					phonePlatform: platformbasedataapp,
					deviceModel: devicedataapp
				});
				report.save().then((ree) => console.log('complete')).catch((err) => console.log(err));
			});
		});
	} catch (e) {
		console.log(e);
	}
	// res.json(compr)
}

cron.schedule('42 00 * * *', function() {
	PublisherDataRefresher();
});

cron.schedule('45 00 * * *', function() {
	FrequencyDataRefresher();
});

cron.schedule('55 00 * * *', function() {
	pincodesumreport();
});

cron.schedule('35 00 * * *', function() {
	var datee = new Date(date).toISOString();
	var cdatee = new Date(new Date());
	var cdate, cmonth, cyear;
	var datee = new Date(date).toISOString();
	cdatee.setDate(cdatee.getDate() - 1);
	cdate = cdatee.getDate();
	cdate = cdate < 10 ? '0' + cdate : cdate;
	cmonth = cdatee.getMonth() + 1;
	cmonth = cmonth < 10 ? '0' + cmonth : cmonth;
	cyear = cdatee.getFullYear();
	var chevk = `${cyear}-${cmonth}-${cdate}T00:00:00.000Z`;
	FrequencyPublisherRefresher(chevk);
});

function arrayincludefinder(array, id) {
	var status = false;
	array.map((x) => {
		if (x)
			if (x.equals(id)) {
				status = true;
			}
	});
	return status;
}

function arr_diff(a1, a2) {
	var a = [],
		diff = [],
		daila = 0,
		diffa = 0,
		cou = 0;
	for (var i = 0; i < a1.length; i++) {
		diffa += 1;
		a[a1[i]] = true;
	}
	for (var i = 0; i < a2.length; i++) {
		if (a[a2[i]]) {
			cou += 1;
			delete a[a2[i]];
		}
	}
	for (var k in a) {
		daila += 1;
		diff.push(k);
	}
	// console.log(diff.length, diffa - daila, cou);
	return diff;
}

const timefinder = (da1, da2) => {
	var d1 = new Date(da1);
	var d2 = new Date(da2);
	if (d1 === d2) {
		return 1;
	}
	if (d1 < d2) {
		return 1;
	}
	var show = d1.getTime() - d2.getTime();
	var resula = show / (1000 * 3600 * 24);
	if (Math.round(resula * 1) / 1 === 0) {
		resula = 1;
	}
	return Math.round(resula * 10) / 10;
};

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
var email = 'support@paytunes.in';
var aws = require('aws-sdk');
const adminauth = require('./authenMiddleware/adminauth');
aws.config.loadFromPath(__dirname + '/config.json');

cron.schedule('00 09 * * *', function() {
	commonfunctions.func3();
});

// cron.schedule('30 18 * * *', function() {
// 	pincodesumreport();
// });

async function PublisherConsoleLoaderTypeWise(array, type) {
	// console.log(array.length, array[0]);
	// for (var z = 0; z < array.length; z++) {
	// 	console.log(array[z]);
	// }
	var contda = array ? array.length : 0;
	if (array && array.length)
		array.map(async (publis) => {
			// console.log(publisherB.PublisherSplit);
			var publisherBit = publis;
			// publisherBit.Publisher = [ ...new Set(publisherBit.Publisher) ];
			publisherBit.ssp = [ ...new Set(publisherBit.ssp) ];
			var testappubid = publisherBit.apppubidpo;
			// console.log(publisherBit.test);
			var daysCount = 1;
			if (typeof publisherBit.test === 'object') {
				publisherBit.test = [ ...new Set(publisherBit.test) ];
				publisherBit.test.sort(function(a, b) {
					var d1 = new Date(a);
					var d2 = new Date(b);
					return d1 - d2;
				});
				// console.log(publisherBit.test);
				daysCount = publisherBit.test.length;
				publisherBit.test = publisherBit.test[0];
			}
			var forda;
			if (testappubid && testappubid.length)
				for (var i = 0; i < testappubid.length; i++) {
					if (testappubid && testappubid[i] && testappubid[i].publishername) {
						forda = testappubid[i];
						break;
					}
				}
			publisherBit.apppubidpo = forda;
			publisherBit.ssp = publisherBit.ssp ? publisherBit.ssp[0] : '';
			publisherBit.campaignId = publisherBit.campaignId.map((id) => mongoose.Types.ObjectId(id));
			// console.log(publisherBit.campaignId);
			const userCount = await freqpublishreports.aggregate([
				{ $match: { appId: publisherBit.PublisherSplit, rtbType: type } },
				{ $group: { _id: null, users: { $sum: '$users' } } }
			]);
			var numbr = 0;
			// console.log(userCount);
			if (userCount.length) {
				numbr = userCount[0].users;
			}
			var faa = publisherBit.feed !== undefined ? publisherBit.feed : null;
			const match = await publisherwiseConsole
				.findOne({ apppubid: publisherBit.PublisherSplit, type: type, feed: faa })
				.catch((err) => console.log(err));
			// console.log(match);
			if (!match) {
				// var time = timefinder(new Date(), publisherBit.test);
				if (type === 'display') {
					const newzip = new publisherwiseConsole({
						apppubid: publisherBit.PublisherSplit,
						createdOn: publisherBit.test,
						type: type,
						days: daysCount,
						unique: numbr,
						publisherName: publisherBit.apppubidpo
							? publisherBit.apppubidpo.publishername
								? publisherBit.apppubidpo.publishername
								: publisherBit.PublisherSplit
							: publisherBit.PublisherSplit,
						ssp: publisherBit.ssp,
						feed: publisherBit.feed !== undefined ? publisherBit.feed : null,
						impression: publisherBit.impressions ? publisherBit.impressions : 0,
						click: publisherBit.clicks
							? publisherBit.clicks
							: 0 + publisherBit.clicks1 ? publisherBit.clicks1 : 0
					});
					var suc = await newzip.save().catch((err) => console.log(err));
					console.log('created', contda--);
				} else {
					const newzip = new publisherwiseConsole({
						apppubid: publisherBit.PublisherSplit,
						createdOn: publisherBit.test,
						type: type,
						days: daysCount,
						unique: numbr,
						publisherName: publisherBit.apppubidpo
							? publisherBit.apppubidpo.publishername
								? publisherBit.apppubidpo.publishername
								: publisherBit.PublisherSplit
							: publisherBit.PublisherSplit,
						ssp: publisherBit.ssp,
						feed: publisherBit.feed !== undefined ? publisherBit.feed : null,
						impression: publisherBit.impressions ? publisherBit.impressions : 0,
						start: publisherBit.start ? publisherBit.start : 0,
						firstQuartile: publisherBit.firstQuartile ? publisherBit.firstQuartile : 0,
						midpoint: publisherBit.midpoint ? publisherBit.midpoint : 0,
						thirdQuartile: publisherBit.thirdQuartile ? publisherBit.thirdQuartile : 0,
						complete: publisherBit.complete ? publisherBit.complete : 0,
						click: publisherBit.clicks
							? publisherBit.clicks
							: 0 + publisherBit.clicks1 ? publisherBit.clicks1 : 0
					});
					var suc = await newzip.save().catch((err) => console.log(err));
					console.log('created', contda--);
				}
			} else {
				if (match.createdOn === publisherBit.test && match.days === daysCount) {
					console.log('Already Done', contda--);
				} else if (type === 'display') {
					// console.log(match.appubid);
					match.createdOn = publisherBit.test;
					if (match.unique && match.unique < numbr) match.unique = numbr;
					match.impression = publisherBit.impressions;
					match.click = publisherBit.clicks
						? publisherBit.clicks
						: 0 + publisherBit.clicks1 ? publisherBit.clicks1 : 0;
					match.days = daysCount;
					match
						.save()
						.then((d) => {
							console.log('updated', contda--);
						})
						.catch((err) => console.log('err'));
				} else {
					// console.log(match.appubid);
					match.createdOn = publisherBit.test;
					if (match.unique && match.unique < numbr) match.unique = numbr;
					match.impression = publisherBit.impressions;
					match.start = publisherBit.start;
					match.firstQuartile = publisherBit.firstQuartile;
					match.midpoint = publisherBit.midpoint;
					match.thirdQuartile = publisherBit.thirdQuartile;
					match.complete = publisherBit.complete;
					match.click = publisherBit.clicks
						? publisherBit.clicks
						: 0 + publisherBit.clicks1 ? publisherBit.clicks1 : 0;
					match.days = daysCount;
					match
						.save()
						.then((d) => {
							console.log('updated', contda--);
						})
						.catch((err) => console.log('err'));
				}
			}
		});
}

var fixDate = new Date('2021-07-01').toISOString();
console.log(fixDate);
const saavnids = [
	'22308',
	'22310',
	'5a1e46beeb993dc67979412e',
	'5efac6f9aeeeb92b8a1ee056',
	'11726',
	'com.jio.media.jiobeats',
	'441813332'
];

// PublisherDataRefresher();
async function PublisherDataRefresher() {
	// let date = new Date(new Date());
	// date.setDate(date.getDate() - 1);
	// date = new Date(date);
	// const year = date.getFullYear();
	// const month = `0${date.getMonth() + 1}`;
	// const date1 = date.getDate();
	// let yesterday = `${year}-${month}-${date1}`;
	// console.log('yesterday', yesterday);
	var datee = new Date('2021-09-05').toISOString();
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
	console.log(datee, chevk, chevk2);
	const adsetting = mongoose.model('adsetting');
	const StreamingAds = mongoose.model('streamingads');
	const publisherapps = mongoose.model('publisherapps');
	const publisherwiseConsole = mongoose.model('publisherwiseConsole');
	const campaignwisereports = mongoose.model('campaignwisereports');
	const idsTo = await StreamingAds.find({}, { _id: 1 }).catch((err) => console.log(err));
	var totalids = [];
	var idsDefined = [];
	idsTo.forEach((x) => {
		totalids.push(mongoose.Types.ObjectId(x._id));
	});
	const sup_ids = await adsetting
		.find({ campaignId: { $in: totalids } })
		.select('campaignId type')
		.catch((err) => console.log(err));
	var ids = { audio: [], display: [], video: [] };
	var audio_type = sup_ids.filter((x) => x.type === 'audio');
	var display_type = sup_ids.filter((x) => x.type === 'display');
	var video_type = sup_ids.filter((x) => x.type === 'video');
	audio_type.forEach((x) => {
		ids.audio.push(x.campaignId.toString());
		idsDefined.push(x.campaignId.toString());
	});
	display_type.forEach((x) => {
		ids.display.push(x.campaignId.toString());
		idsDefined.push(x.campaignId.toString());
	});
	video_type.forEach((x) => {
		ids.video.push(x.campaignId.toString());
		idsDefined.push(x.campaignId.toString());
	});
	var letf = arr_diff(totalids, idsDefined);
	letf.map((d) => {
		ids.audio.push(d.toString());
	});
	// console.log(totalids.length);
	// var audiodig = arr_diff(totalids, idsDefined);
	// console.log(totalids.length, idsDefined.length);
	// console.log(audiodig.length);
	ids.audio = ids.audio.map((x) => mongoose.Types.ObjectId(x));
	ids.display = ids.display.map((x) => mongoose.Types.ObjectId(x));
	ids.video = ids.video.map((x) => mongoose.Types.ObjectId(x));
	console.log(ids.audio.length, ids.display.length, ids.video.length);
	var publisherDataAudio = await campaignwisereports
		.aggregate([
			{ $match: { campaignId: { $in: ids.audio } } },
			{
				$project: {
					test: { $dateToString: { format: '%Y-%m-%d', date: '$createdOn' } },
					apppubid: '$apppubid',
					feed: '$feed',
					ssp: '$ssp',
					campaignId: '$campaignId',
					impression: '$impression',
					CompanionClickTracking: '$CompanionClickTracking',
					SovClickTracking: '$SovClickTracking',
					start: '$start',
					firstQuartile: '$firstQuartile',
					midpoint: '$midpoint',
					thirdQuartile: '$thirdQuartile',
					complete: '$complete'
				}
			},
			{ $match: { test: { $gte: datee, $lt: chevk2 } } },
			{
				$group: {
					_id: { appubid: '$apppubid', feed: '$feed' },
					test: { $push: '$test' },
					ssp: { $push: '$ssp' },
					camp: { $push: '$campaignId' },
					impressions: { $sum: '$impression' },
					clicks: { $sum: '$CompanionClickTracking' },
					clicks1: { $sum: '$SovClickTracking' },
					start: { $sum: '$start' },
					firstQuartile: { $sum: '$firstQuartile' },
					midpoint: { $sum: '$midpoint' },
					thirdQuartile: { $sum: '$thirdQuartile' },
					complete: { $sum: '$complete' }
				}
			},
			{
				$project: {
					PublisherSplit: '$_id.appubid',
					feed: '$_id.feed',
					test: '$test',
					ssp: '$ssp',
					campaignId: '$camp',
					impressions: '$impressions',
					clicks: '$clicks',
					clicks1: '$clicks1',
					start: '$start',
					firstQuartile: '$firstQuartile',
					midpoint: '$midpoint',
					thirdQuartile: '$thirdQuartile',
					complete: '$complete',
					_id: 0
				}
			},
			{
				$lookup: {
					from: 'apppublishers',
					localField: 'PublisherSplit',
					foreignField: 'publisherid',
					as: 'apppubidpo'
				}
			}
		])
		.catch((err) => console.log(err));
	var publisherDataDisplay = await campaignwisereports
		.aggregate([
			{ $match: { campaignId: { $in: ids.display } } },
			{
				$project: {
					test: { $dateToString: { format: '%Y-%m-%d', date: '$createdOn' } },
					apppubid: '$apppubid',
					feed: '$feed',
					ssp: '$ssp',
					campaignId: '$campaignId',
					impression: '$impression',
					CompanionClickTracking: '$CompanionClickTracking',
					SovClickTracking: '$SovClickTracking'
				}
			},
			{ $match: { test: { $gte: datee, $lt: chevk2 } } },
			{
				$group: {
					_id: { appubid: '$apppubid', feed: '$feed' },
					test: { $push: '$test' },
					ssp: { $push: '$ssp' },
					camp: { $push: '$campaignId' },
					impressions: { $sum: '$impression' },
					clicks: { $sum: '$CompanionClickTracking' },
					clicks1: { $sum: '$SovClickTracking' }
				}
			},
			{
				$project: {
					PublisherSplit: '$_id.appubid',
					feed: '$_id.feed',
					test: '$test',
					ssp: '$ssp',
					campaignId: '$camp',
					impressions: '$impressions',
					clicks: '$clicks',
					clicks1: '$clicks1',
					_id: 0
				}
			},
			{
				$lookup: {
					from: 'apppublishers',
					localField: 'PublisherSplit',
					foreignField: 'publisherid',
					as: 'apppubidpo'
				}
			}
		])
		.catch((err) => console.log('err'));
	var publisherDataVideo = await campaignwisereports
		.aggregate([
			{ $match: { campaignId: { $in: ids.video } } },
			{
				$project: {
					test: { $dateToString: { format: '%Y-%m-%d', date: '$createdOn' } },
					apppubid: '$apppubid',
					feed: '$feed',
					ssp: '$ssp',
					campaignId: '$campaignId',
					impression: '$impression',
					CompanionClickTracking: '$CompanionClickTracking',
					SovClickTracking: '$SovClickTracking',
					start: '$start',
					firstQuartile: '$firstQuartile',
					midpoint: '$midpoint',
					thirdQuartile: '$thirdQuartile',
					complete: '$complete'
				}
			},
			{ $match: { test: { $gte: datee, $lt: chevk2 } } },
			{
				$group: {
					_id: { appubid: '$apppubid', feed: '$feed' },
					test: { $push: '$test' },
					ssp: { $push: '$ssp' },
					camp: { $push: '$campaignId' },
					impressions: { $sum: '$impression' },
					clicks: { $sum: '$CompanionClickTracking' },
					clicks1: { $sum: '$SovClickTracking' },
					start: { $sum: '$start' },
					firstQuartile: { $sum: '$firstQuartile' },
					midpoint: { $sum: '$midpoint' },
					thirdQuartile: { $sum: '$thirdQuartile' },
					complete: { $sum: '$complete' }
				}
			},
			{
				$project: {
					PublisherSplit: '$_id.appubid',
					feed: '$_id.feed',
					test: '$test',
					ssp: '$ssp',
					campaignId: '$camp',
					impressions: '$impressions',
					clicks: '$clicks',
					clicks1: '$clicks1',
					start: '$start',
					firstQuartile: '$firstQuartile',
					midpoint: '$midpoint',
					thirdQuartile: '$thirdQuartile',
					complete: '$complete',
					_id: 0
				}
			},
			{
				$lookup: {
					from: 'apppublishers',
					localField: 'PublisherSplit',
					foreignField: 'publisherid',
					as: 'apppubidpo'
				}
			}
		])
		.catch((err) => console.log('err'));
	// publisherDataAudio = await publisherapps
	// 	.populate(publisherDataAudio, { path: 'Publisher', select: '_id AppName' })
	// 	.catch((err) => console.log('err'));
	// publisherDataDisplay = await publisherapps
	// 	.populate(publisherDataDisplay, { path: 'Publisher', select: '_id AppName' })
	// 	.catch((err) => console.log('err'));
	// publisherDataVideo = await publisherapps
	// 	.populate(publisherDataVideo, { path: 'Publisher', select: '_id AppName' })
	// 	.catch((err) => console.log('err'));
	console.log('started');
	console.log(publisherDataAudio.length, publisherDataDisplay.length, publisherDataVideo.length);
	await PublisherConsoleLoaderTypeWise(publisherDataAudio, 'audio');
	await PublisherConsoleLoaderTypeWise(publisherDataDisplay, 'display');
	await PublisherConsoleLoaderTypeWise(publisherDataVideo, 'video');
}

// FrequencyDataRefresher();
async function FrequencyDataRefresher() {
	let date = new Date(new Date());
	date.setDate(date.getDate() - 1);
	date = new Date(date);
	const year = date.getFullYear();
	const month = `0${date.getMonth() + 1}`;
	const date1 = date.getDate();
	let yesterday = `${year}-${month}-${date1}`;
	console.log('yesterday', yesterday);
	// { $match: { test: yesterday } },
	const frequency = await frequencyreports.aggregate([
		{
			$project: {
				test: { $dateToString: { format: '%Y-%m-%d', date: '$createdOn' } },
				frequency: '$frequency',
				users: '$users',
				impression: '$impression',
				click: '$click'
			}
		},
		{ $match: { test: { $gte: fixDate } } },
		{
			$group: {
				_id: '$frequency',
				users: { $sum: '$users' },
				impression: { $sum: '$impression' },
				click: { $sum: '$click' }
			}
		}
	]);
	console.log(frequency.length);
	frequency.forEach(async (frequenct) => {
		const match = await frequencyConsole.findOne({ frequency: frequenct._id });
		if (!match) {
			const newzip = new frequencyConsole({
				frequency: frequenct._id,
				impression: frequenct.impression,
				click: frequenct.click,
				users: frequenct.users
			});
			await newzip.save().catch((err) => console.log(err));
			console.log('created');
		} else {
			const updateddoc = await frequencyConsole
				.findOneAndUpdate(
					{ frequency: frequenct._id },
					{
						impression: frequenct.impressions,
						click: frequenct.click,
						users: frequenct.users
					},
					{ new: true }
				)
				.catch((err) => console.log(err));
			console.log('updated');
		}
	});
}

app.put('/callfrequencypubliser', adminauth, (req, res) => {
	const { date } = req.body;
	var datee = new Date(date).toISOString();
	FrequencyPublisherRefresher(datee);
});

app.put('/callfrequencycampaign', adminauth, async (req, res) => {
	const { date } = req.body;
	var datee = new Date(date).toISOString();
	var result = await FrequencyCampaignRefresher(datee);
	res.json(result);
});

app.put('/callfrequencycampaign2', adminauth, async (req, res) => {
	const { date } = req.body;
	var datee = new Date(date).toISOString();
	var result = await FrequencyCampaignRefresher2(datee);
	res.json(result);
});

// FrequencyPublisherRefresher();
async function FrequencyPublisherRefresher(datae) {
	// let date = new Date(new Date());
	// date.setDate(date.getDate() - 1);
	// date = new Date(date);
	// const year = date.getFullYear();
	// const month = `0${date.getMonth() + 1}`;
	// const date1 = date.getDate();
	// let yesterday = `${year}-${month}-${date1}`;
	// console.log('yesterday', yesterday);
	var datee = new Date('2021-10-10').toISOString();
	// var datee = new Date(new Date());
	// datee.setDate(datee.getDate() - 1);
	// var date = datee.getDate();
	// var month = datee.getMonth() + 1;
	// var year = datee.getFullYear();
	// console.log(datee.getFullYear(), datee.getMonth() + 1, datee.getDate());
	// var datee2 = new Date().toISOString();
	var cdate, cmonth, cyear;
	var cdatee = new Date(new Date());
	cdate = cdatee.getDate();
	cdate = cdate < 10 ? '0' + cdate : cdate;
	cmonth = cdatee.getMonth() + 1;
	cmonth = cmonth < 10 ? '0' + cmonth : cmonth;
	cyear = cdatee.getFullYear();
	var chevk2 = `${cyear}-${cmonth}-${cdate}T00:00:00.000Z`;
	cdatee.setDate(cdatee.getDate() - 1);
	cdate = cdatee.getDate();
	cdate = cdate < 10 ? '0' + cdate : cdate;
	cmonth = cdatee.getMonth() + 1;
	cmonth = cmonth < 10 ? '0' + cmonth : cmonth;
	cyear = cdatee.getFullYear();
	var chevk = `${cyear}-${cmonth}-${cdate}T00:00:00.000Z`;
	if (datae) {
		console.log(datae);
		chevk = datae;
	}
	console.log(datee, chevk, chevk2);
	// datee2.setDate(datee2.getDate());
	// var date2 = datee2.getDate();
	// var month2 = datee2.getMonth() + 1;
	// var year2 = datee2.getFullYear();
	// console.log(datee2.getFullYear(), datee2.getMonth() + 1, datee2.getDate());
	// { $match: { test: yesterday } },
	const frequency = await campaignifareports
		.aggregate([
			{
				$project: {
					test: { $dateToString: { format: '%Y-%m-%d', date: '$createdOn' } },
					campaignId: '$campaignId',
					rtbType: '$rtbType',
					apppubid: '$apppubid',
					impression: '$impression',
					click: '$click'
				}
			},
			{ $match: { test: { $gte: chevk, $lt: chevk2 } } },
			{
				$group: {
					_id: { campaignId: '$campaignId', rtbType: '$rtbType', apppubid: '$apppubid' },
					users: { $sum: 1 },
					impression: { $sum: '$impression' },
					click: { $sum: '$click' }
				}
			}
		])
		.catch((err) => console.log(err));
	console.log(frequency.length);
	var coo = frequency.length;
	frequency.forEach(async (frequenct) => {
		const match = await freqpublishreports.findOne({
			campaignId: frequenct._id.campaignId,
			rtbType: frequenct._id.rtbType,
			appId: frequenct._id.apppubid
		});
		if (!match) {
			const newzip = new freqpublishreports({
				campaignId: frequenct._id.campaignId,
				appId: frequenct._id.apppubid,
				rtbType: frequenct._id.rtbType,
				impression: frequenct.impression ? frequenct.impression : 0,
				createdOn: chevk2,
				click: frequenct.click ? frequenct.click : 0,
				users: frequenct.users ? frequenct.users : 0
			});
			await newzip.save().catch((err) => console.log(err));
			console.log('created', coo--);
		} else {
			if (match.createdOn === chevk2) {
				console.log('Already Done', coo--);
			} else {
				match.impression += frequenct.impressions ? frequenct.impressions : 0;
				match.click += frequenct.click ? frequenct.click : 0;
				match.users += frequenct.users ? frequenct.users : 0;
				match.createdOn = chevk2;
				match
					.save()
					.then((ss) => {
						console.log('updated', coo--);
					})
					.catch((err) => console.log(err));
			}
		}
	});
}

// FrequencyPublisherRefresher();
async function FrequencyCampaignRefresher(datae) {
	// let date = new Date(new Date());
	// date.setDate(date.getDate() - 1);
	// date = new Date(date);
	// const year = date.getFullYear();
	// const month = `0${date.getMonth() + 1}`;
	// const date1 = date.getDate();
	// let yesterday = `${year}-${month}-${date1}`;
	// console.log('yesterday', yesterday);
	var datee = new Date('2021-10-10').toISOString();
	// var datee = new Date(new Date());
	// datee.setDate(datee.getDate() - 1);
	// var date = datee.getDate();
	// var month = datee.getMonth() + 1;
	// var year = datee.getFullYear();
	// console.log(datee.getFullYear(), datee.getMonth() + 1, datee.getDate());
	// var datee2 = new Date().toISOString();
	var cdate, cmonth, cyear;
	var cdatee = new Date(new Date());
	cdate = cdatee.getDate();
	cdate = cdate < 10 ? '0' + cdate : cdate;
	cmonth = cdatee.getMonth() + 1;
	cmonth = cmonth < 10 ? '0' + cmonth : cmonth;
	cyear = cdatee.getFullYear();
	var chevk2 = `${cyear}-${cmonth}-${cdate}T00:00:00.000Z`;
	cdatee.setDate(cdatee.getDate() - 1);
	cdate = cdatee.getDate();
	cdate = cdate < 10 ? '0' + cdate : cdate;
	cmonth = cdatee.getMonth() + 1;
	cmonth = cmonth < 10 ? '0' + cmonth : cmonth;
	cyear = cdatee.getFullYear();
	var chevk = `${cyear}-${cmonth}-${cdate}T00:00:00.000Z`;
	if (datae) {
		console.log(datae);
		chevk = datae;
	}
	console.log(datee, chevk, chevk2);
	// datee2.setDate(datee2.getDate());
	// var date2 = datee2.getDate();
	// var month2 = datee2.getMonth() + 1;
	// var year2 = datee2.getFullYear();
	// console.log(datee2.getFullYear(), datee2.getMonth() + 1, datee2.getDate());
	// { $match: { test: yesterday } },
	const frequency = await campaignifareports
		.aggregate([
			{
				$project: {
					test: { $dateToString: { format: '%Y-%m-%d', date: '$createdOn' } },
					campaignId: '$campaignId',
					rtbType: '$rtbType',
					ifa: '$ifa',
					apppubid: '$apppubid'
				}
			},
			{ $match: { test: { $gte: chevk, $lt: chevk2 } } },
			{
				$group: {
					_id: { campaignId: '$campaignId', rtbType: '$rtbType', apppubid: '$apppubid' },
					ifa: { $addToSet: '$ifa' }
				}
			},
			{
				$unwind: '$ifa'
			},
			{
				$group: {
					_id: { campaignId: '$campaignId', rtbType: '$rtbType', apppubid: '$apppubid' },
					users: { $sum: 1 }
				}
			}
		])
		.allowDiskUse(true)
		.catch((err) => console.log(err));
	console.log(frequency.length);
	console.log(frequency);
	var coo = frequency.length;
	return coo;
	// frequency.forEach(async (frequenct) => {
	// 	const match = await freqpublishreports.findOne({
	// 		campaignId: frequenct._id.campaignId,
	// 		rtbType: frequenct._id.rtbType,
	// 		appId: frequenct._id.apppubid
	// 	});
	// 	if (!match) {
	// 		const newzip = new freqpublishreports({
	// 			campaignId: frequenct._id.campaignId,
	// 			appId: frequenct._id.apppubid,
	// 			rtbType: frequenct._id.rtbType,
	// 			impression: frequenct.impression ? frequenct.impression : 0,
	// 			createdOn: chevk2,
	// 			click: frequenct.click ? frequenct.click : 0,
	// 			users: frequenct.users ? frequenct.users : 0
	// 		});
	// 		await newzip.save().catch((err) => console.log(err));
	// 		console.log('created', coo--);
	// 	} else {
	// 		if (match.createdOn === chevk2) {
	// 			console.log('Already Done', coo--);
	// 		} else {
	// 			match.impression += frequenct.impressions ? frequenct.impressions : 0;
	// 			match.click += frequenct.click ? frequenct.click : 0;
	// 			match.users += frequenct.users ? frequenct.users : 0;
	// 			match.createdOn = chevk2;
	// 			match
	// 				.save()
	// 				.then((ss) => {
	// 					console.log('updated', coo--);
	// 				})
	// 				.catch((err) => console.log(err));
	// 		}
	// 	}
	// });
}

// var dataData = FrequencyCampaignRefresher2('2021-10-10');
// console.log(dataData);
async function FrequencyCampaignRefresher2(datae) {
	// let date = new Date(new Date());
	// date.setDate(date.getDate() - 1);
	// date = new Date(date);
	// const year = date.getFullYear();
	// const month = `0${date.getMonth() + 1}`;
	// const date1 = date.getDate();
	// let yesterday = `${year}-${month}-${date1}`;
	// console.log('yesterday', yesterday);
	var datee = new Date('2021-10-10').toISOString();
	// var datee = new Date(new Date());
	// datee.setDate(datee.getDate() - 1);
	// var date = datee.getDate();
	// var month = datee.getMonth() + 1;
	// var year = datee.getFullYear();
	// console.log(datee.getFullYear(), datee.getMonth() + 1, datee.getDate());
	// var datee2 = new Date().toISOString();
	var cdate, cmonth, cyear;
	var cdatee = new Date(new Date());
	cdate = cdatee.getDate();
	cdate = cdate < 10 ? '0' + cdate : cdate;
	cmonth = cdatee.getMonth() + 1;
	cmonth = cmonth < 10 ? '0' + cmonth : cmonth;
	cyear = cdatee.getFullYear();
	var chevk2 = `${cyear}-${cmonth}-${cdate}T00:00:00.000Z`;
	cdatee.setDate(cdatee.getDate() - 1);
	cdate = cdatee.getDate();
	cdate = cdate < 10 ? '0' + cdate : cdate;
	cmonth = cdatee.getMonth() + 1;
	cmonth = cmonth < 10 ? '0' + cmonth : cmonth;
	cyear = cdatee.getFullYear();
	var chevk = `${cyear}-${cmonth}-${cdate}T00:00:00.000Z`;
	if (datae) {
		console.log(datae);
		chevk = datae;
	}
	console.log(datee, chevk, chevk2);
	// datee2.setDate(datee2.getDate());
	// var date2 = datee2.getDate();
	// var month2 = datee2.getMonth() + 1;
	// var year2 = datee2.getFullYear();
	// console.log(datee2.getFullYear(), datee2.getMonth() + 1, datee2.getDate());
	// { $match: { test: yesterday } },
	const frequency = await campaignifareports
		.aggregate([
			{
				$project: {
					test: { $dateToString: { format: '%Y-%m-%d', date: '$createdOn' } },
					campaignId: '$campaignId',
					rtbType: '$rtbType',
					ifa: '$ifa',
					apppubid: '$apppubid'
				}
			},
			{ $match: { test: { $gte: chevk, $lt: chevk2 } } },
			{
				$group: {
					_id: { ifa: '$ifa', campaignId: '$campaignId', rtbType: '$rtbType', apppubid: '$apppubid' }
				}
			},
			{
				$group: {
					_id: { campaignId: '$campaignId', rtbType: '$rtbType', apppubid: '$apppubid' },
					users: { $sum: 1 }
				}
			}
		])
		.allowDiskUse(true)
		.catch((err) => console.log(err));
	console.log(frequency.length);
	console.log(frequency);
	var coo = frequency.length;
	return coo;
	// frequency.forEach(async (frequenct) => {
	// 	const match = await freqpublishreports.findOne({
	// 		campaignId: frequenct._id.campaignId,
	// 		rtbType: frequenct._id.rtbType,
	// 		appId: frequenct._id.apppubid
	// 	});
	// 	if (!match) {
	// 		const newzip = new freqpublishreports({
	// 			campaignId: frequenct._id.campaignId,
	// 			appId: frequenct._id.apppubid,
	// 			rtbType: frequenct._id.rtbType,
	// 			impression: frequenct.impression ? frequenct.impression : 0,
	// 			createdOn: chevk2,
	// 			click: frequenct.click ? frequenct.click : 0,
	// 			users: frequenct.users ? frequenct.users : 0
	// 		});
	// 		await newzip.save().catch((err) => console.log(err));
	// 		console.log('created', coo--);
	// 	} else {
	// 		if (match.createdOn === chevk2) {
	// 			console.log('Already Done', coo--);
	// 		} else {
	// 			match.impression += frequenct.impressions ? frequenct.impressions : 0;
	// 			match.click += frequenct.click ? frequenct.click : 0;
	// 			match.users += frequenct.users ? frequenct.users : 0;
	// 			match.createdOn = chevk2;
	// 			match
	// 				.save()
	// 				.then((ss) => {
	// 					console.log('updated', coo--);
	// 				})
	// 				.catch((err) => console.log(err));
	// 		}
	// 	}
	// });
}

// pincodesumreport();
async function pincodesumreport() {
	var datee = '2021-07-01';
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
	console.log(chevk, chevk2);
	// console.log(new Date(chevk));
	// var urgeids = [ '615d730f7b759a1e607f3396', '615bd1d73ff29a70f6b0338a', '615840d4b9afb134f60dcc94' ];
	// urgeids = urgeids.map((x) => mongoose.Types.ObjectId(x));
	zipreports
		.aggregate([
			// { $match: { campaignId: { $in: urgeids } } },
			{
				$project: {
					test: { $dateToString: { format: '%Y-%m-%d', date: '$createdOn' } },
					zip: '$zip',
					campaignId: '$campaignId',
					impression: '$impression',
					clicks: { $sum: [ '$SovClickTracking', '$CompanionClickTracking' ] }
				}
			},
			{
				$match: {
					test: { $gte: chevk, $lt: chevk2 }
				}
			},
			{
				$group: {
					_id: { zip: '$zip', campaignId: '$campaignId' },
					impression: { $sum: '$impression' },
					clicks: { $sum: '$clicks' }
				}
			}
		])
		.allowDiskUse(true)
		.then(async (result) => {
			console.log(result.length);
			var co = result.length;
			if (result.length) {
				for (var i = 0; i < result.length; i++) {
					const storeClick = result[i].clicks;
					var id = mongoose.Types.ObjectId(result[i]._id.campaignId);
					let match = await zipsumreport
						.findOne({ zip: result[i]._id.zip, campaignId: id })
						.catch((err) => console.log(err));
					if (match) {
						if (match.createdOn === chevk2) {
							console.log('Already Done', co--);
						} else {
							match.impression += result[i].impression;
							match.clicks += storeClick;
							match.createdOn = chevk2;
							match
								.save()
								.then((rs) => {
									console.log('updated', co--);
								})
								.catch((err) => console.log(err));
						}
					} else {
						const zipmac = new zipsumreport({
							zip: result[i]._id.zip,
							campaignId: result[i]._id.campaignId,
							impression: result[i].impression,
							clicks: storeClick,
							createdOn: chevk2
						});
						zipmac
							.save()
							.then((sda) => {
								console.log('created', co--);
							})
							.catch((err) => console.log(err));
					}
				}
			}
		})
		.catch((err) => console.log(err));
}

const removeDuplicates = (inputArray) => {
	const ids = [];
	return inputArray.reduce((sum, element) => {
		if (!ids.includes(element.toString())) {
			sum.push(element);
			ids.push(element.toString());
		}
		return sum;
	}, []);
};

const musicids = [
	'13698',
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

function remove_duplicates_arrayobject(gotarray, unique) {
	var obj = {};
	var array = gotarray;
	// console.log(array)
	for (var i = 0, len = array.length; i < len; i++) obj[array[i][unique]] = array[i];

	array = new Array();
	for (var key in obj) array.push(obj[key]);

	return array;
}

const idfindspilter = async (respo, onDemand, podcast, audio, display, video, musicapps) => {
	// const { adtitle, onDemand, podcast, audio, display, video, musicapps } = req.body;
	var data;
	data = respo.length && respo[0];
	if (data) {
		var ids =
			typeof campaignId !== 'undefined' && typeof campaignId !== 'string' && typeof campaignId !== 'object'
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
			if (ids && ids.length) {
				data.ids.audio = ids;
				var dattarget = data.TargetImpressions && data.TargetImpressions.length ? data.TargetImpressions : [];
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
		// res.json(data);
		// console.log(data);
		// return data;
		var dass = [];
		var puller = {};
		var pullerData = {};
		pullerData['complete'] = {
			target: 0,
			clicks: 0,
			clicks1: 0,
			complete: 0,
			firstQuartile: 0,
			impressions: 0,
			midpoint: 0,
			ltr: 0,
			start: 0,
			thirdQuartile: 0,
			updatedAt: []
		};
		if (audio) {
			dass.push(audio);
			if (puller[audio]) {
				data.ids.audio.map((x) => puller[audio].push(x));
				// puller[`${audio}target`] += data.ids.audimpression;
				pullerData[`complete`].target += data.ids.audimpression;
			} else {
				puller[audio] = [];
				// puller[`${audio}target`] = 0;
				// puller[`${audio}target`] += data.ids.audimpression;
				pullerData[`complete`].target += data.ids.audimpression;
				data.ids.audio.map((x) => puller[audio].push(x));
			}
		}
		if (!(onDemand === podcast && onDemand === musicapps)) {
			if (onDemand) {
				dass.push(onDemand);
				if (puller[onDemand]) {
					data.ids.onDemand.map((x) => puller[onDemand].push(x));
					pullerData[`complete`].target += data.ids.subimpression.dem;
					// puller[`${onDemand}target`] += data.ids.subimpression.dem;
				} else {
					puller[onDemand] = [];
					// puller[`${onDemand}target`] = 0;
					pullerData[`complete`].target += data.ids.subimpression.dem;
					// puller[`${onDemand}target`] += data.ids.subimpression.dem;
					data.ids.onDemand.map((x) => puller[onDemand].push(x));
				}
			}
			if (podcast) {
				dass.push(podcast);
				if (puller[podcast]) {
					data.ids.podcast.map((x) => puller[podcast].push(x));
					pullerData[`complete`].target += data.ids.subimpression.pod;
					// puller[`${podcast}target`] += data.ids.subimpression.pod;
				} else {
					puller[podcast] = [];
					// puller[`${podcast}target`] = 0;
					pullerData[`complete`].target += data.ids.subimpression.pod;
					// puller[`${podcast}target`] += data.ids.subimpression.pod;
					data.ids.podcast.map((x) => puller[podcast].push(x));
				}
			}
			if (musicapps) {
				dass.push(musicapps);
				if (puller[musicapps]) {
					data.ids.musicapps.map((x) => puller[musicapps].push(x));
					pullerData[`complete`].target += data.ids.subimpression.mus;
					// puller[`${musicapps}target`] += data.ids.subimpression.mus;
				} else {
					puller[musicapps] = [];
					// puller[`${musicapps}target`] = 0;
					pullerData[`complete`].target += data.ids.subimpression.mus;
					// puller[`${musicapps}target`] += data.ids.subimpression.mus;
					data.ids.musicapps.map((x) => puller[musicapps].push(x));
				}
			}
		}
		if (display) {
			dass.push(display);
			if (puller[display]) {
				data.ids.display.map((x) => puller[display].push(x));
				pullerData[`complete`].target += data.ids.disimpression;
				// puller[`${display}target`] += data.ids.disimpression;
			} else {
				puller[display] = [];
				// puller[`${display}target`] = 0;
				pullerData[`complete`].target += data.ids.disimpression;
				// puller[`${display}target`] += data.ids.disimpression;
				data.ids.display.map((x) => puller[display].push(x));
			}
		}
		if (video) {
			dass.push(video);
			if (puller[video]) {
				data.ids.video.map((x) => puller[video].push(x));
				pullerData[`complete`].target += data.ids.vidimpression;
				// puller[`${video}target`] += data.ids.vidimpression;
			} else {
				puller[video] = [];
				// puller[`${video}target`] = 0;
				// puller[`${video}target`] += data.ids.vidimpression;
				pullerData[`complete`].target += data.ids.vidimpression;
				data.ids.video.map((x) => puller[video].push(x));
			}
		}
		dass = [ ...new Set(dass) ];
		puller['das'] = dass;
		return puller;
	} else {
		console.log(respo);
		return 'error';
		// res.status(422).json({ error: 'somthing went wrong try again' });
	}
};

// DailyReportMailer();
async function DailyReportMailer() {
	var users = await admin.find({ usertype: 'client' }).select('email').catch((err) => console.log(err));
	// const HTTP = new XMLHttpRequest();
	// HTTP.open('put', 'http://23.98.35.74:5000/streamingads/groupedsingleClient');
	var ses = new aws.SES();
	var cdate, cmonth, cyear;
	var cdatee = new Date(new Date());
	cdate = cdatee.getDate();
	cdate = cdate < 10 ? '0' + cdate : cdate;
	cmonth = cdatee.getMonth() + 1;
	cmonth = cmonth < 10 ? '0' + cmonth : cmonth;
	cyear = cdatee.getFullYear();
	var chevk2 = `${cyear}-${cmonth}-${cdate}`;
	for (var i = 0; i < users.length; i++) {
		var mail = users[i].targetemail ? users[i].targetemail : [];
		var id = users[i]._id;
		console.log(mail, id);
		let campaignss = await campaignClient.find({ userid: id }).catch((err) => console.log(err));
		try {
			console.log(campaignss.length);
			campaignss.map(async (x) => {
				console.log(x.type);
				var endStae = new Date() > new Date(x.endDate);
				if (endStae) {
					console.log('campaign completed');
				} else if (x.type === 'campaign' && x.targetemail && x.targetemail.length) {
					let formdata = await StreamingAds.aggregate([
						{
							$project: {
								id: '$_id',
								AdTitle: { $toLower: '$AdTitle' }
							}
						},
						{
							$match: {
								AdTitle: { $regex: x.searchName.toLowerCase() }
							}
						},
						{
							$group: {
								_id: null,
								id: { $push: '$id' },
								Adtitle: { $push: '$AdTitle' }
							}
						}
					]);
					// console.log(formdata);
					let mashh = await idfindspilter(
						formdata,
						x.onDemand,
						x.podcast,
						x.audio,
						x.display,
						x.video,
						x.musicapps
					);
					// console.log(mashh);
					var totaldataCount = {};
					for (var j = 0; j < mashh.das.length; j++) {
						var idsa = mashh[mashh.das[j]]
							? mashh[mashh.das[j]].map((x) => mongoose.Types.ObjectId(x))
							: [];
						let totalcom = await campaignwisereports.aggregate([
							{ $match: { campaignId: { $in: idsa }, appubid: { $nin: saavnids } } },
							{
								$group: {
									_id: null,
									impressions: { $sum: '$impression' },
									complete: { $sum: '$complete' },
									clicks: { $sum: '$CompanionClickTracking' },
									clicks1: { $sum: '$SovClickTracking' },
									thirdQuartile: { $sum: '$thirdQuartile' },
									start: { $sum: '$start' },
									firstQuartile: { $sum: '$firstQuartile' },
									midpoint: { $sum: '$midpoint' }
								}
							}
						]);
						totalcom = totalcom && totalcom[0];
						if (!totalcom) {
							console.log({ idsa, name: x.searchName });
							continue;
						}
						let reportdaily = await campaignwisereports.aggregate([
							{ $match: { campaignId: { $in: idsa }, appubid: { $nin: saavnids } } },
							{
								$group: {
									_id: { date: '$date' },
									impressions: { $sum: '$impression' },
									complete: { $sum: '$complete' },
									firstQuartile: { $sum: '$firstQuartile' },
									clicks: { $sum: '$CompanionClickTracking' },
									region: { $push: '$region' }
								}
							},
							{
								$project: {
									date: '$_id.date',
									impressions: '$impressions',
									firstQuartile: '$firstQuartile',
									complete: '$complete',
									clicks: '$clicks',
									region: '$region',
									_id: 0
								}
							},
							{ $sort: { date: -1 } }
						]);
						console.log(totalcom, x.searchName, reportdaily.length, 'cooo');
						reportdaily = reportdaily.filter((x) => x.impressions >= 10);
						var totImp = 0,
							totCli = 0,
							totCom = 0;
						var totImp1 = 0,
							totCli1 = 0,
							totCom1 = 0;
						reportdaily.map((dax) => {
							totImp += dax.impressions;
							totCli += dax.clicks;
							totCom += dax.complete;
						});
						// console.log(totalcom);
						totalcom.complete = totalcom.complete / totalcom.firstQuartile * totalcom.impressions;
						reportdaily.map((dax) => {
							dax.impressions = totImp ? Math.round(dax.impressions / totImp * totalcom.impressions) : 0;
							dax.clicks = totCli
								? Math.round(dax.clicks / totCli * (totalcom.clicks + totalcom.clicks1))
								: 0;
							dax.complete = totCom ? Math.round(dax.complete / totCom * totalcom.complete) : 0;
							totImp1 += dax.impressions;
							totCli1 += dax.clicks;
							totCom1 += dax.complete;
						});
						if (totImp > totImp1 || totCli - totCli1 > 0 || totCom - totCom1 > 0)
							reportdaily.push({
								date: '',
								impressions: totImp - totImp1 > 0 ? totImp - totImp1 : 0,
								clicks: totCli - totCli1 > 0 ? totCli - totCli1 : 0,
								complete: totCom - totCom1 > 0 ? totCom - totCom1 : 0
							});
						var dum = reportdaily.filter((x) => x.date === chevk2);
						if (dum.length) {
							reportdaily = reportdaily.filter((x) => x.date != chevk2);
							var tempImp = 0,
								tempCli = 0,
								tempCom = 0;
							dum.map((zx) => {
								tempImp += zx.impressions;
								tempCli += zx.clicks;
								tempCom += zx.complete;
							});
							totImp -= tempImp;
							totCli -= tempCli;
							totCom -= tempCom;
						}
						reportdaily.push({
							date: 'Total',
							impressions: totImp,
							clicks: totCli,
							complete: totCom
						});
						totaldataCount[mashh.das[j]] = reportdaily;
						console.log(totalcom, totImp, totCli, totCom, reportdaily);
						// ses.sendEmail()
					}
					console.log(x.searchName, mashh, totaldataCount);
					// var params = {
					// 	Destination: {
					// 		BccAddresses: [],
					// 		CcAddresses: [],
					// 		ToAddresses: x.targetemail
					// 	},
					// 	Message: {
					// 		Body: {
					// 			Html: {
					// 				Charset: 'UTF-8',
					// 				Data: `
					// 				<head>
					// 				<style>
					// 				table {
					// 				font-family: arial, sans-serif;
					// 				border-collapse: collapse;
					// 				width: 100%;
					// 				}

					// 				td, th {
					// 				border: 1px solid #dddddd;
					// 				text-align: center;
					// 				padding: 4px;
					// 				}

					// 				tr:nth-child(even) {
					// 				background-color: #dddddd;
					// 				}
					// 				</style>
					// 				</head>
					// 				<body>

					// 				${mashh.das
					// 					.map((xas) => {
					// 						return `
					// 						<div>
					// 							<h2>${xas}</h2>
					// 							<table>
					// 								<tr>
					// 									<th>Date</th>
					// 									<th>Impressions</th>
					// 									<th>Clicks</th>
					// 									<th>CTR</th>
					// 									<th>Complete</th>
					// 									<th>LTR</th>
					// 								</tr>
					// 								${totaldataCount[xas]
					// 									.map((dalrep) => {
					// 										return `<tr>
					// 											<td>${dalrep.date}</td>
					// 											<td>
					// 												${dalrep.impressions}
					// 											</td>
					// 											<td>${dalrep.clicks}</td>
					// 											<td>
					// 												${Math.round(dalrep.clicks * 100 * 100 / dalrep.impressions) / 100}%
					// 											</td>
					// 											<td>
					// 												${dalrep.complete}
					// 											</td>
					// 											<td>
					// 												${Math.round(dalrep.complete * 100 * 100 / dalrep.impressions) / 100}%
					// 											</td>
					// 										</tr>`;
					// 									})
					// 									.join('')}
					// 							</table>
					// 						</div>`;
					// 					})
					// 					.join('')}

					// 				</body>
					// 				   `
					// 			},
					// 			Text: {
					// 				Charset: 'UTF-8',
					// 				Data: 'This is the message if in text if no data found.'
					// 			}
					// 		},
					// 		Subject: {
					// 			Charset: 'UTF-8',
					// 			Data: `${x.campaignName} daily report`
					// 		}
					// 	},
					// 	// ReplyToAddresses: [],
					// 	// ReturnPath: '',
					// 	// ReturnPathArn: '',
					// 	// SourceArn: ''
					// 	Source: email
					// };
					// ses.sendEmail(params, function(err, data) {
					// 	if (err)
					// 		console.log(err, err.stack); // an error occurred
					// 	else console.log(data); // successful response
					// 	/*
					// 	data = {
					// 	MessageId: "EXAMPLE78603177f-7a5433e7-8edb-42ae-af10-f0181f34d6ee-000000"
					// 	}
					// 	 */
					// });
					//
					// console.log(formdata);
					// console.log(
					// 	idfindspilter(x.searchName, x.onDemand, x.podcast, x.audio, x.display, x.video, x.musicapps)
					// );
					// let campass = await
					// request(
					// 	{
					// 		url: 'http://23.98.35.74:5000/streamingads/groupedsingleClient',
					// 		method: 'put',
					// 		headers: {
					// 			'Content-Type': 'application/json',
					// 			Authorization: 'Bearer ' + JWT
					// 		},
					// 		body: JSON.stringify({
					// 			adtitle: x.searchName,
					// 			podcast: x.podcast,
					// 			onDemand: x.onDemand,
					// 			musicapps: x.musicapps
					// 		})
					// 	},
					// 	function(error, response, body) {
					// 		console.log('error', error);
					// 		console.log('response', response);
					// 		console.log('body', body);
					// 	}
					// );
					// fetch('/streamingads/groupedsingleClient', {
					// 	method: 'put',
					// 	headers: {
					// 		'Content-Type': 'application/json',
					// 		Authorization: 'Bearer ' + JWT
					// 	},
					// 	body: JSON.stringify({
					// 		adtitle: x.searchName,
					// 		podcast: x.podcast,
					// 		onDemand: x.onDemand,
					// 		musicapps: x.musicapps
					// 	})
					// })
					// 	.then((res) => res.json())
					// 	.then((resul) => {
					// 		console.log(resul);
					// 	})
					// 	.catch((err) => console.log(err));
				} else if (x.type === 'bundle') {
					//
				}
			});
		} catch (e) {
			console.log(e);
		}
	}
}

// result.map(async (zip) => {
// 	const storeClick = zip.CompanionClickTracking
// 		? zip.CompanionClickTracking
// 		: 0 + zip.SovClickTracking ? zip.SovClickTracking : 0;
// 	let match = await zipsumreport
// 		.findOne({ zip: zip._id.zip, campaignId: zip._id.campaignId })
// 		.catch((err) => console.log(err));
// 	if (match) {
// 		if (match.createdOn === chevk2) {
// 			console.log('Already Done');
// 		} else {
// 			match.impression += zip.impression;
// 			match.clicks += storeClick;
// 			match.createdOn = chevk2;
// 			match
// 				.save()
// 				.then((rs) => {
// 					console.log('updated');
// 				})
// 				.catch((err) => console.log(err));
// 		}
// 	} else {
// 		const zipmac = new zipsumreport({
// 			zip: zip._id.zip,
// 			campaignId: zip._id.campaignId,
// 			impression: zip.impression,
// 			clicks: storeClick,
// 			createdOn: chevk2
// 		});
// 		zipmac
// 			.save()
// 			.then((sda) => {
// 				console.log('created');
// 			})
// 			.catch((err) => console.log(err));
// 	}
// });

// publisherDataAudio.forEach(async (publisherB) => {
// 	// console.log(publisherB.PublisherSplit);
// 	var publisherBit = publisherB;
// 	publisherBit.Publisher = [ ...new Set(publisherBit.Publisher) ];
// 	publisherBit.ssp = [ ...new Set(publisherBit.ssp) ];
// 	var testappubid = publisherBit.apppubidpo;
// 	var forda;
// 	if (testappubid && testappubid.length)
// 		for (var i = 0; i < testappubid.length; i++) {
// 			if (testappubid && testappubid[i] && testappubid[i].publishername) {
// 				forda = testappubid[i];
// 				break;
// 			}
// 		}
// 	publisherBit.apppubidpo = forda;
// 	publisherBit.Publisher = publisherBit.Publisher[0];
// 	publisherBit.ssp = publisherBit.ssp ? publisherBit.ssp[0] : '';
// 	publisherBit.campaignId = publisherBit.campaignId[0];
// 	const match = await publisherwiseConsole
// 		.findOne({ apppubid: publisherBit.PublisherSplit, type: 'audio' })
// 		.catch((err) => console.log(err));
// 	if (!match) {
// 		const newzip = new publisherwiseConsole({
// 			apppubid: publisherBit.PublisherSplit,
// 			campaignId: publisherBit.campaignId,
// 			type: 'audio',
// 			publisherName: publisherBit.apppubidpo
// 				? publisherBit.apppubidpo.publishername
// 					? publisherBit.apppubidpo.publishername
// 					: publisherBit.PublisherSplit
// 				: publisherBit.PublisherSplit ? publisherBit.PublisherSplit : publisherBit.Publisher.AppName,
// 			ssp: publisherBit.ssp,
// 			feed: publisherBit.feed !== undefined ? publisherBit.feed : null,
// 			impression: publisherBit.impressions ? publisherBit.impressions : 0,
// 			click: publisherBit.clicks ? publisherBit.clicks : 0 + publisherBit.clicks1 ? publisherBit.clicks1 : 0
// 		});
// 		var suc = await newzip.save().catch((err) => console.log(err));
// 		console.log('created');
// 	} else {
// 		const updateddoc = await publisherwiseConsole
// 			.findOneAndUpdate(
// 				{ publisherBit: publisherBit.PublisherSplit, type: 'audio' },
// 				{
// 					$inc: {
// 						impression: publisherBit.impressions,
// 						click: publisherBit.clicks
// 							? publisherBit.clicks
// 							: 0 + publisherBit.clicks1 ? publisherBit.clicks1 : 0
// 					}
// 				},
// 				{ new: true }
// 			)
// 			.catch((err) => console.log(err));
// 		console.log('updated');
// 	}
// });
// publisherDataDisplay.forEach(async (publisherB) => {
// 	// console.log(publisherB.PublisherSplit);
// 	var publisherBit = publisherB;
// 	publisherBit.Publisher = [ ...new Set(publisherBit.Publisher) ];
// 	publisherBit.ssp = [ ...new Set(publisherBit.ssp) ];
// 	var testappubid = publisherBit.apppubidpo;
// 	var forda;
// 	if (testappubid && testappubid.length)
// 		for (var i = 0; i < testappubid.length; i++) {
// 			if (testappubid && testappubid[i] && testappubid[i].publishername) {
// 				forda = testappubid[i];
// 				break;
// 			}
// 		}
// 	publisherBit.apppubidpo = forda;
// 	publisherBit.Publisher = publisherBit.Publisher[0];
// 	publisherBit.ssp = publisherBit.ssp ? publisherBit.ssp[0] : '';
// 	publisherBit.campaignId = publisherBit.campaignId[0];
// 	const match = await publisherwiseConsole
// 		.findOne({ apppubid: publisherBit.PublisherSplit, type: 'display' })
// 		.catch((err) => console.log(err));
// 	if (!match) {
// 		const newzip = new publisherwiseConsole({
// 			apppubid: publisherBit.PublisherSplit,
// 			campaignId: publisherBit.campaignId,
// 			type: 'display',
// 			publisherName: publisherBit.apppubidpo
// 				? publisherBit.apppubidpo.publishername
// 					? publisherBit.apppubidpo.publishername
// 					: publisherBit.PublisherSplit
// 				: publisherBit.PublisherSplit ? publisherBit.PublisherSplit : publisherBit.Publisher.AppName,
// 			ssp: publisherBit.ssp,
// 			feed: publisherBit.feed !== undefined ? publisherBit.feed : null,
// 			impression: publisherBit.impressions ? publisherBit.impressions : 0,
// 			click: publisherBit.clicks ? publisherBit.clicks : 0 + publisherBit.clicks1 ? publisherBit.clicks1 : 0
// 		});
// 		var suc = await newzip.save().catch((err) => console.log(err));
// 		console.log('created');
// 	} else {
// 		const updateddoc = await publisherwiseConsole
// 			.findOneAndUpdate(
// 				{ publisherBit: publisherBit.PublisherSplit, type: 'display' },
// 				{
// 					$inc: {
// 						impression: publisherBit.impressions,
// 						click: publisherBit.clicks
// 							? publisherBit.clicks
// 							: 0 + publisherBit.clicks1 ? publisherBit.clicks1 : 0
// 					}
// 				},
// 				{ new: true }
// 			)
// 			.catch((err) => console.log(err));
// 		console.log('updated');
// 	}
// });
// publisherDataVideo.forEach(async (publisherB) => {
// 	// console.log(publisherB.PublisherSplit);
// 	var publisherBit = publisherB;
// 	publisherBit.Publisher = [ ...new Set(publisherBit.Publisher) ];
// 	publisherBit.ssp = [ ...new Set(publisherBit.ssp) ];
// 	var testappubid = publisherBit.apppubidpo;
// 	var forda;
// 	if (testappubid && testappubid.length)
// 		for (var i = 0; i < testappubid.length; i++) {
// 			if (testappubid && testappubid[i] && testappubid[i].publishername) {
// 				forda = testappubid[i];
// 				break;
// 			}
// 		}
// 	publisherBit.apppubidpo = forda;
// 	publisherBit.Publisher = publisherBit.Publisher[0];
// 	publisherBit.ssp = publisherBit.ssp ? publisherBit.ssp[0] : '';
// 	publisherBit.campaignId = publisherBit.campaignId[0];
// 	const match = await publisherwiseConsole
// 		.findOne({ apppubid: publisherBit.PublisherSplit, type: 'video' })
// 		.catch((err) => console.log(err));
// 	if (!match) {
// 		const newzip = new publisherwiseConsole({
// 			apppubid: publisherBit.PublisherSplit,
// 			campaignId: publisherBit.campaignId,
// 			type: 'video',
// 			publisherName: publisherBit.apppubidpo
// 				? publisherBit.apppubidpo.publishername
// 					? publisherBit.apppubidpo.publishername
// 					: publisherBit.PublisherSplit
// 				: publisherBit.PublisherSplit ? publisherBit.PublisherSplit : publisherBit.Publisher.AppName,
// 			ssp: publisherBit.ssp,
// 			feed: publisherBit.feed !== undefined ? publisherBit.feed : null,
// 			impression: publisherBit.impressions ? publisherBit.impressions : 0,
// 			click: publisherBit.clicks ? publisherBit.clicks : 0 + publisherBit.clicks1 ? publisherBit.clicks1 : 0
// 		});
// 		var suc = await newzip.save().catch((err) => console.log(err));
// 		console.log('created');
// 	} else {
// 		const updateddoc = await publisherwiseConsole
// 			.findOneAndUpdate(
// 				{ publisherBit: publisherBit.PublisherSplit, type: 'video' },
// 				{
// 					$inc: {
// 						impression: publisherBit.impressions,
// 						click: publisherBit.clicks
// 							? publisherBit.clicks
// 							: 0 + publisherBit.clicks1 ? publisherBit.clicks1 : 0
// 					}
// 				},
// 				{ new: true }
// 			)
// 			.catch((err) => console.log(err));
// 		console.log('updated');
// 	}
// });
