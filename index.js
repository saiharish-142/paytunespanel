const express = require('express')
const app = express()
const port = process.env.PORT || 5000
const mongoose = require('mongoose')
const cors = require('cors')
const { MONGOURI } = require('./config/keys')
const cron = require('node-cron')

app.use(express.json())
app.use(cors())

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 900000,
    socketTimeoutMS: 900000,
    useCreateIndex: true
}

mongoose.connect(MONGOURI,options)
mongoose.connection.on('connected',() => {
    console.log("connected to database.....")
})
mongoose.connection.on('error',err=>{
    console.log('error in connection',err)
})

require('./models/user.model')
require('./models/streamingads.model')
require('./models/publisherapps.model')
require('./models/trackinglogs.model')
require('./models/oldtracking.model')
require('./models/wrappers.model')
require('./models/rtbrequests.model')
require('./models/report.model')
require('./models/campaignwisereports.model')
require('./models/adsettings.model')
require('./models/uniqueuser.model')
require('./models/bundlenamereports')
require('./models/campaignifareports')
require('./models/citylanguagereports')
require('./models/phonemakereports')
require('./models/phonemodelreports')
require('./models/phonemodel2reports')
require('./models/platformtypereports')
require('./models/pptypereports')
require('./models/regionreports')
require('./models/spentreports')
require('./models/uniqueuserreports')
require('./models/zipreports')
require('./models/zipdata2reports')
require('./models/zipuniqueuserreports')
require('./models/bindingcollections.model')
require('./models/reqreports.js')
require('./models/resreports.js')
require('./models/phonemodel2reports.js')
require('./models/categoryreports')
require('./models/categoryreports2')

app.use('/auth',require('./routes/user.routes'))
app.use('/streamingads',require('./routes/streamingads.routes'))
app.use('/ads',require('./routes/adsetting.routes'))
app.use('/publishers',require('./routes/publisherapps.routes'))
app.use('/logs',require('./routes/trackinglogs.routes'))
app.use('/oldlogs',require('./routes/oldtracking.routes'))
app.use('/wrapper',require('./routes/wrapper.routes'))
app.use('/report',require('./routes/report.routes'))
app.use('/offreport',require('./routes/campaignwisereports.routes'))
app.use('/rtbreq',require('./routes/rtbrequest.routes'))
app.use('/bundle',require('./routes/bundlenamereports.routes'))
app.use('/subrepo',require('./routes/subreports.routes'))
app.use('/bundles',require('./routes/bundling.routes'))

if(process.env.NODE_ENV==="production"){
    app.use(express.static('client/build'))
    const path = require('path')
    app.get("*",(req,res)=>{
        res.sendFile(path.resolve(__dirname,'client','build','index.html'))
    })
}

// var d = new Date()
    //     d.setDate(d.getDate()-1);
    //     if(d.getDate() < 10){
    //         var dte = d.getFullYear() + '-' + (d.getMonth()+1) + '-' + '0' + d.getDate()
    //     }else{
    //         var dte = d.getFullYear() + '-' + (d.getMonth()+1) + '-' + d.getDate()
    //     }
    // var yd = new Date(dte)
    // console.log(dte)
app.listen(port, () => console.log(`app listening on port ${port}!`))

// cron.schedule('20 00 * * *', function() {
    //     var d = new Date()
    //     d.setDate(d.getDate()-1);
    //     if(d.getDate() < 10){
    //         var date = d.getFullYear() + '-' + (d.getMonth()+1) + '-' + '0' + d.getDate()
    //     }else{
    //         var date = d.getFullYear() + '-' + (d.getMonth()+1) + '-' + d.getDate()
    //     }
    //     const trackinglogs = mongoose.model('trackinglogs')
    //     var data = [];
    //     trackinglogs.aggregate([
    //         { $match: {
    //             "date":date,
    //             "type":{$in:["impression","complete","click","companionclicktracking","clicktracking"]}
    //         } },
    //         { $group:{
    //             _id: {date:"$date" ,campaignId:"$campaignId" ,appId: "$appId",region :"$region",type:"$type"},count:{$sum:1}
    //         }},{$group:{
    //             _id:{date:"$_id.date" ,campaignId:"$_id.campaignId" ,appId:"$_id.appId",type:"$_id.type"} , region:{$push:"$_id.region"}, count:{$sum:"$count"}
    //         }},{$group:{
    //             _id:{date:"$_id.date" ,campaignId:"$_id.campaignId" ,appId:"$_id.appId"}, type:{$push:{type:"$_id.type",count:"$count"}}, region:{$push:"$region"}
    //         }},{$group:{
    //             _id:{date:"$_id.date" ,campaignId:"$_id.campaignId"}, report:{$push:{appId:"$_id.appId", type:"$type", region:"$region"}}
    //         }},{$project:{
    //             date: "$_id.date",campaignId:"$_id.campaignId", report:"$report", _id:0
    //         }}
    //     ])
    //     .then(result=>{
    //         data = result;
    //         data.map((det)=>{
    //             console.log(det.campaignId)
    //             det.report.map(camrepo=>{
    //                 var resregion = [].concat.apply([], camrepo.region);
    //                 resregion = [...new Set(resregion)];
    //                 camrepo.region = resregion
    //             })
    //         })
    //         var compr = [];
    //         for(var i=0; i<data.length; i++ ){
    //             const Report = mongoose.model('Report')
    //             var cam = data[i].campaignId ;
    //             var da = data[i].date ;
    //             for(var j=0;j<data[i].report.length;j++){
    //                 var impre = 0;
    //                 var compl = 0;
    //                 var click = 0;
    //                 data[i].report[j].type.map(repo => {
    //                     if(repo.type==='impression'){
    //                         impre += repo.count
    //                     }
    //                     if(repo.type==='complete'){
    //                         compl += repo.count
    //                     }
    //                     if(repo.type==='companionclicktracking'){
    //                         click += repo.count
    //                     }
    //                     if(repo.type==='clicktracking'){
    //                         click += repo.count
    //                     }
    //                     if(repo.type==='click'){
    //                         click += repo.count
    //                     }
    //                 })
    //                 const report = new Report({
    //                     date:da,
    //                     Publisher:data[i].report[j].appId,
    //                     campaignId:cam,
    //                     impressions:impre,
    //                     complete:compl,
    //                     clicks:click,
    //                     region:data[i].report[j].region,
    //                     spend:impre,
    //                     avgSpend:impre
    //                 })
    //                 report.save()
    //                 .then(result => {
    //                     compr.push(result)
    //                     console.log("completed")
    //                 })
    //                 .catch(err => console.log(err))
    //             }
    //         }
    //         // res.json(compr)
    //     })
    //     .catch(err => console.log(err))
    // });



