// const fetch = require('node-fetch')
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
    socketTimeoutMS: 900000
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
        var date = d.getFullYear() + '-' + (d.getMonth()+1) + '-' + '0' + d.getDate()
    }else{
        var date = d.getFullYear() + '-' + (d.getMonth()+1) + '-' + d.getDate()
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
        var date = d.getFullYear() + '-' + (d.getMonth()+1) + '-' + '0' + d.getDate()
    }else{
        var date = d.getFullYear() + '-' + (d.getMonth()+1) + '-' + d.getDate()
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
        var date = d.getFullYear() + '-' + (d.getMonth()+1) + '-' + '0' + d.getDate()
    }else{
        var date = d.getFullYear() + '-' + (d.getMonth()+1) + '-' + d.getDate()
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
        var date = d.getFullYear() + '-' + (d.getMonth()+1) + '-' + '0' + d.getDate()
    }else{
        var date = d.getFullYear() + '-' + (d.getMonth()+1) + '-' + d.getDate()
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
        var date = d.getFullYear() + '-' + (d.getMonth()+1) + '-' + '0' + d.getDate()
    }else{
        var date = d.getFullYear() + '-' + (d.getMonth()+1) + '-' + d.getDate()
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
        var date = d.getFullYear() + '-' + (d.getMonth()+1) + '-' + '0' + d.getDate()
    }else{
        var date = d.getFullYear() + '-' + (d.getMonth()+1) + '-' + d.getDate()
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
        var date = d.getFullYear() + '-' + (d.getMonth()+1) + '-' + '0' + d.getDate()
    }else{
        var date = d.getFullYear() + '-' + (d.getMonth()+1) + '-' + d.getDate()
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
        var date = d.getFullYear() + '-' + (d.getMonth()+1) + '-' + '0' + d.getDate()
    }else{
        var date = d.getFullYear() + '-' + (d.getMonth()+1) + '-' + d.getDate()
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
        var date = d.getFullYear() + '-' + (d.getMonth()+1) + '-' + '0' + d.getDate()
    }else{
        var date = d.getFullYear() + '-' + (d.getMonth()+1) + '-' + d.getDate()
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
        var date = d.getFullYear() + '-' + (d.getMonth()+1) + '-' + '0' + d.getDate()
    }else{
        var date = d.getFullYear() + '-' + (d.getMonth()+1) + '-' + d.getDate()
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
        var date = d.getFullYear() + '-' + (d.getMonth()+1) + '-' + '0' + d.getDate()
    }else{
        var date = d.getFullYear() + '-' + (d.getMonth()+1) + '-' + d.getDate()
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
})

