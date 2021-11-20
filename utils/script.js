const cron=require('node-cron')
const { db1, db2 } = require('../db')
const PodcastSchema = require('../server2/model/episodemodel');
const AdsettingSchema = require('../server2/model/addsetting')
const apppublisherschema = require('../server2/model/apppublishers')
const zipreqreportsSchema=require('../server2/model/zipreqreports')
const reqreportsSchema=require('../server2/model/reqreports')
const resreportsSchema=require('../server2/model/resreports')
const DemographySchema=require('../server2/model/demographyreports')
const Uareportschema=require('../server2/model/uareports')

const EpisodeModel1 = db1.model('podcastepisodes', PodcastSchema)
const EpisodeModel = db2.model('podcastepisodes', PodcastSchema)
const Adsetting1 = db1.model('adsettings', AdsettingSchema)
const Adsetting2 = db2.model('adsettings', AdsettingSchema)
const Apppublisher1 = db1.model('apppublishers', apppublisherschema)
const Apppublisher2 = db2.model('apppublishers', apppublisherschema)
const Zipreq1=db1.model('zipreqreports',zipreqreportsSchema);
const Zipreq2=db2.model('zipreqreports',zipreqreportsSchema);
const req1=db1.model('reqreports',reqreportsSchema);
const req2=db2.model('reqreports',reqreportsSchema);
const res1=db1.model('resreports',resreportsSchema);
const res2=db2.model('resreports',resreportsSchema);
const demography1=db1.model('demographyreports',DemographySchema)
const demography2=db2.model('demographyreports',DemographySchema)
const Uareports1=db1.model('uareqreports',Uareportschema)
const Uareports2=db2.model('uareqreports',Uareportschema)



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
		{ $match: { createdOn:  {$gt: new Date(`${yesterday}T00:00:00.000Z`),$lt:new Date()  }  } },
	])
	console.log('podcast',results.length)
	results.map(async (res) => {
		let n = new EpisodeModel1(res);
		await n.save();
	})

}

async function UareqScript() {
	let yesterday = getyesterday()
	let results = await Uareports2.aggregate([
		{ $match: { date:  yesterday  } },
	])
	console.log('ua',results.length)
	results.map(async (res) => {
		let n = new Uareports1(res);
		await n.save();
	})

}

async function Addsettingscript() {

	let yesterday = getyesterday();
	console.log(yesterday)
	let results = await Adsetting2.aggregate([
		{ $match: { createdOn:  {$gt:new Date(`${yesterday}T00:00:00.000Z`) ,$lt:new Date() }  } },
	])
	console.log(results)
	results.map(async (res) => {
		let n = new Adsetting1(res);
		await n.save();
	})
}
 
// ["13342","32434","34234234","43243"]  

async function apppublisherscript() {
	let latestiddetails = await Apppublisher1.aggregate([
		{ $sort: { _id: -1 } },
		{ $limit: 1 }
	])
	console.log('apppub',latestiddetails)
	let results = await Apppublisher2.aggregate([
		{ $match: { _id: { $gt: latestiddetails[0]._id } } }
	])
	results.map(async (res) => {
		let n = new Apppublisher1(res);
		await n.save();
	})
}


async function Demographyscript() {
	let latestiddetails = await demography1.aggregate([
		{ $sort: { _id: -1 } },
		{ $limit: 1 }
	])
	console.log(latestiddetails)
	let results = await demography2.aggregate([
		{ $match: { _id: { $gt: latestiddetails[0]._id } } },
		{$sort:{_id:1}},
		{$skip:20000000}
	]).allowDiskUse(true)
	console.log(results.length)
	results.map(async (res) => {
		let n = new demography1(res);
		await n.save();
	})
}

async function ZipreqScript() {
	let yesterday = getyesterday();
	let results = await Zipreq2.aggregate([
		{ $match: { date: yesterday } },
		{$sort:{date:1}}
	]).allowDiskUse(true)
	console.log('zipreq',results.length)
	results.map(async (res) => {
		let n = new Zipreq1(res);
		await n.save();
	})
}

async function reqScript() {
	let yesterday = getyesterday();
	let results = await req2.aggregate([
		{ $match: { date: yesterday } },
		{$sort:{date:1}}
	])
	console.log('er',results[0])
	results.map(async (res) => {
		let n = new req1(res);
		await n.save();
	})
}

async function resScript() {
	let yesterday = getyesterday();
	console.log(yesterday)
	let results = await res2.aggregate([
		{ $match: { date: yesterday }},
		{$sort:{date:1}}
	])
	console.log(results[0])
	results.map(async (res) => {
		let n = new res1(res);
		await n.save();
	})
}

cron.schedule('52 11 * * *',podcastscript)
cron.schedule('43 11 * * *',UareqScript)
cron.schedule('45 11 * * *',apppublisherscript)
// cron.schedule('35 11 * * *',Addsettingscript)
// cron.schedule('40 00 * * *',reqScript)
// cron.schedule('45 00 * * *',resScript)
cron.schedule('48 11 * * *',ZipreqScript)

// apppublisherscript() 
// Addsettingscript() 
// podcastscript() 
// ZipreqScript() 
// reqScript()  d
// resScript() 
// UareqScript() d
// Demographyscript()