cron.schedule('00 02 * * *', function(){
    var d = new Date()
    d.setDate(d.getDate());
    if(d.getDate() < 10){
        if(d.getMonth()+1 > 10){
        var date = d.getFullYear() + '-' + (d.getMonth()+1) + '-' + '0' + d.getDate()}
        else{
        var date = d.getFullYear() + '-' + '0' + (d.getMonth()+1) + '-' + '0' + d.getDate()}
    }else{
        if(d.getMonth()+1 > 10){
        var date = d.getFullYear() + '-' + (d.getMonth()+1) + '-' + d.getDate()}
        else{
        var date = d.getFullYear() + '-' + '0' + (d.getMonth()+1) + '-' + d.getDate()}
    }
    var currentTime = new Date();
    var currentOffset = currentTime.getTimezoneOffset();
    var ISTOffset = 330;   // IST offset UTC +5:30 
    var ISTTime = new Date(currentTime.getTime() + (ISTOffset*2 + currentOffset -5)*60000);
    console.log(ISTTime)
    ReportsRefresher(date,ISTTime)
})

cron.schedule('00 04 * * *', function(){
    var d = new Date()
    d.setDate(d.getDate());
    if(d.getDate() < 10){
        if(d.getMonth()+1 > 10){
        var date = d.getFullYear() + '-' + (d.getMonth()+1) + '-' + '0' + d.getDate()}
        else{
        var date = d.getFullYear() + '-' + '0' + (d.getMonth()+1) + '-' + '0' + d.getDate()}
    }else{
        if(d.getMonth()+1 > 10){
        var date = d.getFullYear() + '-' + (d.getMonth()+1) + '-' + d.getDate()}
        else{
        var date = d.getFullYear() + '-' + '0' + (d.getMonth()+1) + '-' + d.getDate()}
    }
    var currentTime = new Date();
    var currentOffset = currentTime.getTimezoneOffset();
    var ISTOffset = 330;   // IST offset UTC +5:30 
    var ISTTime = new Date(currentTime.getTime() + (ISTOffset*2 + currentOffset -5)*60000);
    console.log(ISTTime)
    ReportsRefresher(date,ISTTime)
})

cron.schedule('00 06 * * *', function(){
    var d = new Date()
    d.setDate(d.getDate());
    if(d.getDate() < 10){
        if(d.getMonth()+1 > 10){
        var date = d.getFullYear() + '-' + (d.getMonth()+1) + '-' + '0' + d.getDate()}
        else{
        var date = d.getFullYear() + '-' + '0' + (d.getMonth()+1) + '-' + '0' + d.getDate()}
    }else{
        if(d.getMonth()+1 > 10){
        var date = d.getFullYear() + '-' + (d.getMonth()+1) + '-' + d.getDate()}
        else{
        var date = d.getFullYear() + '-' + '0' + (d.getMonth()+1) + '-' + d.getDate()}
    }
    var currentTime = new Date();
    var currentOffset = currentTime.getTimezoneOffset();
    var ISTOffset = 330;   // IST offset UTC +5:30 
    var ISTTime = new Date(currentTime.getTime() + (ISTOffset*2 + currentOffset -5)*60000);
    console.log(ISTTime)
    ReportsRefresher(date,ISTTime)
})