function ReportsRefresher(date,credate){
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
        var data = [];
        trackinglogs.db.db.command({
            aggregate: "trackinglogs",
            pipeline:[
            { $match: {
                "date":date
            } },
            {$facet:{
                "appIds":[
                    {$group:{_id:{campaignId:"$campaignId",date:"$date",appId:"$appId"}}},
                    {$group:{_id:{campaignId:"$_id.campaignId",date:"$_id.date"},ids:{$push:"$_id.appId"}}},
                    {$project:{_id:0,campaignId:"$_id.campaignId",date:"$_id.date",ids:"$ids"}}
                ],
                "typeValues":[
                    {$group:{_id:{campaignId:"$campaignId",rtbType:"$rtbType",type:"$type",appId:"$appId"}, count:{$sum:1}}},
                    {$group:{_id:{appId:"$_id.appId",campaignId:"$_id.campaignId",rtbType:"$_id.rtbType"}, result:{$push:{k:"$_id.type",v:"$count"}}}},
                    {$group:{_id:"$_id.campaignId",report:{$push:{appId:"$_id.appId",rtbType:"$_id.rtbType",result:{$arrayToObject:"$result"}}}}},
                    {$project:{campaignId:"$_id", report:"$report", _id:0}}
                ],"typebyRegion":[
                    {$group:{_id:{campaignId:"$campaignId",type:"$type",appId:"$appId",rtbType:"$rtbType",region:"$region"}, ifa:{$push:"$ifa"}, count:{$sum:1}}},
                    {$group:{_id:{appId:"$_id.appId",campaignId:"$_id.campaignId",rtbType:"$_id.rtbType",region:"$_id.region"},unique:{$addToSet:"$ifa"}, result:{$push:{k:"$_id.type",v:"$count"}}}},
                    {$addFields:{unique:{"$reduce": {
                                "input": "$unique",
                                "initialValue": [],
                                "in": { "$concatArrays": [ "$$value", "$$this" ] }
                    }}}},
                    {$group:{_id:{appId:"$_id.appId",campaignId:"$_id.campaignId",rtbType:"$_id.rtbType"}, result:{$push:{region:"$_id.region",unique:{$size:"$unique"},result:{$arrayToObject:"$result"}}}}},
                    {$group:{_id:"$_id.campaignId",report:{$push:{appId:"$_id.appId",rtbType:"$_id.rtbType",result:"$result"}}}},
                    {$project:{_id:0,campaignId:"$_id",report:"$report"}}
                ],"typeByLan":[
                    {$group:{_id:{campaignId:"$campaignId",type:"$type",appId:"$appId",rtbType:"$rtbType",language:"$language"}, ifa:{$push:"$ifa"}, count:{$sum:1}}},
                    {$group:{_id:{campaignId:"$_id.campaignId",appId:"$_id.appId",rtbType:"$_id.rtbType",language:"$_id.language"},unique:{$addToSet:"$ifa"}, result:{$push:{k:"$_id.type",v:"$count"}}}},
                    {$addFields:{unique:{"$reduce": {
                                "input": "$unique",
                                "initialValue": [],
                                "in": { "$concatArrays": [ "$$value", "$$this" ] }
                    }}}},
                    {$group:{_id:{appId:"$_id.appId",campaignId:"$_id.campaignId",rtbType:"$_id.rtbType"}, result:{$push:{language:"$_id.language",unique:{$size:"$unique"},result:{$arrayToObject:"$result"}}}}},
                    {$group:{_id:"$_id.campaignId",report:{$push:{appId:"$_id.appId",rtbType:"$_id.rtbType",result:"$result"}}}},
                    {$project:{_id:0,campaignId:"$_id",report:"$report"}}
                ],"typeByPhModel":[
                    {$group:{_id:{campaignId:"$campaignId",type:"$type",appId:"$appId",rtbType:"$rtbType",phoneMake:"$phoneMake",phoneModel:"$phoneModel"}, count:{$sum:1}}},
                    {$group:{_id:{campaignId:"$_id.campaignId",appId:"$_id.appId",rtbType:"$_id.rtbType",phoneMake:"$_id.phoneMake",phoneModel:"$_id.phoneModel"}, result:{$push:{k:"$_id.type",v:"$count"}}}},
                    {$group:{_id:{appId:"$_id.appId",campaignId:"$_id.campaignId",rtbType:"$_id.rtbType"}, result:{$push:{phoneModel:{$concat: [ "$_id.phoneMake", " - ", "$_id.phoneModel" ]},result:{$arrayToObject:"$result"}}}}},
                    {$group:{_id:"$_id.campaignId",report:{$push:{appId:"$_id.appId",rtbType:"$_id.rtbType",result:"$result"}}}},
                    {$project:{_id:0,campaignId:"$_id",report:"$report"}}
                ],"typeByPT":[
                    {$group:{_id:{campaignId:"$campaignId",type:"$type",appId:"$appId",rtbType:"$rtbType",platformType:"$platformType",osVersion:"$osVersion"}, count:{$sum:1}}},
                    {$group:{_id:{campaignId:"$_id.campaignId",appId:"$_id.appId",rtbType:"$_id.rtbType",platformType:"$_id.platformType",osVersion:"$_id.osVersion"}, result:{$push:{k:"$_id.type",v:"$count"}}}},
                    {$group:{_id:{appId:"$_id.appId",campaignId:"$_id.campaignId",rtbType:"$_id.rtbType"}, result:{$push:{platformType:{$concat: [ "$_id.platformType", " - ", "$_id.osVersion" ]},result:{$arrayToObject:"$result"}}}}},
                    {$group:{_id:"$_id.campaignId",report:{$push:{appId:"$_id.appId",rtbType:"$_id.rtbType",result:"$result"}}}},
                    {$project:{_id:0,campaignId:"$_id",report:"$report"}}
                ],"typeByPin":[
                    {$group:{_id:{campaignId:"$campaignId",type:"$type",appId:"$appId",rtbType:"$rtbType",zip:"$zip"}, ifa:{$push:"$ifa"}, count:{$sum:1}}},
                    {$group:{_id:{campaignId:"$_id.campaignId",appId:"$_id.appId",rtbType:"$_id.rtbType",zip:"$_id.zip"},unique:{$addToSet:"$ifa"}, result:{$push:{k:"$_id.type",v:"$count"}}}},
                    {$addFields:{unique:{"$reduce": {
                                "input": "$unique",
                                "initialValue": [],
                                "in": { "$concatArrays": [ "$$value", "$$this" ] }
                    }}}},
                    {$group:{_id:{appId:"$_id.appId",campaignId:"$_id.campaignId",rtbType:"$_id.rtbType"}, result:{$push:{zip:"$_id.zip",unique:{$size:"$unique"},result:{$arrayToObject:"$result"}}}}},
                    {$group:{_id:"$_id.campaignId",report:{$push:{appId:"$_id.appId",rtbType:"$_id.rtbType",result:"$result"}}}},
                    {$project:{_id:0,campaignId:"$_id",report:"$report"}}
                ],"typeByDev":[
                    {$group:{_id:{campaignId:"$campaignId",type:"$type",appId:"$appId",rtbType:"$rtbType",pptype:"$pptype"}, count:{$sum:1}}},
                    {$group:{_id:{campaignId:"$_id.campaignId",appId:"$_id.appId",rtbType:"$_id.rtbType",pptype:"$_id.pptype"}, result:{$push:{k:"$_id.type",v:"$count"}}}},
                    {$group:{_id:{appId:"$_id.appId",campaignId:"$_id.campaignId",rtbType:"$_id.rtbType"}, result:{$push:{pptype:"$_id.pptype",result:{$arrayToObject:"$result"}}}}},
                    {$group:{_id:"$_id.campaignId",report:{$push:{appId:"$_id.appId",rtbType:"$_id.rtbType",result:"$result"}}}},
                    {$project:{_id:0,campaignId:"$_id",report:"$report"}}
                ]
            }}
        ],
        allowDiskUse: true,
        cursor: {  }
        })
        .then(result=>{
            var resultdata = result.cursor.firstBatch;
            resultdata[0].appIds.map(caim => {
            var camId = caim.campaignId
            var datereq = caim.date
            var reportsdata = resultdata[0].typeValues.filter(x => x.campaignId === camId)
            var reportsdataReg = resultdata[0].typebyRegion.filter(x => x.campaignId === camId)
            var reportsdataLan = resultdata[0].typeByLan.filter(x => x.campaignId === camId)
            var reportsdataPHM = resultdata[0].typeByPhModel.filter(x => x.campaignId === camId)
            var reportsdataPT = resultdata[0].typeByPT.filter(x => x.campaignId === camId)
            var reportsdataDT = resultdata[0].typeByDev.filter(x => x.campaignId === camId)
            var reportsdataZip = resultdata[0].typeByPin.filter(x => x.campaignId === camId)
            // console.log(reportsdata[0].report.length)
            caim.ids.map(id => {
                var appReportsdata = reportsdata[0].report.filter(x => x.appId === id)
                var appReportsdataReg = reportsdataReg[0].report.filter(x => x.appId === id)
                var appReportsdataLan = reportsdataLan[0].report.filter(x => x.appId === id)
                var appReportsdataPHM = reportsdataPHM[0].report.filter(x => x.appId === id)
                var appReportsdataPT = reportsdataPT[0].report.filter(x => x.appId === id)
                var appReportsdataDT = reportsdataDT[0].report.filter(x => x.appId === id)
                var appReportsdataZip = reportsdataZip[0].report.filter(x => x.appId === id)
                // console.log(appReportsdataReg[0].result)
                const Report = mongoose.model('Report')
                const report = new Report({
                    campaignId:camId,
                    Publisher:id,
                    date:datereq,
                    impressions:appReportsdata[0].result.impression ? appReportsdata[0].result.impression : 0,
                    thirdQuartile:appReportsdata[0].result.thirdquartile ? appReportsdata[0].result.thirdquartile : 0,
                    firstQuartile:appReportsdata[0].result.firstquartile ? appReportsdata[0].result.firstquartile : 0,
                    clicks:appReportsdata[0].result.clicktracking?appReportsdata[0].result.clicktracking:0
                    + appReportsdata[0].result.companionclicktracking?appReportsdata[0].result.companionclicktracking:0
                    + appReportsdata[0].result.click ? appReportsdata[0].result.click : 0,
                    complete:appReportsdata[0].result.complete ? appReportsdata[0].result.complete :0,
                    mediatype:appReportsdata[0].rtbType,
                    region:appReportsdataReg[0].result,
                    platformtype:appReportsdataPT[0].result,
                    deviceModel:appReportsdataDT[0].result,
                    pincode:appReportsdataZip[0].result,
                    language:appReportsdataLan[0].result,
                    phoneModel:appReportsdataPHM[0].result,
                })
                // console.log(report)
                report.save()
                .then(sdsa=>{console.log('completed')})
                .catch(err=>{console.log(err)})
            })
        })
        // res.json(compr)
    })
    .catch(err => console.log(err))
}
