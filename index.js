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

mongoose.connect(MONGOURI,{useNewUrlParser: true,useFindAndModify:false, useUnifiedTopology: true})
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
        trackinglogs.aggregate([
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
                    {$group:{_id:{campaignId:"$campaignId",type:"$type",appId:"$appId",rtbType:"$rtbType",region:"$region"}, count:{$sum:1}}},
                    {$group:{_id:{appId:"$_id.appId",campaignId:"$_id.campaignId",rtbType:"$_id.rtbType",region:"$_id.region"}, result:{$push:{k:"$_id.type",v:"$count"}}}},
                    {$group:{_id:{appId:"$_id.appId",campaignId:"$_id.campaignId",rtbType:"$_id.rtbType"}, result:{$push:{region:"$_id.region",result:{$arrayToObject:"$result"}}}}},
                    {$group:{_id:"$_id.campaignId",report:{$push:{appId:"$_id.appId",rtbType:"$_id.rtbType",result:"$result"}}}},
                    {$project:{_id:0,campaignId:"$_id",report:"$report"}}
                ],"typeByLan":[
                    {$group:{_id:{campaignId:"$campaignId",type:"$type",appId:"$appId",rtbType:"$rtbType",language:"$language"}, count:{$sum:1}}},
                    {$group:{_id:{campaignId:"$_id.campaignId",appId:"$_id.appId",rtbType:"$_id.rtbType",language:"$_id.language"}, result:{$push:{k:"$_id.type",v:"$count"}}}},
                    {$group:{_id:{appId:"$_id.appId",campaignId:"$_id.campaignId",rtbType:"$_id.rtbType"}, result:{$push:{language:"$_id.language",result:{$arrayToObject:"$result"}}}}},
                    {$group:{_id:"$_id.campaignId",report:{$push:{appId:"$_id.appId",rtbType:"$_id.rtbType",result:"$result"}}}},
                    {$project:{_id:0,campaignId:"$_id",report:"$report"}}
                ],"typeByOSV":[
                    {$group:{_id:{campaignId:"$campaignId",type:"$type",appId:"$appId",rtbType:"$rtbType",osVersion:"$osVersion"}, count:{$sum:1}}},
                    {$group:{_id:{campaignId:"$_id.campaignId",appId:"$_id.appId",rtbType:"$_id.rtbType",osVersion:"$_id.osVersion"}, result:{$push:{k:"$_id.type",v:"$count"}}}},
                    {$group:{_id:{appId:"$_id.appId",campaignId:"$_id.campaignId",rtbType:"$_id.rtbType"}, result:{$push:{osVersion:"$_id.osVersion",result:{$arrayToObject:"$result"}}}}},
                    {$group:{_id:"$_id.campaignId",report:{$push:{appId:"$_id.appId",rtbType:"$_id.rtbType",result:"$result"}}}},
                    {$project:{_id:0,campaignId:"$_id",report:"$report"}}
                ],"typeByPhModel":[
                    {$group:{_id:{campaignId:"$campaignId",type:"$type",appId:"$appId",rtbType:"$rtbType",phoneModel:"$phoneModel"}, count:{$sum:1}}},
                    {$group:{_id:{campaignId:"$_id.campaignId",appId:"$_id.appId",rtbType:"$_id.rtbType",phoneModel:"$_id.phoneModel"}, result:{$push:{k:"$_id.type",v:"$count"}}}},
                    {$group:{_id:{appId:"$_id.appId",campaignId:"$_id.campaignId",rtbType:"$_id.rtbType"}, result:{$push:{phoneModel:"$_id.phoneModel",result:{$arrayToObject:"$result"}}}}},
                    {$group:{_id:"$_id.campaignId",report:{$push:{appId:"$_id.appId",rtbType:"$_id.rtbType",result:"$result"}}}},
                    {$project:{_id:0,campaignId:"$_id",report:"$report"}}
                ],"typeByPT":[
                    {$group:{_id:{campaignId:"$campaignId",type:"$type",appId:"$appId",rtbType:"$rtbType",platformType:"$platformType"}, count:{$sum:1}}},
                    {$group:{_id:{campaignId:"$_id.campaignId",appId:"$_id.appId",rtbType:"$_id.rtbType",platformType:"$_id.platformType"}, result:{$push:{k:"$_id.type",v:"$count"}}}},
                    {$group:{_id:{appId:"$_id.appId",campaignId:"$_id.campaignId",rtbType:"$_id.rtbType"}, result:{$push:{platformType:"$_id.platformType",result:{$arrayToObject:"$result"}}}}},
                    {$group:{_id:"$_id.campaignId",report:{$push:{appId:"$_id.appId",rtbType:"$_id.rtbType",result:"$result"}}}},
                    {$project:{_id:0,campaignId:"$_id",report:"$report"}}
                ],"typeByPin":[
                    {$group:{_id:{campaignId:"$campaignId",type:"$type",appId:"$appId",rtbType:"$rtbType",zip:"$zip"}, count:{$sum:1}}},
                    {$group:{_id:{campaignId:"$_id.campaignId",appId:"$_id.appId",rtbType:"$_id.rtbType",zip:"$_id.zip"}, result:{$push:{k:"$_id.type",v:"$count"}}}},
                    {$group:{_id:{appId:"$_id.appId",campaignId:"$_id.campaignId",rtbType:"$_id.rtbType"}, result:{$push:{zip:"$_id.zip",result:{$arrayToObject:"$result"}}}}},
                    {$group:{_id:"$_id.campaignId",report:{$push:{appId:"$_id.appId",rtbType:"$_id.rtbType",result:"$result"}}}},
                    {$project:{_id:0,campaignId:"$_id",report:"$report"}}
                ]
            }}
        ])
        .then(result=>{
            var resultdata = result;
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
//     var reportsdata = resultdata[0].typeValues.filter(x => x.campaignId === camId)
//     var reportsdataReg = resultdata[0].typebyRegion.filter(x => x.campaignId === camId)
//     var reportsdataLan = resultdata[0].typeByLan.filter(x => x.campaignId === camId)
//     var reportsdataPHM = resultdata[0].typeByPhModel.filter(x => x.campaignId === camId)
//     var reportsdataPT = resultdata[0].typeByPT.filter(x => x.campaignId === camId)
//     var reportsdataDT = resultdata[0].typeByDev.filter(x => x.campaignId === camId)
//     var reportsdataZip = resultdata[0].typeByPin.filter(x => x.campaignId === camId)
//     // console.log(reportsdata[0].report.length)
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
//         // console.log(report)
//         // report.save()
//         // .then(sdsa=>{console.log('completed')})
//         // .catch(err=>{console.log(err)})
//     })
// })
// var reports = [
//     {
//         "region": [
//             [
//                 {
//                     "result": [
//                         {
//                             "complete": 698,
//                             "firstquartile": 1,
//                             "impression": 407,
//                             "thirdquartile": 1,
//                             "start": 776,
//                             "creativeview": 156,
//                             "companionclicktracking": 7,
//                             "error": 1,
//                             "midpoint": 1,
//                             "progress": 1
//                         }
//                     ],
//                     "region": "UP"
//                 },
//                 {
//                     "result": [
//                         {
//                             "impression": 2899,
//                             "complete": 4811,
//                             "companionclicktracking": 91,
//                             "creativeview": 1041,
//                             "error": 3,
//                             "start": 5467
//                         }
//                     ],
//                     "region": "TG"
//                 },
//                 {
//                     "result": [
//                         {
//                             "firstquartile": 2,
//                             "start": 4139,
//                             "impression": 2208,
//                             "companionclicktracking": 118,
//                             "pause": 2,
//                             "complete": 3607,
//                             "creativeview": 955,
//                             "error": 1
//                         }
//                     ],
//                     "region": "GJ"
//                 },
//                 {
//                     "result": [
//                         {
//                             "pause": 2,
//                             "resume": 2,
//                             "complete": 4365,
//                             "start": 4999,
//                             "companionclicktracking": 98,
//                             "creativeview": 989,
//                             "error": 10,
//                             "impression": 2618
//                         }
//                     ],
//                     "region": "DL"
//                 },
//                 {
//                     "result": [
//                         {
//                             "impression": 4366,
//                             "complete": 7153,
//                             "error": 2,
//                             "start": 8163,
//                             "companionclicktracking": 195,
//                             "creativeview": 1797
//                         }
//                     ],
//                     "region": "KA"
//                 },
//                 {
//                     "result": [
//                         {
//                             "error": 7,
//                             "creativeview": 3659,
//                             "companionclicktracking": 355,
//                             "impression": 8513,
//                             "start": 16051,
//                             "complete": 14049
//                         }
//                     ],
//                     "region": "MH"
//                 },
//                 {
//                     "result": [
//                         {
//                             "thirdquartile": 2,
//                             "progress": 2,
//                             "impression": 7174,
//                             "creativeview": 3190,
//                             "complete": 11895,
//                             "companionclicktracking": 273,
//                             "firstquartile": 10,
//                             "start": 13514,
//                             "error": 3,
//                             "midpoint": 6
//                         }
//                     ],
//                     "region": "WB"
//                 },
//                 {
//                     "result": [
//                         {
//                             "start": 798,
//                             "creativeview": 145,
//                             "companionclicktracking": 10,
//                             "impression": 422,
//                             "error": 2,
//                             "complete": 713
//                         }
//                     ],
//                     "region": "HR"
//                 },
//                 {
//                     "result": [
//                         {
//                             "complete": 3199,
//                             "thirdquartile": 2,
//                             "companionclicktracking": 107,
//                             "impression": 2033,
//                             "start": 3771,
//                             "creativeview": 1006,
//                             "progress": 2,
//                             "firstquartile": 2,
//                             "midpoint": 2
//                         }
//                     ],
//                     "region": "TN"
//                 }
//             ],
//             [
//                 {
//                     "result": [
//                         {
//                             "unmute": 1,
//                             "pause": 48,
//                             "resume": 34,
//                             "impression": 404,
//                             "thirdquartile": 374,
//                             "clicktracking": 3,
//                             "firstquartile": 379,
//                             "midpoint": 378,
//                             "start": 459,
//                             "complete": 374
//                         }
//                     ],
//                     "region": "TN"
//                 },
//                 {
//                     "result": [
//                         {
//                             "midpoint": 761,
//                             "clicktracking": 5,
//                             "impression": 840,
//                             "unmute": 2,
//                             "resume": 105,
//                             "start": 1001,
//                             "firstquartile": 766,
//                             "mute": 3,
//                             "pause": 124,
//                             "complete": 758,
//                             "thirdquartile": 759
//                         }
//                     ],
//                     "region": "KA"
//                 },
//                 {
//                     "result": [
//                         {
//                             "complete": 225,
//                             "firstquartile": 225,
//                             "clicktracking": 1,
//                             "impression": 245,
//                             "start": 264,
//                             "thirdquartile": 225,
//                             "resume": 23,
//                             "unmute": 1,
//                             "pause": 31,
//                             "midpoint": 225
//                         }
//                     ],
//                     "region": "GJ"
//                 },
//                 {
//                     "result": [
//                         {
//                             "pause": 91,
//                             "impression": 1093,
//                             "thirdquartile": 974,
//                             "mute": 18,
//                             "clicktracking": 6,
//                             "midpoint": 979,
//                             "complete": 976,
//                             "resume": 60,
//                             "start": 1256,
//                             "firstquartile": 987,
//                             "unmute": 13
//                         }
//                     ],
//                     "region": "DL"
//                 },
//                 {
//                     "result": [
//                         {
//                             "firstquartile": 2,
//                             "midpoint": 2,
//                             "start": 6,
//                             "complete": 2,
//                             "impression": 2,
//                             "pause": 1,
//                             "thirdquartile": 2
//                         }
//                     ],
//                     "region": "RJ"
//                 },
//                 {
//                     "result": [
//                         {
//                             "clicktracking": 2,
//                             "resume": 22,
//                             "impression": 391,
//                             "firstquartile": 345,
//                             "mute": 1,
//                             "complete": 342,
//                             "midpoint": 344,
//                             "pause": 41,
//                             "thirdquartile": 343,
//                             "unmute": 1,
//                             "start": 441
//                         }
//                     ],
//                     "region": "WB"
//                 },
//                 {
//                     "result": [
//                         {
//                             "complete": 235,
//                             "mute": 3,
//                             "clicktracking": 2,
//                             "midpoint": 237,
//                             "resume": 17,
//                             "unmute": 1,
//                             "pause": 25,
//                             "start": 291,
//                             "impression": 258,
//                             "firstquartile": 242,
//                             "thirdquartile": 236
//                         }
//                     ],
//                     "region": "UP"
//                 },
//                 {
//                     "result": [
//                         {
//                             "unmute": 2,
//                             "clicktracking": 1,
//                             "impression": 275,
//                             "resume": 22,
//                             "start": 303,
//                             "midpoint": 243,
//                             "mute": 4,
//                             "complete": 240,
//                             "firstquartile": 244,
//                             "thirdquartile": 240,
//                             "pause": 27
//                         }
//                     ],
//                     "region": "HR"
//                 },
//                 {
//                     "result": [
//                         {
//                             "firstquartile": 494,
//                             "clicktracking": 3,
//                             "midpoint": 491,
//                             "thirdquartile": 490,
//                             "complete": 488,
//                             "error": 2,
//                             "unmute": 5,
//                             "start": 610,
//                             "pause": 51,
//                             "mute": 3,
//                             "resume": 41,
//                             "impression": 546
//                         }
//                     ],
//                     "region": "MH"
//                 }
//             ],
//             [
//                 {
//                     "result": [
//                         {
//                             "error": 7,
//                             "midpoint": 2,
//                             "impression": 8737,
//                             "pause": 2,
//                             "creativeview": 3613,
//                             "companionclicktracking": 257,
//                             "complete": 14564,
//                             "firstquartile": 2,
//                             "start": 16614
//                         }
//                     ],
//                     "region": "WB"
//                 },
//                 {
//                     "result": [
//                         {
//                             "impression": 1159,
//                             "error": 2,
//                             "complete": 1931,
//                             "start": 2191,
//                             "creativeview": 515,
//                             "companionclicktracking": 57
//                         }
//                     ],
//                     "region": "HR"
//                 },
//                 {
//                     "result": [
//                         {
//                             "impression": 4066,
//                             "start": 7504,
//                             "creativeview": 1943,
//                             "progress": 6,
//                             "firstquartile": 4,
//                             "midpoint": 6,
//                             "complete": 6491,
//                             "thirdquartile": 6,
//                             "companionclicktracking": 221
//                         }
//                     ],
//                     "region": "TN"
//                 },
//                 {
//                     "result": [
//                         {
//                             "thirdquartile": 6,
//                             "complete": 6926,
//                             "creativeview": 1938,
//                             "error": 7,
//                             "firstquartile": 10,
//                             "start": 7973,
//                             "impression": 4275,
//                             "progress": 46,
//                             "midpoint": 8,
//                             "companionclicktracking": 280
//                         }
//                     ],
//                     "region": "GJ"
//                 },
//                 {
//                     "result": [
//                         {
//                             "start": 7265,
//                             "firstquartile": 2,
//                             "thirdquartile": 2,
//                             "impression": 3831,
//                             "complete": 6408,
//                             "companionclicktracking": 116,
//                             "creativeview": 1246,
//                             "progress": 2,
//                             "error": 4,
//                             "midpoint": 2
//                         }
//                     ],
//                     "region": "TG"
//                 },
//                 {
//                     "result": [
//                         {
//                             "creativeview": 562,
//                             "companionclicktracking": 61,
//                             "error": 3,
//                             "complete": 2028,
//                             "impression": 1217,
//                             "start": 2305
//                         }
//                     ],
//                     "region": "UP"
//                 },
//                 {
//                     "result": [
//                         {
//                             "thirdquartile": 2,
//                             "error": 9,
//                             "start": 20259,
//                             "firstquartile": 2,
//                             "companionclicktracking": 555,
//                             "creativeview": 4312,
//                             "impression": 10861,
//                             "complete": 17758
//                         }
//                     ],
//                     "region": "KA"
//                 },
//                 {
//                     "result": [
//                         {
//                             "companionclicktracking": 380,
//                             "creativeview": 3359,
//                             "error": 24,
//                             "thirdquartile": 5,
//                             "impression": 7260,
//                             "midpoint": 5,
//                             "progress": 5,
//                             "complete": 12050,
//                             "firstquartile": 5,
//                             "start": 13745
//                         }
//                     ],
//                     "region": "DL"
//                 },
//                 {
//                     "result": [
//                         {
//                             "thirdquartile": 13,
//                             "companionclicktracking": 775,
//                             "firstquartile": 17,
//                             "impression": 16000,
//                             "complete": 26433,
//                             "start": 30211,
//                             "progress": 13,
//                             "midpoint": 14,
//                             "error": 19,
//                             "creativeview": 6915
//                         }
//                     ],
//                     "region": "MH"
//                 }
//             ],
//             [
//                 {
//                     "result": [
//                         {
//                             "complete": 821,
//                             "error": 1,
//                             "pause": 36,
//                             "impression": 877,
//                             "start": 942,
//                             "resume": 26,
//                             "thirdquartile": 821,
//                             "mute": 7,
//                             "unmute": 8,
//                             "firstquartile": 828,
//                             "midpoint": 821,
//                             "clicktracking": 5
//                         }
//                     ],
//                     "region": "DL"
//                 },
//                 {
//                     "result": [
//                         {
//                             "impression": 5,
//                             "complete": 5,
//                             "firstquartile": 5,
//                             "thirdquartile": 5,
//                             "start": 5,
//                             "midpoint": 5
//                         }
//                     ],
//                     "region": "RJ"
//                 },
//                 {
//                     "result": [
//                         {
//                             "firstquartile": 306,
//                             "mute": 2,
//                             "clicktracking": 2,
//                             "midpoint": 306,
//                             "resume": 5,
//                             "complete": 306,
//                             "pause": 10,
//                             "unmute": 2,
//                             "thirdquartile": 306,
//                             "start": 332,
//                             "impression": 317
//                         }
//                     ],
//                     "region": "WB"
//                 },
//                 {
//                     "result": [
//                         {
//                             "resume": 39,
//                             "impression": 279,
//                             "thirdquartile": 267,
//                             "error": 1,
//                             "firstquartile": 268,
//                             "unmute": 1,
//                             "midpoint": 268,
//                             "pause": 40,
//                             "complete": 267,
//                             "start": 297
//                         }
//                     ],
//                     "region": "TN"
//                 },
//                 {
//                     "result": [
//                         {
//                             "mute": 1,
//                             "complete": 195,
//                             "impression": 203,
//                             "midpoint": 196,
//                             "resume": 2,
//                             "firstquartile": 199,
//                             "unmute": 2,
//                             "pause": 4,
//                             "start": 218,
//                             "thirdquartile": 195
//                         }
//                     ],
//                     "region": "UP"
//                 },
//                 {
//                     "result": [
//                         {
//                             "complete": 213,
//                             "thirdquartile": 213,
//                             "resume": 3,
//                             "impression": 227,
//                             "firstquartile": 214,
//                             "start": 255,
//                             "midpoint": 215,
//                             "pause": 6
//                         }
//                     ],
//                     "region": "HR"
//                 },
//                 {
//                     "result": [
//                         {
//                             "midpoint": 574,
//                             "mute": 3,
//                             "impression": 609,
//                             "pause": 27,
//                             "error": 1,
//                             "unmute": 5,
//                             "start": 677,
//                             "resume": 17,
//                             "firstquartile": 575,
//                             "thirdquartile": 574,
//                             "complete": 574
//                         }
//                     ],
//                     "region": "KA"
//                 },
//                 {
//                     "result": [
//                         {
//                             "clicktracking": 1,
//                             "firstquartile": 139,
//                             "complete": 139,
//                             "thirdquartile": 139,
//                             "resume": 5,
//                             "start": 161,
//                             "unmute": 2,
//                             "pause": 10,
//                             "impression": 149,
//                             "midpoint": 139,
//                             "mute": 2
//                         }
//                     ],
//                     "region": "GJ"
//                 },
//                 {
//                     "result": [
//                         {
//                             "midpoint": 305,
//                             "clicktracking": 3,
//                             "firstquartile": 309,
//                             "start": 362,
//                             "thirdquartile": 305,
//                             "pause": 15,
//                             "error": 1,
//                             "complete": 306,
//                             "resume": 9,
//                             "impression": 329
//                         }
//                     ],
//                     "region": "MH"
//                 }
//             ],
//             [
//                 {
//                     "result": [
//                         {
//                             "impression": 1
//                         }
//                     ],
//                     "region": "TN"
//                 },
//                 {
//                     "result": [
//                         {
//                             "impression": 1,
//                             "creativeview": 1,
//                             "complete": 2,
//                             "start": 2
//                         }
//                     ],
//                     "region": "WB"
//                 },
//                 {
//                     "result": [
//                         {
//                             "complete": 4,
//                             "start": 2,
//                             "creativeview": 1,
//                             "impression": 3,
//                             "companionclicktracking": 1
//                         }
//                     ],
//                     "region": "GJ"
//                 },
//                 {
//                     "result": [
//                         {
//                             "start": 2,
//                             "impression": 1,
//                             "complete": 2,
//                             "creativeview": 2,
//                             "companionclicktracking": 2
//                         }
//                     ],
//                     "region": "KA"
//                 },
//                 {
//                     "result": [
//                         {
//                             "complete": 2,
//                             "impression": 1
//                         }
//                     ],
//                     "region": "DL"
//                 },
//                 {
//                     "result": [
//                         {
//                             "impression": 6,
//                             "creativeview": 1,
//                             "complete": 10,
//                             "start": 4
//                         }
//                     ],
//                     "region": "MH"
//                 }
//             ]
//         ]
//     }
// ]
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

// function datamaker(aaa,idrequ){
//     var super11 = [];
//     aaa.map(part => {
//         super11 = super11.concat(part)
//     })
//     var groups = {};
//     var id = idrequ;
//     for (var i = 0; i < super11.length; i++) {
//     var groupName = super11[i][id];
//     if (!groups[groupName]) {
//         groups[groupName] = [];
//     }
//     groups[groupName].push(super11[i].result);
//     }
//     myArray = [];
//     for (var groupName in groups) {
//     myArray.push({[id]: groupName, result: groups[groupName]});
//     }
//     // console.log(myArray[0].result)
//     myArray.map(esc=>{
//         // var result = [];
//         const sumArray = arr => {
//             const res = {};
//             for(let i = 0; i < arr.length; i++){
//                 Object.keys(arr[i]).forEach(key => {
//                     res[key] = (res[key] || 0) + arr[i][key];
//                 });
//             };
//             return res;
//         };
//         // console.log(esc)
//         var resultDes = [];
//         esc.result.map(eac=>{
//             resultDes = resultDes.concat(eac)
//         })
//         esc.result = sumArray(resultDes)
//         // console.log(esc.result)
//     })
//     return myArray;
// }
// reports = reports.map(det => {
//     var dema = datamaker(det.region,'region')
//     det.region = dema
//     return det;
// })
// console.log(reports[0].region[0])