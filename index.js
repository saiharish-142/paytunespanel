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

mongoose.connect(MONGOURI,{useNewUrlParser: true,useFindAndModify:false,socketTimeoutMS: 30000,keepAlive: true,reconnectTries: 30000, useUnifiedTopology: true})
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

// var currentTime = new Date();
// var currentOffset = currentTime.getTimezoneOffset();
// var ISTOffset = 330;   // IST offset UTC +5:30 
// var ISTTime = new Date(currentTime.getTime() + (ISTOffset*2 + currentOffset -5)*60000);
// console.log(ISTTime)

// adddata[0].appIds.map(caim => {
//     var camId = caim.campaignId
//     var datereq = caim.date
//     var reportsdata = adddata[0].typeValues.filter(x => x.campaignId === camId)
//     var reportsdataReg = adddata[0].typebyRegion.filter(x => x.campaignId === camId)
//     var reportsdataLan = adddata[0].typeByLan.filter(x => x.campaignId === camId)
//     var reportsdataPHM = adddata[0].typeByPhModel.filter(x => x.campaignId === camId)
//     var reportsdataPT = adddata[0].typeByPT.filter(x => x.campaignId === camId)
//     var reportsdataDT = adddata[0].typeByDev.filter(x => x.campaignId === camId)
//     var reportsdataZip = adddata[0].typeByPin.filter(x => x.campaignId === camId)
//     // console.log(reportsdata)
//     caim.ids.map(id => {
//         var appReportsdata = reportsdata[0].report.filter(x => x.appId === id)
//         var appReportsdataReg = reportsdataReg[0].report.filter(x => x.appId === id)
//         var appReportsdataLan = reportsdataLan[0].report.filter(x => x.appId === id)
//         var appReportsdataPHM = reportsdataPHM[0].report.filter(x => x.appId === id)
//         var appReportsdataPT = reportsdataPT[0].report.filter(x => x.appId === id)
//         var appReportsdataDT = reportsdataDT[0].report.filter(x => x.appId === id)
//         var appReportsdataZip = reportsdataZip[0].report.filter(x => x.appId === id)
//         // console.log(appReportsdataReg[0].result)
        