cron.schedule('00 08 * * *', function(){
    var d = new Date()
    d.setDate(d.getDate());
    if(d.getDate() < 10){
        if(d.getMonth()+1 > 10){
        var date = d.getFullYear() + '-' + (d.getMonth()+1) + '-' + '0' + d.getDate()}
        else{
        var date = d.getFullYear() + '-' + '0' + (d.getMonth()+1) + '-' + '0' + d.getDate()}
    }else{
        if(d.getMonth()+1 > 10){
        var date = d.getFullYear() + '-' + (d.getMonth()+1) + '-' + d.getDate()}
        else{
        var date = d.getFullYear() + '-' + '0' + (d.getMonth()+1) + '-' + d.getDate()}
    }
    var currentTime = new Date();
    var currentOffset = currentTime.getTimezoneOffset();
    var ISTOffset = 330;   // IST offset UTC +5:30 
    var ISTTime = new Date(currentTime.getTime() + (ISTOffset*2 + currentOffset -5)*60000);
    console.log(ISTTime)
    ReportsRefresher(date,ISTTime)
})

cron.schedule('00 10 * * *', function(){
    var d = new Date()
    d.setDate(d.getDate());
    if(d.getDate() < 10){
        if(d.getMonth()+1 > 10){
        var date = d.getFullYear() + '-' + (d.getMonth()+1) + '-' + '0' + d.getDate()}
        else{
        var date = d.getFullYear() + '-' + '0' + (d.getMonth()+1) + '-' + '0' + d.getDate()}
    }else{
        if(d.getMonth()+1 > 10){
        var date = d.getFullYear() + '-' + (d.getMonth()+1) + '-' + d.getDate()}
        else{
        var date = d.getFullYear() + '-' + '0' + (d.getMonth()+1) + '-' + d.getDate()}
    }
    var currentTime = new Date();
    var currentOffset = currentTime.getTimezoneOffset();
    var ISTOffset = 330;   // IST offset UTC +5:30 
    var ISTTime = new Date(currentTime.getTime() + (ISTOffset*2 + currentOffset -5)*60000);
    console.log(ISTTime)
    ReportsRefresher(date,ISTTime)
})

cron.schedule('00 12 * * *', function(){
    var d = new Date()
    d.setDate(d.getDate());
    if(d.getDate() < 10){
        if(d.getMonth()+1 > 10){
        var date = d.getFullYear() + '-' + (d.getMonth()+1) + '-' + '0' + d.getDate()}
        else{
        var date = d.getFullYear() + '-' + '0' + (d.getMonth()+1) + '-' + '0' + d.getDate()}
    }else{
        if(d.getMonth()+1 > 10){
        var date = d.getFullYear() + '-' + (d.getMonth()+1) + '-' + d.getDate()}
        else{
        var date = d.getFullYear() + '-' + '0' + (d.getMonth()+1) + '-' + d.getDate()}
    }
    var currentTime = new Date();
    var currentOffset = currentTime.getTimezoneOffset();
    var ISTOffset = 330;   // IST offset UTC +5:30 
    var ISTTime = new Date(currentTime.getTime() + (ISTOffset*2 + currentOffset -5)*60000);
    console.log(ISTTime,date)
    ReportsRefresher(date,ISTTime)
})

cron.schedule('00 14 * * *', function(){
    var d = new Date()
    d.setDate(d.getDate());
    if(d.getDate() < 10){
        if(d.getMonth()+1 > 10){
        var date = d.getFullYear() + '-' + (d.getMonth()+1) + '-' + '0' + d.getDate()}
        else{
        var date = d.getFullYear() + '-' + '0' + (d.getMonth()+1) + '-' + '0' + d.getDate()}
    }else{
        if(d.getMonth()+1 > 10){
        var date = d.getFullYear() + '-' + (d.getMonth()+1) + '-' + d.getDate()}
        else{
        var date = d.getFullYear() + '-' + '0' + (d.getMonth()+1) + '-' + d.getDate()}
    }
    var currentTime = new Date();
    var currentOffset = currentTime.getTimezoneOffset();
    var ISTOffset = 330;   // IST offset UTC +5:30 
    var ISTTime = new Date(currentTime.getTime() + (ISTOffset*2 + currentOffset -5)*60000);
    console.log(ISTTime)
    ReportsRefresher(date,ISTTime)
})

cron.schedule('00 16 * * *', function(){
    var d = new Date()
    d.setDate(d.getDate());
    if(d.getDate() < 10){
        if(d.getMonth()+1 > 10){
        var date = d.getFullYear() + '-' + (d.getMonth()+1) + '-' + '0' + d.getDate()}
        else{
        var date = d.getFullYear() + '-' + '0' + (d.getMonth()+1) + '-' + '0' + d.getDate()}
    }else{
        if(d.getMonth()+1 > 10){
        var date = d.getFullYear() + '-' + (d.getMonth()+1) + '-' + d.getDate()}
        else{
        var date = d.getFullYear() + '-' + '0' + (d.getMonth()+1) + '-' + d.getDate()}
    }
    var currentTime = new Date();
    var currentOffset = currentTime.getTimezoneOffset();
    var ISTOffset = 330;   // IST offset UTC +5:30 
    var ISTTime = new Date(currentTime.getTime() + (ISTOffset*2 + currentOffset -5)*60000);
    console.log(ISTTime)
    ReportsRefresher(date,ISTTime)
})

