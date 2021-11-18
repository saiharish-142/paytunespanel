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
// const Zipreq1=db1.model('zipreqreports',zipreqreportsSchema);
// const Zipreq2=db2.model('zipreqreports',zipreqreportsSchema);
// const req1=db1.model('reqreports',reqreportsSchema);
// const req2=db2.model('reqreports',reqreportsSchema);
// const res1=db1.model('resreports',resreportsSchema);
// const res2=db2.model('resreports',resreportsSchema);
// const demography1=db1.model('demographyreports',DemographySchema)
// const demography2=db2.model('demographyreports',DemographySchema)
// const Uareports1=db1.model('uareqreports',Uareportschema)
// const Uareports2=db2.model('uareqreports',Uareportschema)



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
		{ $match: { createdOn:  {$gt:new Date('2021-11-10')}  } },
	])
	console.log(1)
	results.map(async (res) => {
		let n = new EpisodeModel1(res);
		await n.save();
	})

}

async function UareqScript() {
	let yesterday = getyesterday()
	let results = await Uareports2.aggregate([
		{ $match: { date:  {$gt:'2021-11-15'}  } },
	])
	console.log('ua',results.length)
	results.map(async (res) => {
		let n = new Uareports1(res);
		await n.save();
	})

}

async function Addsettingscript() {

	let yesterday = getyesterday();
	let results = await Adsetting2.aggregate([
		{ $match: { createdOn:  new Date(yesterday)  } },
	])
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
	console.log(latestiddetails)
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
	console.log()
	let results = await Zipreq2.aggregate([
		{ $match: { date: yesterday } },
		{$sort:{date:1}}
	]).allowDiskUse(true)
	console.log(results.length)
	results.map(async (res) => {
		let n = new Zipreq1(res);
		await n.save();
	})
}

async function reqScript() {
	let yesterday = getyesterday();
	let results = await req2.aggregate([
		{ $match: { date: { $gt: '2021-09-25' } } },
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
	let results = await res2.aggregate([
		{ $match: { date: { $gt: '2021-10-26' } } },
		{$sort:{date:1}}
	])
	console.log(results[0])
	results.map(async (res) => {
		let n = new res1(res);
		await n.save();
	})
}

// apppublisherscript() d
// Addsettingscript() d
// podcastscript() d
// ZipreqScript() d
// reqScript()  d
// resScript() d
// UareqScript() d
// Demographyscript()