//         // console.log(result);
//         const Report = mongoose.model('Report')
//         const report = new Report({
//             campaignId:camId,
//             Publisher:id,
//             date:datereq,
//             impressions:appReportsdata[0].result.impression ? appReportsdata[0].result.impression : 0,
//             thirdQuartile:appReportsdata[0].result.thirdquartile ? appReportsdata[0].result.thirdquartile : 0,
//             firstQuartile:appReportsdata[0].result.firstquartile ? appReportsdata[0].result.firstquartile : 0,
//             clicks:appReportsdata[0].result.clicktracking?appReportsdata[0].result.clicktracking:0
//                 + appReportsdata[0].result.companionclicktracking?appReportsdata[0].result.companionclicktracking:0
//                 + appReportsdata[0].result.click ? appReportsdata[0].result.click : 0,
//             complete:appReportsdata[0].result.complete ? appReportsdata[0].result.complete :0,
//             mediatype:appReportsdata[0].rtbType,
//             region:appReportsdataReg[0].result,
//             platformtype:appReportsdataPT[0].result,
//             deviceModel:appReportsdataDT[0].result,
//             pincode:appReportsdataZip[0].result,
//             language:appReportsdataLan[0].result,
//             phoneModel:appReportsdataPHM[0].result,
//         })
//         console.log(report)
//         // report.save()
//         // .then(sdsa=>{console.log('completed')})
//         // .catch(err=>{console.log(err)})
//     })
// })
var reports = [
    {
        "region": [
            [
                {
                    "result": [
                        {
                            "companionclicktracking": 106,
                            "complete": 4180,
                            "creativeview": 1059,
                            "error": 6,
                            "impression": 2553,
                            "start": 4819
                        }
                    ],
                    "region": "DL",
                    "unique": 12723
                },
                {
                    "result": [
                        {
                            "companionclicktracking": 57,
                            "complete": 1854,
                            "creativeview": 471,
                            "impression": 1146,
                            "start": 2168
                        }
                    ],
                    "region": "GJ",
                    "unique": 5696
                },
                {
                    "result": [
                        {
                            "companionclicktracking": 12,
                            "complete": 635,
                            "creativeview": 175,
                            "impression": 404,
                            "start": 757
                        }
                    ],
                    "region": "HR",
                    "unique": 1983
                },
                {
                    "result": [
                        {
                            "companionclicktracking": 60,
                            "complete": 2736,
                            "creativeview": 597,
                            "error": 1,
                            "impression": 1701,
                            "start": 3236
                        }
                    ],
                    "region": "KA",
                    "unique": 8331
                },
                {
                    "result": [
                        {
                            "companionclicktracking": 157,
                            "complete": 7399,
                            "creativeview": 1630,
                            "error": 2,
                            "firstquartile": 4,
                            "impression": 4539,
                            "midpoint": 4,
                            "progress": 4,
                            "start": 8616,
                            "thirdquartile": 4
                        }
                    ],
                    "region": "MH",
                    "unique": 22347
                },
                {
                    "result": [
                        {
                            "complete": 2,
                            "impression": 1,
                            "start": 2
                        }
                    ],
                    "region": "RJ",
                    "unique": 3
                },
                {
                    "result": [
                        {
                            "companionclicktracking": 30,
                            "complete": 2848,
                            "creativeview": 527,
                            "error": 1,
                            "impression": 1735,
                            "start": 3342
                        }
                    ],
                    "region": "TG",
                    "unique": 8483
                },
                {
                    "result": [
                        {
                            "companionclicktracking": 46,
                            "complete": 1803,
                            "creativeview": 484,
                            "error": 1,
                            "impression": 1149,
                            "start": 2101
                        }
                    ],
                    "region": "TN",
                    "unique": 5584
                },
                {
                    "result": [
                        {
                            "companionclicktracking": 7,
                            "complete": 636,
                            "creativeview": 143,
                            "error": 1,
                            "impression": 376,
                            "start": 713
                        }
                    ],
                    "region": "UP",
                    "unique": 1876
                },
                {
                    "result": [
                        {
                            "companionclicktracking": 108,
                            "complete": 7240,
                            "creativeview": 1677,
                            "error": 2,
                            "firstquartile": 8,
                            "impression": 4365,
                            "midpoint": 10,
                            "pause": 2,
                            "progress": 6,
                            "start": 8273,
                            "thirdquartile": 6
                        }
                    ],
                    "region": "WB",
                    "unique": 21691
                }
            ],
            [
                {
                    "result": [
                        {
                            "clicktracking": 2,
                            "complete": 653,
                            "firstquartile": 655,
                            "impression": 710,
                            "midpoint": 653,
                            "mute": 4,
                            "pause": 57,
                            "resume": 42,
                            "start": 784,
                            "thirdquartile": 650,
                            "unmute": 3
                        }
                    ],
                    "region": "DL",
                    "unique": 4213
                },
                {
                    "result": [
                        {
                            "clicktracking": 2,
                            "complete": 179,
                            "firstquartile": 179,
                            "impression": 190,
                            "midpoint": 179,
                            "mute": 1,
                            "pause": 10,
                            "resume": 8,
                            "start": 205,
                            "thirdquartile": 179
                        }
                    ],
                    "region": "GJ",
                    "unique": 774
                },
                {
                    "result": [
                        {
                            "clicktracking": 2,
                            "complete": 437,
                            "error": 1,
                            "firstquartile": 439,
                            "impression": 478,
                            "midpoint": 438,
                            "mute": 1,
                            "pause": 39,
                            "resume": 31,
                            "start": 537,
                            "thirdquartile": 436,
                            "unmute": 3
                        }
                    ],
                    "region": "HR",
                    "unique": 2842
                },
                {
                    "result": [
                        {
                            "clicktracking": 4,
                            "complete": 427,
                            "firstquartile": 432,
                            "impression": 458,
                            "midpoint": 427,
                            "mute": 1,
                            "pause": 22,
                            "resume": 17,
                            "start": 493,
                            "thirdquartile": 427,
                            "unmute": 3
                        }
                    ],
                    "region": "KA",
                    "unique": 1857
                },
                {
                    "result": [
                        {
                            "clicktracking": 2,
                            "complete": 292,
                            "firstquartile": 293,
                            "impression": 329,
                            "midpoint": 292,
                            "mute": 1,
                            "pause": 24,
                            "resume": 12,
                            "start": 355,
                            "thirdquartile": 292,
                            "unmute": 2
                        }
                    ],
                    "region": "MH",
                    "unique": 1310
                },
                {
                    "result": [
                        {
                            "complete": 13,
                            "firstquartile": 13,
                            "impression": 15,
                            "midpoint": 13,
                            "pause": 2,
                            "resume": 2,
                            "start": 19,
                            "thirdquartile": 13
                        }
                    ],
                    "region": "RJ",
                    "unique": 49
                },
                {
                    "result": [
                        {
                            "clicktracking": 7,
                            "complete": 646,
                            "error": 1,
                            "firstquartile": 651,
                            "impression": 705,
                            "midpoint": 648,
                            "mute": 2,
                            "pause": 61,
                            "resume": 47,
                            "start": 768,
                            "thirdquartile": 645,
                            "unmute": 2
                        }
                    ],
                    "region": "TN",
                    "unique": 4183
                },
                {
                    "result": [
                        {
                            "clicktracking": 2,
                            "complete": 379,
                            "error": 3,
                            "firstquartile": 380,
                            "impression": 422,
                            "midpoint": 380,
                            "mute": 3,
                            "pause": 41,
                            "resume": 31,
                            "start": 468,
                            "thirdquartile": 379,
                            "unmute": 2
                        }
                    ],
                    "region": "UP",
                    "unique": 2490
                },
                {
                    "result": [
                        {
                            "clicktracking": 6,
                            "complete": 628,
                            "error": 1,
                            "firstquartile": 631,
                            "impression": 686,
                            "midpoint": 629,
                            "mute": 2,
                            "pause": 40,
                            "resume": 30,
                            "start": 752,
                            "thirdquartile": 631,
                            "unmute": 3
                        }
                    ],
                    "region": "WB",
                    "unique": 4039
                }
            ],
            [
                {
                    "result": [
                        {
                            "companionclicktracking": 624,
                            "complete": 18080,
                            "creativeview": 5227,
                            "error": 38,
                            "firstquartile": 12,
                            "impression": 11084,
                            "midpoint": 10,
                            "progress": 4,
                            "start": 20693,
                            "thirdquartile": 4
                        }
                    ],
                    "region": "DL",
                    "unique": 55772
                },
                {
                    "result": [
                        {
                            "companionclicktracking": 320,
                            "complete": 6951,
                            "creativeview": 1953,
                            "error": 2,
                            "firstquartile": 2,
                            "impression": 4353,
                            "midpoint": 2,
                            "progress": 2,
                            "start": 8067,
                            "thirdquartile": 2
                        }
                    ],
                    "region": "GJ",
                    "unique": 21648
                },
                {
                    "result": [
                        {
                            "companionclicktracking": 82,
                            "complete": 2632,
                            "creativeview": 779,
                            "error": 3,
                            "impression": 1598,
                            "start": 3026
                        }
                    ],
                    "region": "HR",
                    "unique": 8120
                },
                {
                    "result": [
                        {
                            "companionclicktracking": 530,
                            "complete": 21142,
                            "creativeview": 5141,
                            "error": 14,
                            "firstquartile": 1,
                            "impression": 12969,
                            "midpoint": 1,
                            "progress": 1,
                            "start": 24207,
                            "thirdquartile": 1
                        }
                    ],
                    "region": "KA",
                    "unique": 64004
                },
                {
                    "result": [
                        {
                            "companionclicktracking": 860,
                            "complete": 30460,
                            "creativeview": 7855,
                            "error": 25,
                            "firstquartile": 2,
                            "impression": 18511,
                            "midpoint": 2,
                            "progress": 2,
                            "start": 34742,
                            "thirdquartile": 2
                        }
                    ],
                    "region": "MH",
                    "unique": 92455
                },
                {
                    "result": [
                        {
                            "complete": 4,
                            "creativeview": 2,
                            "impression": 2,
                            "start": 4
                        }
                    ],
                    "region": "RJ",
                    "unique": 6
                },
                {
                    "result": [
                        {
                            "companionclicktracking": 212,
                            "complete": 11019,
                            "creativeview": 2347,
                            "error": 2,
                            "impression": 6599,
                            "start": 12512
                        }
                    ],
                    "region": "TG",
                    "unique": 32691
                },
                {
                    "result": [
                        {
                            "companionclicktracking": 233,
                            "complete": 7097,
                            "creativeview": 2110,
                            "error": 3,
                            "firstquartile": 4,
                            "impression": 4495,
                            "midpoint": 4,
                            "progress": 4,
                            "start": 8234,
                            "thirdquartile": 4
                        }
                    ],
                    "region": "TN",
                    "unique": 22176
                },
                {
                    "result": [
                        {
                            "companionclicktracking": 94,
                            "complete": 2769,
                            "creativeview": 802,
                            "error": 7,
                            "firstquartile": 2,
                            "impression": 1697,
                            "midpoint": 2,
                            "progress": 2,
                            "start": 3211,
                            "thirdquartile": 2
                        }
                    ],
                    "region": "UP",
                    "unique": 8582
                },
                {
                    "result": [
                        {
                            "companionclicktracking": 586,
                            "complete": 27024,
                            "creativeview": 7270,
                            "error": 9,
                            "firstquartile": 17,
                            "impression": 16397,
                            "midpoint": 13,
                            "progress": 11,
                            "start": 30878,
                            "thirdquartile": 13
                        }
                    ],
                    "region": "WB",
                    "unique": 82218
                }
            ],
            [
                {
                    "result": [
                        {
                            "clicktracking": 19,
                            "complete": 2771,
                            "error": 2,
                            "firstquartile": 2795,
                            "impression": 3035,
                            "midpoint": 2775,
                            "mute": 23,
                            "pause": 250,
                            "resume": 178,
                            "start": 3355,
                            "thirdquartile": 2774,
                            "unmute": 24
                        }
                    ],
                    "region": "DL",
                    "unique": 18001
                },
                {
                    "result": [
                        {
                            "clicktracking": 3,
                            "complete": 546,
                            "error": 1,
                            "firstquartile": 549,
                            "impression": 597,
                            "midpoint": 545,
                            "mute": 4,
                            "pause": 82,
                            "resume": 69,
                            "start": 641,
                            "thirdquartile": 546,
                            "unmute": 8
                        }
                    ],
                    "region": "GJ",
                    "unique": 3045
                },
                {
                    "result": [
                        {
                            "clicktracking": 2,
                            "complete": 699,
                            "firstquartile": 707,
                            "impression": 761,
                            "midpoint": 703,
                            "mute": 7,
                            "pause": 68,
                            "resume": 53,
                            "start": 849,
                            "thirdquartile": 699,
                            "unmute": 4
                        }
                    ],
                    "region": "HR",
                    "unique": 4552
                },
                {
                    "result": [
                        {
                            "clicktracking": 10,
                            "complete": 2051,
                            "error": 1,
                            "firstquartile": 2071,
                            "impression": 2205,
                            "midpoint": 2059,
                            "mute": 14,
                            "pause": 190,
                            "resume": 150,
                            "start": 2547,
                            "thirdquartile": 2054,
                            "unmute": 12
                        }
                    ],
                    "region": "KA",
                    "unique": 13364
                },
                {
                    "result": [
                        {
                            "clicktracking": 13,
                            "complete": 1219,
                            "error": 3,
                            "firstquartile": 1229,
                            "impression": 1325,
                            "midpoint": 1220,
                            "mute": 8,
                            "pause": 150,
                            "resume": 115,
                            "start": 1509,
                            "thirdquartile": 1217,
                            "unmute": 10
                        }
                    ],
                    "region": "MH",
                    "unique": 8018
                },
                {
                    "result": [
                        {
                            "complete": 22,
                            "firstquartile": 22,
                            "impression": 25,
                            "midpoint": 22,
                            "pause": 1,
                            "start": 29,
                            "thirdquartile": 22
                        }
                    ],
                    "region": "RJ",
                    "unique": 77
                },
                {
                    "result": [
                        {
                            "clicktracking": 8,
                            "complete": 1001,
                            "error": 1,
                            "firstquartile": 1005,
                            "impression": 1074,
                            "midpoint": 998,
                            "mute": 1,
                            "pause": 118,
                            "resume": 98,
                            "start": 1183,
                            "thirdquartile": 998,
                            "unmute": 3
                        }
                    ],
                    "region": "TN",
                    "unique": 6487
                },
                {
                    "result": [
                        {
                            "clicktracking": 7,
                            "complete": 653,
                            "error": 1,
                            "firstquartile": 664,
                            "impression": 695,
                            "midpoint": 656,
                            "mute": 7,
                            "pause": 75,
                            "resume": 61,
                            "start": 766,
                            "thirdquartile": 656,
                            "unmute": 6
                        }
                    ],
                    "region": "UP",
                    "unique": 4247
                },
                {
                    "result": [
                        {
                            "clicktracking": 6,
                            "complete": 1029,
                            "firstquartile": 1030,
                            "impression": 1118,
                            "midpoint": 1029,
                            "mute": 7,
                            "pause": 119,
                            "resume": 84,
                            "start": 1203,
                            "thirdquartile": 1029,
                            "unmute": 5
                        }
                    ],
                    "region": "WB",
                    "unique": 6659
                }
            ],
            [
                {
                    "result": [
                        {
                            "companionclicktracking": 380,
                            "complete": 12050,
                            "creativeview": 3359,
                            "error": 24,
                            "firstquartile": 5,
                            "impression": 7260,
                            "midpoint": 5,
                            "progress": 5,
                            "start": 13745,
                            "thirdquartile": 5
                        }
                    ],
                    "region": "DL",
                    "unique": 36823
                },
                {
                    "result": [
                        {
                            "companionclicktracking": 280,
                            "complete": 6926,
                            "creativeview": 1938,
                            "error": 7,
                            "firstquartile": 10,
                            "impression": 4275,
                            "midpoint": 8,
                            "progress": 46,
                            "start": 7973,
                            "thirdquartile": 6
                        }
                    ],
                    "region": "GJ",
                    "unique": 21469
                },
                {
                    "result": [
                        {
                            "companionclicktracking": 57,
                            "complete": 1931,
                            "creativeview": 515,
                            "error": 2,
                            "impression": 1159,
                            "start": 2191
                        }
                    ],
                    "region": "HR",
                    "unique": 5855
                },
                {
                    "result": [
                        {
                            "companionclicktracking": 555,
                            "complete": 17758,
                            "creativeview": 4312,
                            "error": 9,
                            "firstquartile": 2,
                            "impression": 10861,
                            "start": 20259,
                            "thirdquartile": 2
                        }
                    ],
                    "region": "KA",
                    "unique": 53756
                },
                {
                    "result": [
                        {
                            "companionclicktracking": 775,
                            "complete": 26433,
                            "creativeview": 6915,
                            "error": 19,
                            "firstquartile": 17,
                            "impression": 16000,
                            "midpoint": 14,
                            "progress": 13,
                            "start": 30211,
                            "thirdquartile": 13
                        }
                    ],
                    "region": "MH",
                    "unique": 80397
                },
                {
                    "result": [
                        {
                            "companionclicktracking": 116,
                            "complete": 6408,
                            "creativeview": 1246,
                            "error": 4,
                            "firstquartile": 2,
                            "impression": 3831,
                            "midpoint": 2,
                            "progress": 2,
                            "start": 7265,
                            "thirdquartile": 2
                        }
                    ],
                    "region": "TG",
                    "unique": 18872
                },
                {
                    "result": [
                        {
                            "companionclicktracking": 221,
                            "complete": 6491,
                            "creativeview": 1943,
                            "firstquartile": 4,
                            "impression": 4066,
                            "midpoint": 6,
                            "progress": 6,
                            "start": 7504,
                            "thirdquartile": 6
                        }
                    ],
                    "region": "TN",
                    "unique": 20235
                },
                {
                    "result": [
                        {
                            "companionclicktracking": 61,
                            "complete": 2028,
                            "creativeview": 562,
                            "error": 3,
                            "impression": 1217,
                            "start": 2305
                        }
                    ],
                    "region": "UP",
                    "unique": 6176
                },
                {
                    "result": [
                        {
                            "companionclicktracking": 257,
                            "complete": 14564,
                            "creativeview": 3613,
                            "error": 7,
                            "firstquartile": 2,
                            "impression": 8737,
                            "midpoint": 2,
                            "pause": 2,
                            "start": 16614
                        }
                    ],
                    "region": "WB",
                    "unique": 43796
                }
            ],
            [
                {
                    "result": [
                        {
                            "clicktracking": 6,
                            "complete": 976,
                            "firstquartile": 987,
                            "impression": 1093,
                            "midpoint": 979,
                            "mute": 18,
                            "pause": 91,
                            "resume": 60,
                            "start": 1256,
                            "thirdquartile": 974,
                            "unmute": 13
                        }
                    ],
                    "region": "DL",
                    "unique": 6453
                },
                {
                    "result": [
                        {
                            "clicktracking": 1,
                            "complete": 225,
                            "firstquartile": 225,
                            "impression": 245,
                            "midpoint": 225,
                            "pause": 31,
                            "resume": 23,
                            "start": 264,
                            "thirdquartile": 225,
                            "unmute": 1
                        }
                    ],
                    "region": "GJ",
                    "unique": 790
                },
                {
                    "result": [
                        {
                            "clicktracking": 1,
                            "complete": 240,
                            "firstquartile": 244,
                            "impression": 275,
                            "midpoint": 243,
                            "mute": 4,
                            "pause": 27,
                            "resume": 22,
                            "start": 303,
                            "thirdquartile": 240,
                            "unmute": 2
                        }
                    ],
                    "region": "HR",
                    "unique": 1361
                },
                {
                    "result": [
                        {
                            "clicktracking": 5,
                            "complete": 758,
                            "firstquartile": 766,
                            "impression": 840,
                            "midpoint": 761,
                            "mute": 3,
                            "pause": 124,
                            "resume": 105,
                            "start": 1001,
                            "thirdquartile": 759,
                            "unmute": 2
                        }
                    ],
                    "region": "KA",
                    "unique": 5124
                },
                {
                    "result": [
                        {
                            "clicktracking": 3,
                            "complete": 488,
                            "error": 2,
                            "firstquartile": 494,
                            "impression": 546,
                            "midpoint": 491,
                            "mute": 3,
                            "pause": 51,
                            "resume": 41,
                            "start": 610,
                            "thirdquartile": 490,
                            "unmute": 5
                        }
                    ],
                    "region": "MH",
                    "unique": 3224
                },
                {
                    "result": [
                        {
                            "complete": 2,
                            "firstquartile": 2,
                            "impression": 2,
                            "midpoint": 2,
                            "pause": 1,
                            "start": 6,
                            "thirdquartile": 2
                        }
                    ],
                    "region": "RJ",
                    "unique": 9
                },
                {
                    "result": [
                        {
                            "clicktracking": 3,
                            "complete": 374,
                            "firstquartile": 379,
                            "impression": 404,
                            "midpoint": 378,
                            "pause": 48,
                            "resume": 34,
                            "start": 459,
                            "thirdquartile": 374,
                            "unmute": 1
                        }
                    ],
                    "region": "TN",
                    "unique": 2454
                },
                {
                    "result": [
                        {
                            "clicktracking": 2,
                            "complete": 235,
                            "firstquartile": 242,
                            "impression": 258,
                            "midpoint": 237,
                            "mute": 3,
                            "pause": 25,
                            "resume": 17,
                            "start": 291,
                            "thirdquartile": 236,
                            "unmute": 1
                        }
                    ],
                    "region": "UP",
                    "unique": 1547
                },
                {
                    "result": [
                        {
                            "clicktracking": 2,
                            "complete": 342,
                            "firstquartile": 345,
                            "impression": 391,
                            "midpoint": 344,
                            "mute": 1,
                            "pause": 41,
                            "resume": 22,
                            "start": 441,
                            "thirdquartile": 343,
                            "unmute": 1
                        }
                    ],
                    "region": "WB",
                    "unique": 2273
                }
            ],
            [
                {
                    "result": [
                        {
                            "companionclicktracking": 98,
                            "complete": 4365,
                            "creativeview": 989,
                            "error": 10,
                            "impression": 2618,
                            "pause": 2,
                            "resume": 2,
                            "start": 4999
                        }
                    ],
                    "region": "DL",
                    "unique": 13081
                },
                {
                    "result": [
                        {
                            "companionclicktracking": 118,
                            "complete": 3607,
                            "creativeview": 955,
                            "error": 1,
                            "firstquartile": 2,
                            "impression": 2208,
                            "pause": 2,
                            "start": 4139
                        }
                    ],
                    "region": "GJ",
                    "unique": 11030
                },
                {
                    "result": [
                        {
                            "companionclicktracking": 10,
                            "complete": 713,
                            "creativeview": 145,
                            "error": 2,
                            "impression": 422,
                            "start": 798
                        }
                    ],
                    "region": "HR",
                    "unique": 2090
                },
                {
                    "result": [
                        {
                            "companionclicktracking": 195,
                            "complete": 7153,
                            "creativeview": 1797,
                            "error": 2,
                            "impression": 4366,
                            "start": 8163
                        }
                    ],
                    "region": "KA",
                    "unique": 21676
                },
                {
                    "result": [
                        {
                            "companionclicktracking": 355,
                            "complete": 14049,
                            "creativeview": 3659,
                            "error": 7,
                            "impression": 8513,
                            "start": 16051
                        }
                    ],
                    "region": "MH",
                    "unique": 42634
                },
                {
                    "result": [
                        {
                            "companionclicktracking": 91,
                            "complete": 4811,
                            "creativeview": 1041,
                            "error": 3,
                            "impression": 2899,
                            "start": 5467
                        }
                    ],
                    "region": "TG",
                    "unique": 14312
                },
                {
                    "result": [
                        {
                            "companionclicktracking": 107,
                            "complete": 3199,
                            "creativeview": 1006,
                            "firstquartile": 2,
                            "impression": 2033,
                            "midpoint": 2,
                            "progress": 2,
                            "start": 3771,
                            "thirdquartile": 2
                        }
                    ],
                    "region": "TN",
                    "unique": 10118
                },
                {
                    "result": [
                        {
                            "companionclicktracking": 7,
                            "complete": 698,
                            "creativeview": 156,
                            "error": 1,
                            "firstquartile": 1,
                            "impression": 407,
                            "midpoint": 1,
                            "progress": 1,
                            "start": 776,
                            "thirdquartile": 1
                        }
                    ],
                    "region": "UP",
                    "unique": 2046
                },
                {
                    "result": [
                        {
                            "companionclicktracking": 273,
                            "complete": 11895,
                            "creativeview": 3190,
                            "error": 3,
                            "firstquartile": 10,
                            "impression": 7174,
                            "midpoint": 6,
                            "progress": 2,
                            "start": 13514,
                            "thirdquartile": 2
                        }
                    ],
                    "region": "WB",
                    "unique": 36067
                }
            ],
            [
                {
                    "result": [
                        {
                            "complete": 6,
                            "firstquartile": 6,
                            "impression": 7,
                            "thirdquartile": 6,
                            "start": 8,
                            "midpoint": 6
                        }
                    ],
                    "region": "HR",
                    "unique": 21
                },
                {
                    "result": [
                        {
                            "thirdquartile": 15,
                            "impression": 17,
                            "start": 20,
                            "firstquartile": 15,
                            "complete": 15,
                            "resume": 10,
                            "midpoint": 15,
                            "pause": 10
                        }
                    ],
                    "region": "WB",
                    "unique": 62
                },
                {
                    "result": [
                        {
                            "pause": 2,
                            "midpoint": 19,
                            "start": 23,
                            "complete": 20,
                            "resume": 2,
                            "impression": 21,
                            "thirdquartile": 19,
                            "clicktracking": 1,
                            "firstquartile": 20
                        }
                    ],
                    "region": "TN",
                    "unique": 107
                },
                {
                    "result": [
                        {
                            "firstquartile": 17,
                            "thirdquartile": 16,
                            "start": 19,
                            "complete": 16,
                            "impression": 17,
                            "clicktracking": 3,
                            "midpoint": 16
                        }
                    ],
                    "region": "UP",
                    "unique": 55
                },
                {
                    "result": [
                        {
                            "thirdquartile": 1,
                            "midpoint": 1,
                            "start": 1,
                            "complete": 1,
                            "impression": 1,
                            "firstquartile": 1
                        }
                    ],
                    "region": "RJ",
                    "unique": 1
                }
            ]
        ]
    }
]
// function datamaker(aaa,idrequ){
//     var super11 = [];
//     aaa.map(dataa=> {
//         super11 = super11.concat(dataa)
//     })
//     var groups = {};
//     var id = idrequ;
//     for (var i = 0; i < super11.length; i++) {
//     var groupName = super11[i][id];
//     if (!groups[groupName]) {
//         groups[groupName] = [];
//     }
//     groups[groupName].push(super11[i].result[0]);
//     }
//     myArray = [];
//     for (var groupName in groups) {
//     myArray.push({[id]: groupName, result: groups[groupName]});
//     }
//     myArray.map(esc=>{
//         var result = [];
//         const sumArray = arr => {
//             const res = {};
//             for(let i = 0; i < arr.length; i++){
//                 Object.keys(arr[i]).forEach(key => {
//                     res[key] = (res[key] || 0) + arr[i][key];
//                 });
//             };
//             return res;
//         };
//         esc.result = sumArray(esc.result)
//     })
//     return myArray;
// }