cron.schedule('00 18 * * *', function(){
    var d = new Date()
    d.setDate(d.getDate());
    if(d.getDate() < 10){
        if(d.getMonth()+1 > 10){
        var date = d.getFullYear() + '-' + (d.getMonth()+1) + '-' + '0' + d.getDate()}
        else{
        var date = d.getFullYear() + '-' + '0' + (d.getMonth()+1) + '-' + '0' + d.getDate()}
    }else{
        if(d.getMonth()+1 > 10){
        var date = d.getFullYear() + '-' + (d.getMonth()+1) + '-' + d.getDate()}
        else{
        var date = d.getFullYear() + '-' + '0' + (d.getMonth()+1) + '-' + d.getDate()}
    }
    var currentTime = new Date();
    var currentOffset = currentTime.getTimezoneOffset();
    var ISTOffset = 330;   // IST offset UTC +5:30 
    var ISTTime = new Date(currentTime.getTime() + (ISTOffset*2 + currentOffset -5)*60000);
    console.log(ISTTime)
    ReportsRefresher(date,ISTTime)
})

cron.schedule('00 20 * * *', function(){
    var d = new Date()
    d.setDate(d.getDate());
    if(d.getDate() < 10){
        if(d.getMonth()+1 > 10){
        var date = d.getFullYear() + '-' + (d.getMonth()+1) + '-' + '0' + d.getDate()}
        else{
        var date = d.getFullYear() + '-' + '0' + (d.getMonth()+1) + '-' + '0' + d.getDate()}
    }else{
        if(d.getMonth()+1 > 10){
        var date = d.getFullYear() + '-' + (d.getMonth()+1) + '-' + d.getDate()}
        else{
        var date = d.getFullYear() + '-' + '0' + (d.getMonth()+1) + '-' + d.getDate()}
    }
    var currentTime = new Date();
    var currentOffset = currentTime.getTimezoneOffset();
    var ISTOffset = 330;   // IST offset UTC +5:30 
    var ISTTime = new Date(currentTime.getTime() + (ISTOffset*2 + currentOffset -5)*60000);
    console.log(ISTTime)
    ReportsRefresher(date,ISTTime)
})

cron.schedule('00 22 * * *', function(){
    var d = new Date()
    d.setDate(d.getDate());
    if(d.getDate() < 10){
        if(d.getMonth()+1 > 10){
        var date = d.getFullYear() + '-' + (d.getMonth()+1) + '-' + '0' + d.getDate()}
        else{
        var date = d.getFullYear() + '-' + '0' + (d.getMonth()+1) + '-' + '0' + d.getDate()}
    }else{
        if(d.getMonth()+1 > 10){
        var date = d.getFullYear() + '-' + (d.getMonth()+1) + '-' + d.getDate()}
        else{
        var date = d.getFullYear() + '-' + '0' + (d.getMonth()+1) + '-' + d.getDate()}
    }
    var currentTime = new Date();
    var currentOffset = currentTime.getTimezoneOffset();
    var ISTOffset = 330;   // IST offset UTC +5:30 
    var ISTTime = new Date(currentTime.getTime() + (ISTOffset*2 + currentOffset -5)*60000);
    console.log(ISTTime)
    ReportsRefresher(date,ISTTime)
})

cron.schedule('10 00 * * *', function(){
    var d = new Date()
    d.setDate(d.getDate()-1);
    if(d.getDate() < 10){
        var date = d.getFullYear() + '-' + (d.getMonth()+1) + '-' + '0' + d.getDate()
    }else{
        var date = d.getFullYear() + '-' + (d.getMonth()+1) + '-' + d.getDate()
    }
    var currentTime = new Date();
    var currentOffset = currentTime.getTimezoneOffset();
    var ISTOffset = 330;   // IST offset UTC +5:30 
    var ISTTime = new Date(currentTime.getTime() + (ISTOffset*2 + currentOffset)*60000);
    console.log(ISTTime)
    ReportsRefresher(date,ISTTime)
    uniqueMaker(date)
})

