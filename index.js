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
require('./models/trackinglogs08oct21.model');
require('./models/trackinglogs29jan22.model');
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
require('./models/freqPubreport.models');
require('./models/singleoverallfreqdoc');
require('./models/tempModel.model');
require('./models/tempModel1.model');
require('./models/tempModel2.model');
app.get('/', (req, res) => {
	res.send('hello!');
});
const dataPullerML = require('./Data/DataPuller');
const dynamic = require('./functions/dynamicreports.routes');
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
app.use('/dynamic', dynamic.route);
app.use('/dataPullML', dataPullerML.route);
// const gg=async()=>{
// 	const Apppublisher=require('./models/apppublishers.model');
// 	let publishers=await Apppublisher.find({ $expr: { $ne: [ "$publisherid" , "$bundletitle" ] } });
// 	console.log(publishers.length)
// 	publishers.map(async pub=>{
// 		let puu=await Apppublisher.findOneAndUpdate({_id:pub._id},{$set:{bundletitle:pub.publisherid}})
// 	})
// }

// gg();

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
// PincodeRequestsRefresher();
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
		{ $match: { test: { $gt: '2021-12-01', $lt: '2021-12-06' } } },
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
		{ $match: { test: { $gt: '2021-12-07', $lt: '2021-12-13' } } },
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
	commonfunctions.freqpub(chevk, chevk2);
});

cron.schedule('20 00 * * *', function() {
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
	commonfunctions.freqover(chevk, chevk2);
});

cron.schedule('30 00 * * *', function() {
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
	commonfunctions.freqonlycamp(chevk, chevk2);
	commonfunctions.freqonlypub(chevk, chevk2);
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
const freqpubonreports = mongoose.model('freqpubOnreports');
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
			const userCount = await freqpubonreports.aggregate([
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
	'5c0a3f024a6c1355afaffabc',
	'172101100',
	'172101600',
	'11726',
	'com.jio.media.jiobeats',
	'441813332'
];

app.get('/publisherdatarefresh', adminauth, (req, res) => {
	PublisherDataRefresher();
	res.json('started');
});

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
	var datee = '2021-11-01';
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