function datamaker(aaa,idrequ){
    var super11 = [];
    aaa.map(part => {
        super11 = super11.concat(part)
    })
    var groups = {};
    var id = idrequ;
    for (var i = 0; i < super11.length; i++) {
    var groupName = super11[i][id];
    if (!groups[groupName]) {
        groups[groupName] = [];
    }
    if (!groups[`${groupName}`+"unique"]) {
        groups[`${groupName}`+"unique"] = 0;
    }
    groups[`${groupName}`+"unique"] += super11[i].unique
    groups[groupName].push(super11[i].result);
    }
    myArray = [];
    // console.log(groups)
    for (var groupName in groups) {
        if(groupName.length < idrequ.length)
        myArray.push({[id]: groupName, unique: groups[`${groupName}`+"unique"], result: groups[groupName]});
    }
    // console.log(myArray)
    myArray.map(esc=>{
        // var result = [];
        const sumArray = arr => {
            const res = {};
            for(let i = 0; i < arr.length; i++){
                Object.keys(arr[i]).forEach(key => {
                    res[key] = (res[key] || 0) + arr[i][key];
                });
            };
            return res;
        };
        var resultDes = [];
        esc.result.map(eac=>{
            resultDes = resultDes.concat(eac)
        })
        esc.result = sumArray(resultDes)
        // console.log(esc)
    })
    return myArray;
}
reports = reports.map(det => {
    var dema = datamaker(det.region,'region')
    det.region = dema
    return det;
})
// console.log(reports[0].region[0])