async function uniqueMaker({date}){
    let uniqueids = await trackinglogs.distinct( "campaignId",{"date":date,"type":"impression"}).catch(err => console.log(err))
    uniqueids = uniqueids.map(id => mongoose.Types.ObjectId(id))
    let response = await StreamingAds.aggregate([
        {$match:{_id:{$in:uniqueids}}},
        {$project:{AdTitle:{$toLower:"$AdTitle"}}},
        {$project:{AdTitle:{$split:["$AdTitle","_"]}}},
        {$project:{AdTitle:{$slice:["$AdTitle",2]}}},
        {$project:{AdTitle:{
                '$reduce': {
                    'input': '$AdTitle',
                    'initialValue': '',
                    'in': {
                        '$concat': [
                            '$$value',
                            {'$cond': [{'$eq': ['$$value', '']}, '', '_']}, 
                            '$$this']
                    }
                }
        },_id:0}},
        {$group:{_id:"$AdTitle"}}
    ]).catch(err => console.log(err))
    var ree = [];
    response = await response.map(async (da) => {
        let doudt = await StreamingAds.aggregate([
            {$project:{_id:"$_id", AdTitle:{$toLower:"$AdTitle"}}},
            {$match:{AdTitle:{$regex:da._id}}},
            {$group:{_id:null,ids:{$push:"$_id"}}},
        ]).catch(err => console.log(err))
        var title = da._id;
        doudt = doudt[0].ids
        doudt = doudt.map(id => mongoose.Types.ObjectId(id))
        let splited = await adsetting.find({campaignId:{$in:doudt}}).catch(err => console.log(err))
        var audio = [];
        var display = [];
        splited = await splited.map(ids=>{
            if(ids.type==='display')
                display.push(ids.campaignId)
            else{
                audio.push(ids.campaignId)
            }
        })
        // console.log(audio)
        audio = audio && audio.map(id => id.toString())
        let audioUnique = await trackinglogs.db.db.command({
            aggregate: "trackinglogs",
            pipeline:[
                {$match:{ "type":"impression","campaignId":{$in:audio}}},
                {$group:{_id:"$ifa", total:{$sum:1},}},
                {$count: "count"}
            ],
            allowDiskUse: true,
            cursor: {  }
        }).catch(err => console.log(err))
        audioUnique = audioUnique.cursor.firstBatch && audioUnique.cursor.firstBatch[0]
        console.log(audioUnique)
        display = display && display.map(id => id.toString())
        let displayUnique = await trackinglogs.db.db.command({
            aggregate: "trackinglogs",
            pipeline:[
                {$match:{ "type":"impression","campaignId":{$in:display}}},
                {$group:{_id:"$ifa", total:{$sum:1},}},
                {$count: "count"}
            ],
            allowDiskUse: true,
            cursor: {  }
        }).catch(err => console.log(err))
        displayUnique = displayUnique.cursor.firstBatch && displayUnique.cursor.firstBatch[0]
        audioCount = audioUnique && audioUnique.count
        displayCount = displayUnique && displayUnique.count
        console.log(displayUnique)
        const uniquedata = new Unique({
            audiouser:audioCount ? audioCount :0,
            displayuser:displayCount ? displayCount :0,
            AdTitle:title
        })
        let dala = await Unique.deleteMany({AdTitle:title}).catch(err => console.log(err))
        console.log(dala)
        uniquedata.save()
        .then(resu =>{
            return console.log('completeunique',dala)
        })
        .catch(err =>{
            console.log(audioCount,displayCount,title,uniquedata)
            return console.log(err,dala)
        })
    })
}

