
const { db1, db2 } = require('../db')
const PodcastSchema = require('../server2/model/episodemodel');
const AdsettingSchema = require('../server2/model/addsetting')
const apppublisherschema = require('../server2/model/apppublishers')


const EpisodeModel1 = db1.model('podcastepisodes', PodcastSchema)
const EpisodeModel = db2.model('podcastepisodes', PodcastSchema)
const Adsetting1 = db1.model('adsettings', AdsettingSchema)
const Adsetting2 = db2.model('adsettings', AdsettingSchema)
const Apppublisher1 = db1.model('apppublishers', apppublisherschema)
const Apppublisher2 = db2.model('apppublishers', apppublisherschema)


function getyesterday() {
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
	return yesterday
}


async function podcastscript() {
	let yesterday = getyesterday()
	let results = await EpisodeModel.aggregate([
		{ $match: { createdOn: { $gt: new Date(yesterday) } } },
	])

	results.map(async (res) => {
		let n = new EpisodeModel1(res);
		await n.save();
	})

}

async function Addsettingscript() {

	let yesterday = getyesterday();
	let results = await Adsetting2.aggregate([
		{ $match: { createdOn: { $gt: new Date(yesterday) } } },
	])
	results.map(async (res) => {
		let n = new Adsetting1(res);
		await n.save();
	})
}

async function apppublisherscript() {
	let latestiddetails = await Apppublisher1.aggregate([
		{ $sort: { _id: -1 } },
		{ $limit: 1 }
	])
	console.log(latestiddetails)
	let results = await Apppublisher2.aggregate([
		{ $match: { _id: { $gt: latestiddetails[0]._id } } }
	])
	results.map(async (res) => {
		let n = new Apppublisher1(res);
		await n.save();
	})
}
apppublisherscript()
Addsettingscript()
podcastscript()