async function ReportsRefresher(date,credate){
    // var d = new Date()
    // d.setDate(d.getDate());
    // if(d.getDate() < 10){
    //     var date = d.getFullYear() + '-' + (d.getMonth()+1) + '-' + '0' + d.getDate()
    // }else{
    //     var date = d.getFullYear() + '-' + (d.getMonth()+1) + '-' + d.getDate()
    // }
    const Report = mongoose.model('Report')
    Report.deleteMany({date:date})
    .then(repon=>{
        console.log({relt:repon,mess:"deleted"})
    })
    console.log(date,credate)
    const trackinglogs = mongoose.model('trackinglogs')
    try  {
        let logids = await trackinglogs.aggregate([
            {$match:{"date":date}},
            {$group:{_id:null,ids:{$addToSet:"$campaignId"}}},
            {$project:{_id:0,ids:1}}
        ]).catch(err => console.log(err))
        logids = logids[0].ids
        let uniqueuserslist = await trackinglogs.db.db.command({
            aggregate:"trackinglogs",
            pipeline:[
                {$facet:{
                    "uniquesumdatawise":[
                        {$match:{"campaignId":{$in:logids},"type":{$in:["impression"]}}},
                        {$group:{_id:{campaignId:"$campaignId",appId:"$appId"},ifa:{$addToSet:"$ifa"}}},
                        {$group:{_id:"$_id.campaignId",unique:{$addToSet:"$ifa"},publishdata:{$push:{appId:"$_id.appId",uniqueuser:{$size:"$ifa"}}}}},
                        {$addFields:{unique:{"$reduce": {
                            "input": "$unique",
                            "initialValue": [],
                            "in": { "$concatArrays": [ "$$value", "$$this" ] }
                        }}}},
                        {$project:{_id:0,campaignId:"$_id",unique:{$size:"$unique"},publishdata:1}},
                    ],
                    "regionwiseunique":[
                        {$match:{"campaignId":{$in:logids},"type":{$in:["impression"]}}},
                        {$group:{_id:{campaignId:"$campaignId",appId:"$appId",region:"$region"},ifa:{$addToSet:"$ifa"}}},
                        {$group:{_id:{campaignId:"$_id.campaignId",appId:"$_id.appId"}, uniquerepo:{$push:{region:"$_id.region",unique:{$size:"$ifa"}}}}},
                        {$group:{_id:"$_id.campaignId",results:{$push:{appId:"$_id.appId",result:"$uniquerepo"}}}},
                        {$project:{_id:0,campaignId:"$_id",results:1}}
                    ],
                    "pinwiseunique":[
                        {$match:{"campaignId":{$in:logids},"type":{$in:["impression"]}}},
                        {$group:{_id:{campaignId:"$campaignId",appId:"$appId",zip:"$zip"},ifa:{$addToSet:"$ifa"}}},
                        {$group:{_id:{campaignId:"$_id.campaignId",appId:"$_id.appId"}, uniquerepo:{$push:{zip:"$_id.zip",unique:{$size:"$ifa"}}}}},
                        {$group:{_id:"$_id.campaignId",results:{$push:{appId:"$_id.appId",result:"$uniquerepo"}}}},
                        {$project:{_id:0,campaignId:"$_id",results:1}}
                    ],
                    "lanwiseunique":[
                        {$match:{"campaignId":{$in:logids},"type":{$in:["impression"]}}},
                        {$group:{_id:{campaignId:"$campaignId",appId:"$appId",language:"$language"},ifa:{$addToSet:"$ifa"}}},
                        {$group:{_id:{campaignId:"$_id.campaignId",appId:"$_id.appId"}, uniquerepo:{$push:{language:"$_id.language",unique:{$size:"$ifa"}}}}},
                        {$group:{_id:"$_id.campaignId",results:{$push:{appId:"$_id.appId",result:"$uniquerepo"}}}},
                        {$project:{_id:0,campaignId:"$_id",results:1}}
                    ]
                }}
            ],
            allowDiskUse:true,
            cursor:{}
        })
        uniqueuserslist = uniqueuserslist.cursor.firstBatch
        let wholetypelist = await trackinglogs.db.db.command({
            aggregate: "trackinglogs",
            pipeline:[
                {$facet:{
                    "appIds":[
                        {$match:{"date":date}},
                        {$group:{_id:{campaignId:"$campaignId",date:"$date",appId:"$appId"}}},
                        {$group:{_id:{campaignId:"$_id.campaignId",date:"$_id.date"},ids:{$push:"$_id.appId"}}},
                        {$project:{_id:0,campaignId:"$_id.campaignId",date:"$_id.date",ids:"$ids"}}
                    ],
                    "typeValues":[
                        {$match:{"date":date}},
                        {$group:{_id:{campaignId:"$campaignId",type:"$type",appId:"$appId"}, count:{$sum:1}}},
                        {$group:{_id:{appId:"$_id.appId",campaignId:"$_id.campaignId"}, result:{$push:{k:"$_id.type",v:"$count"}}}},
                        {$group:{_id:"$_id.campaignId",report:{$push:{appId:"$_id.appId",result:{$arrayToObject:"$result"}}}}},
                        {$project:{campaignId:"$_id", report:"$report", _id:0}}
                    ],"typebyRegion":[
                        {$match:{"date":date}},
                        {$group:{_id:{campaignId:"$campaignId",type:"$type",appId:"$appId",region:"$region"}, count:{$sum:1}}},
                        {$group:{_id:{appId:"$_id.appId",campaignId:"$_id.campaignId",region:"$_id.region"}, result:{$push:{k:"$_id.type",v:"$count"}}}},
                        {$group:{_id:{appId:"$_id.appId",campaignId:"$_id.campaignId"}, result:{$push:{region:"$_id.region",result:{$arrayToObject:"$result"}}}}},
                        {$group:{_id:"$_id.campaignId",report:{$push:{appId:"$_id.appId",result:"$result"}}}},
                        {$project:{_id:0,campaignId:"$_id",report:"$report"}}
                    ],"typeByLan":[
                        {$match:{"date":date}},
                        {$group:{_id:{campaignId:"$campaignId",type:"$type",appId:"$appId",language:"$language"}, count:{$sum:1}}},
                        {$group:{_id:{campaignId:"$_id.campaignId",appId:"$_id.appId",language:"$_id.language"}, result:{$push:{k:"$_id.type",v:"$count"}}}},
                        {$group:{_id:{appId:"$_id.appId",campaignId:"$_id.campaignId"}, result:{$push:{language:"$_id.language",result:{$arrayToObject:"$result"}}}}},
                        {$group:{_id:"$_id.campaignId",report:{$push:{appId:"$_id.appId",result:"$result"}}}},
                        {$project:{_id:0,campaignId:"$_id",report:"$report"}}
                    ],"typeByPhModel":[
                        {$match:{"date":date}},
                        {$group:{_id:{campaignId:"$campaignId",type:"$type",appId:"$appId",phoneMake:"$phoneMake",phoneModel:"$phoneModel"}, count:{$sum:1}}},
                        {$group:{_id:{campaignId:"$_id.campaignId",appId:"$_id.appId",phoneMake:"$_id.phoneMake",phoneModel:"$_id.phoneModel"}, result:{$push:{k:"$_id.type",v:"$count"}}}},
                        {$group:{_id:{appId:"$_id.appId",campaignId:"$_id.campaignId"}, result:{$push:{phoneModel:{$concat: [ "$_id.phoneMake", " - ", "$_id.phoneModel" ]},result:{$arrayToObject:"$result"}}}}},
                        {$group:{_id:"$_id.campaignId",report:{$push:{appId:"$_id.appId",result:"$result"}}}},
                        {$project:{_id:0,campaignId:"$_id",report:"$report"}}
                    ],"typeByPT":[
                        {$match:{"date":date}},
                        {$group:{_id:{campaignId:"$campaignId",type:"$type",appId:"$appId",platformType:"$platformType",osVersion:"$osVersion"}, count:{$sum:1}}},
                        {$group:{_id:{campaignId:"$_id.campaignId",appId:"$_id.appId",platformType:"$_id.platformType",osVersion:"$_id.osVersion"}, result:{$push:{k:"$_id.type",v:"$count"}}}},
                        {$group:{_id:{appId:"$_id.appId",campaignId:"$_id.campaignId"}, result:{$push:{platformType:{$concat: [ "$_id.platformType", " - ", "$_id.osVersion" ]},result:{$arrayToObject:"$result"}}}}},
                        {$group:{_id:"$_id.campaignId",report:{$push:{appId:"$_id.appId",result:"$result"}}}},
                        {$project:{_id:0,campaignId:"$_id",report:"$report"}}
                    ],"typeByPlatform":[
                        {$match:{"date":date}},
                        {$group:{_id:{campaignId:"$campaignId",type:"$type",appId:"$appId",platformType:"$platformType"}, count:{$sum:1}}},
                        {$group:{_id:{campaignId:"$_id.campaignId",appId:"$_id.appId",platformType:"$_id.platformType"}, result:{$push:{k:"$_id.type",v:"$count"}}}},
                        {$group:{_id:{appId:"$_id.appId",campaignId:"$_id.campaignId"}, result:{$push:{platformType:"$_id.platformType",result:{$arrayToObject:"$result"}}}}},
                        {$group:{_id:"$_id.campaignId",report:{$push:{appId:"$_id.appId",result:"$result"}}}},
                        {$project:{_id:0,campaignId:"$_id",report:"$report"}}
                    ],"typeByPin":[
                        {$match:{"date":date}},
                        {$group:{_id:{campaignId:"$campaignId",type:"$type",appId:"$appId",zip:"$zip"}, count:{$sum:1}}},
                        {$group:{_id:{campaignId:"$_id.campaignId",appId:"$_id.appId",zip:"$_id.zip"}, result:{$push:{k:"$_id.type",v:"$count"}}}},
                        {$group:{_id:{appId:"$_id.appId",campaignId:"$_id.campaignId"}, result:{$push:{zip:"$_id.zip",result:{$arrayToObject:"$result"}}}}},
                        {$group:{_id:"$_id.campaignId",report:{$push:{appId:"$_id.appId",result:"$result"}}}},
                        {$project:{_id:0,campaignId:"$_id",report:"$report"}}
                    ],"typeByDev":[
                        {$match:{"date":date}},
                        {$group:{_id:{campaignId:"$campaignId",type:"$type",appId:"$appId",pptype:"$pptype"}, count:{$sum:1}}},
                        {$group:{_id:{campaignId:"$_id.campaignId",appId:"$_id.appId",pptype:"$_id.pptype"}, result:{$push:{k:"$_id.type",v:"$count"}}}},
                        {$group:{_id:{appId:"$_id.appId",campaignId:"$_id.campaignId"}, result:{$push:{pptype:"$_id.pptype",result:{$arrayToObject:"$result"}}}}},
                        {$group:{_id:"$_id.campaignId",report:{$push:{appId:"$_id.appId",result:"$result"}}}},
                        {$project:{_id:0,campaignId:"$_id",report:"$report"}}
                    ]
                }}
            ],
            allowDiskUse: true,
            cursor: {  }
        }).catch(err => console.log(err))
        wholetypelist = wholetypelist.cursor.firstBatch
        wholetypelist[0].appIds.map(caompoids=>{
            var campId = caompoids.campaignId;
            var repodate = caompoids.date;
            var uniquedatareq = uniqueuserslist[0]
            var uniquedataofcamp = uniquedatareq.uniquesumdatawise.filter(x => x.campaignId === campId);
            var uniquecountofcamp = 0;
            uniquedataofcamp.map(dd=>{
                uniquecountofcamp = dd.unique
            })
            var uniqueregiondatacamp = uniquedatareq.regionwiseunique.filter(x => x.campaignId === campId);
            var uniquepindatacamp = uniquedatareq.pinwiseunique.filter(x => x.campaignId === campId);
            var uniquelangdatacamp = uniquedatareq.lanwiseunique.filter(x => x.campaignId === campId);
            var resdatareq = wholetypelist[0]
            var impredatacamp = resdatareq.typeValues.filter(x => x.campaignId === campId);
            var regiondatacamp = resdatareq.typebyRegion.filter(x => x.campaignId === campId);
            var languagedatacamp = resdatareq.typeByLan.filter(x => x.campaignId === campId);
            var pindatacamp = resdatareq.typeByPin.filter(x => x.campaignId === campId);
            var devicedatacamp = resdatareq.typeByDev.filter(x => x.campaignId === campId);
            var phmodatacamp = resdatareq.typeByPhModel.filter(x => x.campaignId === campId);
            var plattypedatacamp = resdatareq.typeByPT.filter(x => x.campaignId === campId);
            var platformdatacamp = resdatareq.typeByPlatform.filter(x => x.campaignId === campId);
            // console.log(pindatacamp[0])
            caompoids.ids.map(app_id=>{
                var appIdreq = app_id;
                var appuniquedata = uniquedataofcamp[0]
                var appuniquecount = 0;
                uniquedataofcamp.map(dd=>{
                    appuniquedata = dd.publishdata.filter(x => x.appId === appIdreq)
                    appuniquecount = appuniquedata[0].uniqueuser
                })
                var uniqueregiondataapp = [];
                uniqueregiondatacamp.map(dd => {
                    uniqueregiondataapp = dd.results.filter(x => x.appId === appIdreq)
                    uniqueregiondataapp = uniqueregiondataapp[0].result
                })
                var uniquepindataapp = [];
                uniquepindatacamp.map(dd => {
                    uniquepindataapp = dd.results.filter(x => x.appId === appIdreq)
                    uniquepindataapp = uniquepindataapp[0].result
                })
                // console.log(typeof uniquepindataapp)
                var uniquelangdataapp =[];
                uniquelangdatacamp.map(dd => {
                    uniquelangdataapp = dd.results.filter(x => x.appId === appIdreq)
                    uniquelangdataapp = uniquelangdataapp[0].result
                })
                // console.log(uniquelangdataapp)
                var impressionsapp;
                var completeapp;
                var clickapp;
                var firstqapp;
                var thirdqapp;
                var midpointapp;
                var appimpredata = [];
                impredatacamp.map(dd => {
                    appimpredata = dd.report.filter(x => x.appId ===appIdreq)
                    appimpredata = appimpredata[0].result;
                    impressionsapp = appimpredata.impression ? appimpredata.impression :0 
                    completeapp = appimpredata.complete ? appimpredata.complete :0 
                    clickapp = appimpredata.click ? appimpredata.click :0 + 
                            appimpredata.companionclicktracking ? appimpredata.companionclicktracking :0 +
                            appimpredata.clicktracking ? appimpredata.clicktracking :0 ;
                    firstqapp = appimpredata.firstquartile ? appimpredata.firstquartile :0 
                    thirdqapp = appimpredata.thirdquartile ? appimpredata.thirdquartile :0 
                    midpointapp = appimpredata.midpoint ? appimpredata.midpoint :0 
                })
                var regiondataapp = [];
                regiondatacamp.map(dd =>{
                    regiondataapp = dd.report.filter(x => x.appId === appIdreq)
                    regiondataapp = regiondataapp[0].result
                    regiondataapp = regiondataapp.map(ad =>{
                        var regionlocal = uniqueregiondataapp.filter(x => x.region === ad.region)
                        regionlocal.map(mad => {
                            ad.unique = mad.unique
                        })
                        return ad;
                    })
                    // console.log(regiondataapp)
                })
                var pindataapp =[];
                pindatacamp.map(dd =>{
                    pindataapp = dd.report.filter(x => x.appId === appIdreq)
                    pindataapp = pindataapp[0].result
                    pindataapp = pindataapp.map(ad =>{
                        var pinlocal = uniquepindataapp.filter(x => x.zip === ad.zip)
                        // console.log(JSON.stringify(pinlocal[0]))
                        pinlocal.map(mad => {
                            ad.unique = mad.unique
                        })
                        return ad;
                    })
                    // console.log(pindataapp)
                })
                var langdataapp =[];
                languagedatacamp.map(dd =>{
                    langdataapp = dd.report.filter(x => x.appId === appIdreq)
                    langdataapp = langdataapp[0].result
                    langdataapp = langdataapp.map(ad =>{
                        var langlocal = uniquelangdataapp.filter(x => x.zip === ad.zip)
                        // console.log(JSON.stringify(langlocal[0]))
                        langlocal.map(mad => {
                            ad.unique = mad.unique
                        })
                        return ad;
                    })
                    // console.log(langdataapp)
                })
                var devicedataapp =[];
                devicedatacamp.map(dd =>{
                    devicedataapp = dd.report.filter(x => x.appId === appIdreq)
                    devicedataapp = devicedataapp[0].result
                    // console.log(devicedataapp)
                })
                var phmodataapp =[];
                phmodatacamp.map(dd =>{
                    phmodataapp = dd.report.filter(x => x.appId === appIdreq)
                    phmodataapp = phmodataapp[0].result
                    // console.log(phmodataapp)
                })
                var plattypedataapp =[];
                plattypedatacamp.map(dd =>{
                    plattypedataapp = dd.report.filter(x => x.appId === appIdreq)
                    plattypedataapp = plattypedataapp[0].result
                    // console.log(plattypedataapp)
                })
                var platformbasedataapp =[];
                platformdatacamp.map(dd =>{
                    platformbasedataapp = dd.report.filter(x => x.appId === appIdreq)
                    platformbasedataapp = platformbasedataapp[0].result
                    // console.log(platformbasedataapp)
                })
                const Report = mongoose.model('Report')
                const report = new Report({
                    date:repodate,
                    Publisher:appIdreq,
                    campaignId:campId,
                    impressions:impressionsapp,
                    firstQuartile:firstqapp,
                    midpoint:midpointapp,
                    thirdQuartile:thirdqapp,
                    complete:completeapp,
                    clicks:clickapp,
                    publishunique:appuniquecount,
                    campunique:uniquecountofcamp,
                    region:regiondataapp,
                    platformtype:plattypedataapp,
                    language:langdataapp,
                    pincode:pindataapp,
                    phoneModel:phmodataapp,
                    phonePlatform:platformbasedataapp,
                    deviceModel:devicedataapp
                })
                report.save()
                .then(ree=>console.log('complete'))
                .catch(err => console.log(err))
            })
        })
    }catch(e){
        console.log(e)
    }
    // res.json(compr)
}