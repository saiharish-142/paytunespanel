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
                "date":date,
                "type":{$in:["impression","complete","click","companionclicktracking","clicktracking"]}
            } },
            { $group:{
                _id: {date:"$date" ,campaignId:"$campaignId" ,appId: "$appId",region :"$region",type:"$type"},count:{$sum:1}
            }},{$group:{
                _id:{date:"$_id.date" ,campaignId:"$_id.campaignId" ,appId:"$_id.appId",type:"$_id.type"} , region:{$push:"$_id.region"}, count:{$sum:"$count"}
            }},{$group:{
                _id:{date:"$_id.date" ,campaignId:"$_id.campaignId" ,appId:"$_id.appId"}, type:{$push:{type:"$_id.type",count:"$count"}}, region:{$push:"$region"}
            }},{$group:{
                _id:{date:"$_id.date" ,campaignId:"$_id.campaignId"}, report:{$push:{appId:"$_id.appId", type:"$type", region:"$region"}}
            }},{$project:{
                date: "$_id.date",campaignId:"$_id.campaignId", report:"$report", _id:0
            }}
        ])
        .then(result=>{
            data = result;
            data.map((det)=>{
                console.log(det.campaignId)
                det.report.map(camrepo=>{
                    var resregion = [].concat.apply([], camrepo.region);
                    resregion = [...new Set(resregion)];
                    camrepo.region = resregion
                })
            })
            var compr = [];
            for(var i=0; i<data.length; i++ ){
                const Report = mongoose.model('Report')
                var cam = data[i].campaignId ;
                var da = data[i].date ;
                for(var j=0;j<data[i].report.length;j++){
                    var impre = 0;
                    var compl = 0;
                    var click = 0;
                    data[i].report[j].type.map(repo => {
                        if(repo.type==='impression'){
                            impre += repo.count
                        }
                        if(repo.type==='complete'){
                            compl += repo.count
                        }
                        if(repo.type==='companionclicktracking'){
                            click += repo.count
                        }
                        if(repo.type==='clicktracking'){
                            click += repo.count
                        }
                        if(repo.type==='click'){
                            click += repo.count
                        }
                    })
                    const report = new Report({
                        date:da,
                        Publisher:data[i].report[j].appId,
                        campaignId:cam,
                        impressions:impre,
                        complete:compl,
                        clicks:click,
                        region:data[i].report[j].region,
                        spend:impre,
                        avgSpend:impre
                    })
                    report.save()
                    .then(result => {
                        compr.push(result)
                        console.log("completed")
                    })
                    .catch(err => console.log(err))
                }
            }
            // res.json(compr)
        })
        .catch(err => console.log(err))
}

var currentTime = new Date();
var currentOffset = currentTime.getTimezoneOffset();
var ISTOffset = 330;   // IST offset UTC +5:30 
var ISTTime = new Date(currentTime.getTime() + (ISTOffset*2 + currentOffset -5)*60000);
console.log(ISTTime)

// var adddata = [
//     {
//         "appIds": [
//             {
//                 "ids": [
//                     "5fa45085075398084712b29b",
//                     "5fa45086075398084712b47b",
//                     "5fa45085075398084712b21b",
//                     "5fa45084075398084712b15d"
//                 ]
//             }
//         ],
//         "typeValues": [
//             {
//                 "appId": "5fa45084075398084712b15d",
//                 "res": [
//                     {
//                         "type": "click",
//                         "count": 22
//                     },
//                     {
//                         "type": "impression",
//                         "count": 70215
//                     }
//                 ]
//             },
//             {
//                 "appId": "5fa45086075398084712b47b",
//                 "res": [
//                     {
//                         "type": "impression",
//                         "count": 72
//                     }
//                 ]
//             },
//             {
//                 "appId": "5fa45085075398084712b21b",
//                 "res": [
//                     {
//                         "type": "impression",
//                         "count": 13
//                     }
//                 ]
//             },
//             {
//                 "appId": "5fa45085075398084712b29b",
//                 "res": [
//                     {
//                         "type": "impression",
//                         "count": 1
//                     }
//                 ]
//             }
//         ],
//         "typebyRegion": [
//             {
//                 "appId": "5fa45084075398084712b15d",
//                 "res": [
//                     {
//                         "region": "MH",
//                         "result": [
//                             {
//                                 "type": "click",
//                                 "count": 22
//                             },
//                             {
//                                 "type": "impression",
//                                 "count": 70215
//                             }
//                         ]
//                     }
//                 ]
//             },
//             {
//                 "appId": "5fa45085075398084712b21b",
//                 "res": [
//                     {
//                         "region": "MH",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 13
//                             }
//                         ]
//                     }
//                 ]
//             },
//             {
//                 "appId": "5fa45086075398084712b47b",
//                 "res": [
//                     {
//                         "region": "MH",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 72
//                             }
//                         ]
//                     }
//                 ]
//             },
//             {
//                 "appId": "5fa45085075398084712b29b",
//                 "res": [
//                     {
//                         "region": "MH",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     }
//                 ]
//             }
//         ],
//         "typeByLan": [
//             {
//                 "appId": "5fa45084075398084712b15d",
//                 "res": [
//                     {
//                         "language": "en",
//                         "result": [
//                             {
//                                 "type": "click",
//                                 "count": 22
//                             },
//                             {
//                                 "type": "impression",
//                                 "count": 70215
//                             }
//                         ]
//                     }
//                 ]
//             },
//             {
//                 "appId": "5fa45085075398084712b21b",
//                 "res": [
//                     {
//                         "language": "en",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 13
//                             }
//                         ]
//                     }
//                 ]
//             },
//             {
//                 "appId": "5fa45086075398084712b47b",
//                 "res": [
//                     {
//                         "language": "en",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 72
//                             }
//                         ]
//                     }
//                 ]
//             },
//             {
//                 "appId": "5fa45085075398084712b29b",
//                 "res": [
//                     {
//                         "language": "en",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     }
//                 ]
//             }
//         ],
//         "typeByOSV": [
//             {
//                 "appId": "5fa45084075398084712b15d",
//                 "res": [
//                     {
//                         "osVersion": "5.0",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 13
//                             }
//                         ]
//                     },
//                     {
//                         "osVersion": "7.0",
//                         "result": [
//                             {
//                                 "type": "click",
//                                 "count": 1
//                             },
//                             {
//                                 "type": "impression",
//                                 "count": 2985
//                             }
//                         ]
//                     },
//                     {
//                         "osVersion": "7.1.1",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1288
//                             }
//                         ]
//                     },
//                     {
//                         "osVersion": "6.0",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 751
//                             }
//                         ]
//                     },
//                     {
//                         "osVersion": "10",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 33836
//                             },
//                             {
//                                 "type": "click",
//                                 "count": 6
//                             }
//                         ]
//                     },
//                     {
//                         "osVersion": "6.0.1",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 2205
//                             }
//                         ]
//                     },
//                     {
//                         "osVersion": "5.1",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 422
//                             }
//                         ]
//                     },
//                     {
//                         "osVersion": "4.4.4",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 20
//                             }
//                         ]
//                     },
//                     {
//                         "osVersion": "5.0.1",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 11
//                             }
//                         ]
//                     },
//                     {
//                         "osVersion": "4.2.2",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "osVersion": "8.0.0",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1756
//                             },
//                             {
//                                 "type": "click",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "osVersion": "8.1.0",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 8253
//                             },
//                             {
//                                 "type": "click",
//                                 "count": 3
//                             }
//                         ]
//                     },
//                     {
//                         "osVersion": "5.1.1",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 737
//                             }
//                         ]
//                     },
//                     {
//                         "osVersion": "7.1.2",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1434
//                             }
//                         ]
//                     },
//                     {
//                         "osVersion": "11",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 609
//                             }
//                         ]
//                     },
//                     {
//                         "osVersion": "9",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 15814
//                             },
//                             {
//                                 "type": "click",
//                                 "count": 11
//                             }
//                         ]
//                     },
//                     {
//                         "osVersion": "4.4.2",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 26
//                             }
//                         ]
//                     },
//                     {
//                         "osVersion": "5.0.2",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 54
//                             }
//                         ]
//                     }
//                 ]
//             },
//             {
//                 "appId": "5fa45085075398084712b21b",
//                 "res": [
//                     {
//                         "osVersion": "10",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 5
//                             }
//                         ]
//                     },
//                     {
//                         "osVersion": "9",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 7
//                             }
//                         ]
//                     },
//                     {
//                         "osVersion": "8.1.0",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     }
//                 ]
//             },
//             {
//                 "appId": "5fa45086075398084712b47b",
//                 "res": [
//                     {
//                         "osVersion": "9",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 15
//                             }
//                         ]
//                     },
//                     {
//                         "osVersion": "8.1.0",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 6
//                             }
//                         ]
//                     },
//                     {
//                         "osVersion": "7.0",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 6
//                             }
//                         ]
//                     },
//                     {
//                         "osVersion": "7.1.1",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "osVersion": "7.1.2",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 2
//                             }
//                         ]
//                     },
//                     {
//                         "osVersion": "5.1",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 2
//                             }
//                         ]
//                     },
//                     {
//                         "osVersion": "8.0.0",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 10
//                             }
//                         ]
//                     },
//                     {
//                         "osVersion": "5.1.1",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "osVersion": "6.0",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "osVersion": "10",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 28
//                             }
//                         ]
//                     }
//                 ]
//             },
//             {
//                 "appId": "5fa45085075398084712b29b",
//                 "res": [
//                     {
//                         "osVersion": "10",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     }
//                 ]
//             }
//         ],
//         "typeByPhModel": [
//             {
//                 "appId": "5fa45084075398084712b15d",
//                 "res": [
//                     {
//                         "phoneModel": "CPH1979",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "X625D",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 9
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "A3000 (3)",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 10
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "Aqua Selfie",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 2
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "Q4002",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 2
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-A805F",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 14
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "CPH1877",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 11
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-G6100",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 6
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "RMX1807",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 75
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-G715FN",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "Moto G (3rd Gen)",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 22
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-A707F",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 172
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "M2007J20CG",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 23
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "CP8298 I00",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 10
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "A7000-a",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 3
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "Ls-4006",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-J610F",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 35
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "KC2j",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 4
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "One Action",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 21
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-M205F",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 403
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-E700H",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 8
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "HS2",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 12
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-A505F",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1120
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-G980F",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 63
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "L38111",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 4
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "1 Plus",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 3
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-N900T",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "1725",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 4
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "MED-LX9",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 12
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "Z61P",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-J210F",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 272
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "A7010a48",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 19
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "ZB555KL (X00PD)",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 30
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "X41 Plus",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-P550",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 4
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "A3010 (3T)",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 2
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-G960U1",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 27
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "PRA-LA1",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 7
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "CPH1919",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 20
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-G9287C",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "Q452",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "CLT-L04",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "GT-I9060",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-N950F",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 208
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "6.1 Plus",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 207
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "Note 7",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 283
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-A600F",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 2
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "CE9",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-T870",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "X608",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 2
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-A105F",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 371
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-N950U",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 4
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "Redmi Note 4X",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "INE-LX1",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 2
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "L18021",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 2
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SNE-LX1",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 5
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "DLI-L42",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "Y55L (1603)",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 26
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-G9550",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 4
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "Note 9 Pro Max",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 357
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-A510F",
//                         "result": [
//                             {
//                                 "type": "click",
//                                 "count": 1
//                             },
//                             {
//                                 "type": "impression",
//                                 "count": 50
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "DUA-AL00",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "CPH1819",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 179
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "HM Note 1LTE",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "Mi 10",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 6
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "YU5011",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 2
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "Mi Max 2",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 84
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-G610F",
//                         "result": [
//                             {
//                                 "type": "click",
//                                 "count": 1
//                             },
//                             {
//                                 "type": "impression",
//                                 "count": 1216
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "CPH1923",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 91
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-C5010",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 4
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "PB2-650M",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 6
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "Desire 828 Dual Sim",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 5
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "1816",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 32
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "1951",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 201
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "CPH1945",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 161
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "6535LVW",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "Le X520",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "GT-I9060I",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 2
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "One Macro",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 27
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-N975F",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 177
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-N9750",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 11
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "VNS-L21",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "PAR-AL00",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "1917",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 96
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "Moto G Play",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 61
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "X660",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "ZE520KL (Z017DA)",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 2
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "1811",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 97
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "L38043",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 34
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "HM Note 1S",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 4
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "X655F",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "Air",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 4
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "E2363",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 2
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "CPH1969",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 251
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "CPH2035",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 49
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "ZE550KL (Z00LD)",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 5
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-N920I",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 2
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "Z61",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "1727",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 79
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "rmx2161",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 38
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-T285YD",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 7
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-N920G",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 8
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "G011A",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 52
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "1718",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 127
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "E483",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 3
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "Che1-L04",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "RMX2030",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 107
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "A3",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 370
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-G935W8",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 5
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-J510GN",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "GT-I9505",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 5
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "A2003",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 51
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "V1Max",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-T380",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 2
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "K8 Note",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 57
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "RMX2002",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 43
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "KB2",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 10
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "1713",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 129
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "JSN-L42",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 97
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-T580",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 6
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-T385",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 11
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "7.1",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 33
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-A750GN",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "K520",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-J610F (Android 4.2.2)",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 47
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "VEN-L22",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "AUM-AL20",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 28
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "S1",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "Redmi Note 3",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 279
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-N9208",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 7
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "KC1",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 6
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "YAL-AL00",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 9
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "YU4711",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-N970F",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 71
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "L5502",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 6
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "Mi A1",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 421
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-N970U1",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 3
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "X627V",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 5
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "1920",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 154
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "COR-AL00",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 36
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-T515",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 3
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "1716",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 168
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "i3",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 10
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "Moto G4",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 198
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "TA-1004",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 25
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "A2010-a",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "Note 7 Pro",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1545
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "K50a40",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 4
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "JAT-L41",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 9
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-J510FN",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 20
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "Redmi 3s",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 193
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "1804",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 346
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "LM-X210",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 4
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-G600FY",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 79
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "GM1910",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 3
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "1907",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 287
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "Redmi 6",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 219
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "L5503",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 6
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-G965F",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 380
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "Moto X4",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 50
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "XT1033",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 8
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "L5503L",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "1611",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 76
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "ANE-LX1",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "CPH1821",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 31
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "HRY-AL00",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 14
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "A6020a46",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 38
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-A305F",
//                         "result": [
//                             {
//                                 "type": "click",
//                                 "count": 1
//                             },
//                             {
//                                 "type": "impression",
//                                 "count": 448
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "K53a48",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 21
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-A800F",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 8
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-J330G",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "CPH1903",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "RMX1921",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 197
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "1001DE",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-T595",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "X1 Dual",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "BBF100-6",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "TB-8304F1",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 4
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-N920C",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 10
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-A715F",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 246
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "Redmi Note 5",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 828
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-C701F",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 129
//                             },
//                             {
//                                 "type": "click",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "RMX2001",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 88
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "L39051",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 2
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-J200F",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-G960U",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 2
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-G975U1",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 3
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "CPH1938",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 61
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-G920I",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 13
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "IN5",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 19
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "Y3",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 161
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "1915",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 105
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "One Vision",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 12
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-G9500",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 6
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "IN2",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 2
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "RMX2061",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 53
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "M250",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 3
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "CM3331",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 2
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "M7 Power",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-J250F",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 115
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "RMX2151",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 53
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-G900F",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 3
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "E2115",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "LS-4008",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "F5122",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 4
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "ZC553KL (X00DDB)",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 2
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "CPH1931",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 138
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "LM-G850",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 57
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "ZS620KL (Z01RD)",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 22
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "Pixel 3",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 14
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "Le X526",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 28
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "1818",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 332
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "G8",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 6
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "Redmi Note 6 Pro",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 805
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "WAS-LX1A",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 8
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "LM-G810",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 3
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-A730F",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 152
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "PRA-AL00X",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 11
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "H810",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 2
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "Pixel V2",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "RMX1901",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 92
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-J111F",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 2
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "Slide Nimble 4GF",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "Marathon M5 Lite",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "D10W",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 7
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "COL-AL10",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 21
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "8.1",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 42
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "ALP-L29",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-C7000",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 2
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "i7",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "A44 Pro",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-G550FY",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 137
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-N9005",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 6
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "YAL-L21",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 5
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "NX569J",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "K8 Plus",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 101
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "XT1663",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 6
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-A515F",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 387
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "RMX1945",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 13
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "XT1562",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 7
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "DUK-L09",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 15
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "Eluga A4",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 4
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "TIT-AL00",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 7
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-A102U",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-G988B",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 16
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-G531F",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 8
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "XT1793",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 49
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "RMX1831",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 73
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "CPH1725",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 54
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "A37fw",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 89
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "max",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 2
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-N960U1",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 6
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "ZC520TL (X008DA)",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 6
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "Q372",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "RNE-L22",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 20
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "2004",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 4
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "F9",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 6
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "NX629J",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 2
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "A6013",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 17
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "CPH1809",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 163
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "Redmi Note 8",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 697
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "Moto G6 Plus",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 13
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "P85",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "P1",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 5
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-G611F",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 142
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "1904",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 266
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "LS-5018",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 8
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "Y55S (1610)",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 70
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "KE6j",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "M700",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 33
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "Moto G5 Plus",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 251
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "E4815",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 2
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-A315F",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 300
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-A500G",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 35
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "1805",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 35
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "Z66",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "Eluga Arc 2",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "CPH1827",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 21
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "Mi 9 Lite",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "BKL-L09",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 26
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "HMA-AL00",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "RMX2040",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 11
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-N950U1",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 3
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-F700F",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 2
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-G977N",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "CM5001",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "YU5530",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 2
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-G960W",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 7
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "5.3",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 19
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "X650C",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 18
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "3505i",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 3
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "CPH1823",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 335
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "Pixel 3a",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 45
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-A505U1",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "CPH1911",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 244
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-N770F",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 211
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "VOG-L29",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 12
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "1201",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 5
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "RMX1833",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 63
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-M013F",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 32
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "U1",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 2
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "Note 8 Pro",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 997
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-G965U1",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "V2025",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 75
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-A307GN",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 3
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "NEO-L29",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 2
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "ZC521TL (X00GD)",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 4
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "1906",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 74
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "ZB630KL (X01BDA)",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 81
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "8A Dual",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 234
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-G920P",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 4
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "LLD-AL10",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 83
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-G780F",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 16
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "BND-AL10",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 54
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "Moto C Plus",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 83
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "X682B",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 5
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-J260G",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 48
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "Y51",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "X230",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 5
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "CPH2127",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 109
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-M307F",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1102
//                             },
//                             {
//                                 "type": "click",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "Q4202",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 3
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "Moto E5",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 7
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "Redmi 5A",
//                         "result": [
//                             {
//                                 "type": "click",
//                                 "count": 1
//                             },
//                             {
//                                 "type": "impression",
//                                 "count": 484
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "MT7-L09",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "A1 Plus",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 4
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "IF9031",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 3
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "A501CG (T00J)",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 4
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "V3 Max",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 14
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-N9500",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 4
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "EVR-N29",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 5
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "A093",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-M105F/DS",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 117
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "E6553",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "C1",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "ZC551KL (Z01BDB)",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 3
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "P7 Max",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 5
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-G925F",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 4
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "Nexus 6",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "GM1911",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 471
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-G5700",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 6
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "CPH1717",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 22
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "IF9001",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 3
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "Pixel 3a XL",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 16
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "ZE551ML (Z00AD)",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 4
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "ZS620KL (Z01RS)",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "Moto E4 Plus",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 127
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "S6s",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "generic",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 15
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-J510F",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 2
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "One M8",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "CPH1723",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 75
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "K332",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 6
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "Note 9 Pro",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 276
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-N750",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 2
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "BLA-L29",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 8
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "IN2021",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 58
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "LYA-L29",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 3
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "Z90",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "ZS570KL (Z016D)",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 3
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "IN1",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 6
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-T813",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "TB3-X70L",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 4
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "L19041",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "HD1911",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 60
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-T355Y",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 11
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "IF9029",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "ID3K",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "RMX1941",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 78
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "TB-X505F",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "BND-L21",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "1726",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 130
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-G770F",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 105
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "X605",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 15
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-G950U",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 10
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "LB8a",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-J600G",
//                         "result": [
//                             {
//                                 "type": "click",
//                                 "count": 1
//                             },
//                             {
//                                 "type": "impression",
//                                 "count": 530
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "P5W",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "X572",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 18
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-A507FN",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 518
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "YT-X705X",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 4
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "HM2014818",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 18
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "TB3-850F",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 3
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-G532G",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 6
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "RMX1851",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 266
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-J500F",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 39
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "A6010",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1353
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "1724",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 88
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "BLN-L24",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "Moto G7",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 9
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "1807",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 160
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "ZA550KL (X00RD)",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 19
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-M017F",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 27
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "RMX2086",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 14
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "CPH2119",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 92
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "Desire 628 dual sim",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 3
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-J710F",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 129
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "A6600d40",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 10
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "RMX1811",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 54
//                             },
//                             {
//                                 "type": "click",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "Redmi 8A",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 111
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "ZU680KL (A001)",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 3
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "AGS2-L09",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 4
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "Desire 820q",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "RMX2193",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 26
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "HD1901",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 932
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "RMX1931",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 60
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "2PVG100",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 2
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "M2006C3LII",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 72
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-A260G",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 89
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "1921",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 61
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "Q402 Plus",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 15
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "Redmi 4",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 586
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-A307FN",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 469
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "TB3-730X",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "RMX1825",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 150
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "X655D",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "Pioneer P5L",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 5
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "S610",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "RMX1971",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 227
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "CPH1729",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 242
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "1819",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 119
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "1902",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 183
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-G985F",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 155
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "Le X509",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 8
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "E",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 4
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "Le X507",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 25
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-F916B",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 29
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-M305F",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 631
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "P1a42",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 3
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "AGS2-AL00HN",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 2
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-G973F",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 172
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "ID6",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 5
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-A405FN",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "RMX2050",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 17
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "A33f",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 31
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "K8",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 11
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "RMX2180",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 9
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "A2016a40",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-A910F",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 55
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "Moto G5S Plus",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 441
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-A605F",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 10
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "CPH1609",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 183
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "Redmi Y2",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 415
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "Moto G5",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 52
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "Mi Max",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 39
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "PB1-750M",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 5
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "4.2",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 40
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "CPH2001",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 320
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "1909",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 108
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-J737A",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-N915G",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 3
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "POCO F1",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 454
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "1935",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 94
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-F900F",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 2
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-J120G",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 5
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "2.3",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 7
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "Note 7S",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 585
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "X652",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "Redmi Y1",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 163
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "L6005",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 2
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "7.2",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 34
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-A705GM/DS",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 220
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "ZD553KL (X00LD)",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "RMX1925",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 60
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "XT1754",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 2
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "1806",
//                         "result": [
//                             {
//                                 "type": "click",
//                                 "count": 1
//                             },
//                             {
//                                 "type": "impression",
//                                 "count": 95
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "1861",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 5
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-G973U",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "IN2011",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 119
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "Moto G8 Plus",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 18
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-T815Y",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 4
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "LLD-AL20",
//                         "result": [
//                             {
//                                 "type": "click",
//                                 "count": 1
//                             },
//                             {
//                                 "type": "impression",
//                                 "count": 94
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-G973U1",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 8
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "TA-1053",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 20
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-T510",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 11
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-G965W",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 7
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "A1601",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 316
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "A6000",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1280
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-M405F",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 113
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "RMX1911",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 140
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "BKK-AL10",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 21
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-A520F",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 62
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "CPH1871",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 2
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "One",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 9
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "L38011",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "F103 Pro",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 4
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "V5 (1601)",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 102
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "Y21L",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 21
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "A1",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 20
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "G3226",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 8
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "RMX2027",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 104
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "JKM-LX2",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 2
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-A700FD",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 12
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "K420",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 5
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-J701F",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 382
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-G890A",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "CPH1951",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 2
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "CPH1879",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 24
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "Moto G7 Power",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 28
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "3600I",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 5
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "Eluga I8",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 2
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "A3003 (3)",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 416
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "GM1901",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1073
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-A105G",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 5
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-G955U",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 10
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-G988N",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "Le X821",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 4
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-T585",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 4
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-G935U",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 2
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-G935T",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "RNE-L21",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 2
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "K9 Viraat",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 5
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-G900T",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "Redmi 5",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 353
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "Moto G7 Play",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 3
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "1820",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 297
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "1815",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 27
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "LM-V405",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 3
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "F3116",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 2
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "WAS-LX2",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 6
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "Z978",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 3
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "X604",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 3
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "RMX2103",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 13
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "RMX2020",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 22
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "HRY-AL00Ta",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 17
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "RMX1801",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 284
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "R7kf",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 2
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "XT1068",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 3
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "Redmi 8",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 353
//                             },
//                             {
//                                 "type": "click",
//                                 "count": 4
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "LM-G710",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 20
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "1802",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 107
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "RMX1805",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 169
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "XT1706",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 30
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "F1f",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 10
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-A500F",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "S6 Pro",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 10
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "Mi 9 SE",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 4
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "BND-L34",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 3
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "Mi Play",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 2
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "CPH2109",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 23
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "BB4k",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 2
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "Mi A2",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 285
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "1908",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 17
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "CLT-AL00",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "K33a42",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 89
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "XT1710-01",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 6
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "Eluga X1",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 7
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-A710F",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 54
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "P91",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 4
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-G900FD",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "V2029",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 41
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "1814",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 121
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "1938",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 68
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "D820",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 3
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "Redmi Note 4",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1834
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "Desire 12",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 5
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-A605G",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 178
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "Aqua Pro 4G",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-G950U1",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 24
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "MAR-LX1M",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 5
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-G920F",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 5
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-J500H",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "A23",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-N900W8",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 3
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "T5524",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 4
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "6.1",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 69
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "M2004J19PI",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 73
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "1919",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 123
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-G975U",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-T561",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-T865",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "GM1917",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-A920F",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 85
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "STV100-4",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 2
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "One Fusion Plus",
//                         "result": [
//                             {
//                                 "type": "click",
//                                 "count": 1
//                             },
//                             {
//                                 "type": "impression",
//                                 "count": 83
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-F415F/DS",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 162
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-N960U",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "TA-1080",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 10
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "JKM-LX1",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 14
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-A107F",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 196
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-G9600",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 9
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-N986B",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 68
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "M2004J19C",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 202
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "TB-X304L",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 7
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "GT-I9500",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 4
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "LND-AL30",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 31
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "IT-KSA0066",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 2
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "Redmi Go",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 19
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "MI 3W",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 2
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-G928G",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 7
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "D335",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 4
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "ZC550KL (Z010D)",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 6
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-G360H",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 2
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "CPH1859",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 401
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "D2302",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 2
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "NX549J",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-M107F/DS",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 87
//                             },
//                             {
//                                 "type": "click",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "ZS630KL (I01WD)",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 10
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "Desire 820G  Dual SIM",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "RMX2076",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-G920T",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 2
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "KIW-L22",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 6
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "CPH1861",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 27
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "1812",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 14
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "Pixel 4a",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 8
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-G930F",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 72
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "Redmi Note 5 Pro",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1850
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-A300H",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 3
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-G9350",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 2
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "K20 Pro",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 156
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "X680D",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "CPH2015",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 156
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-J730F",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 12
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "Fire HD 8 (2017)",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "PCT-AL10",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 13
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-A217F",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 255
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "1609",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 79
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "1933",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 107
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "S95 Pro",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 2
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "Pixel 4",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 4
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-A7050",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 5
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-G970F",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 39
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-G935F",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 153
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "K220",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 6
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-J600GF",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 59
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "KB3",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 3
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "Mi 5",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 3
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "CPH1707",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 2
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-N980F",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 50
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "M2 Pro",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 106
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "LM-X130IM",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 6
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "RMX1992",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 93
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "M5",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "RS988",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "M812i",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "K20",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 75
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "CPH1917",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 11
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-G885F",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 68
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "M350",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "JKM-AL00a",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 5
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "G3416",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 4
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-G955W",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 21
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "ANE-AL00",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 18
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "RMX2189",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 8
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "GT-I9300I",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "V3",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 36
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "ZB633KL (X01AD)",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 41
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "E6883",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 4
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "ZE520KL (Z017DB)",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 3
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "Eluga Icon",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 4
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-A505W",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "TB-8505X",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 2
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "1803",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 138
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-P555",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 2
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-G532F",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 2
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "A7020a48",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 161
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "X603",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 6
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "M1805D1ST",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 603
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "I003DD",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "XT1022",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 3
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "2.2 (2019)",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 22
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "7 Plus",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 24
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "CPH1613",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 56
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "M1903F11G",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "P2a42",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 17
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-A207F",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 198
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "G3223",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 3
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "CPH1901",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 201
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "A6020a40",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 20
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "AC2001",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 618
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-A705MN",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "CPH1701",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 265
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "Moto G8 Power Lite",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 25
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "CPH1727",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 24
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "PB2-670M",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 4
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-N910G",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 2
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "RMX2185",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 34
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "3.1",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 27
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "MHA-AL00",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "Redmi Y1 Lite",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 60
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "AGS2-W09",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "X573",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 7
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "1901",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 193
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "A2005",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 3
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-A600G",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 39
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-G615FU",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 65
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "Hot 4 Pro",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 2
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-J260GU",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 13
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "Pixel 4 XL",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 6
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "X573B",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 2
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "V1",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 3
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-G950W",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "ATU-L11",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-G5510",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "Le X522",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 2
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-T331",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "MotoG3-TE",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 16
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "MAR-LX2",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 2
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-C900F",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 212
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "D",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 9
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-J810GF",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 29
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-J810G",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 385
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "CPH1909",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 372
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "X5515F",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-J730GM",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 281
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "1850",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 2
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-G955F",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 218
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "P7",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 20
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "T5211",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 6
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-J530F",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 4
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-N960F",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 226
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-G7202",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 4
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-G960F",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 260
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "1714",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 80
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-G975F",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 269
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "TB-7504X",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "V2027",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 38
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-M115F",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 270
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-T720",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 2
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "5.1",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 5
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "CPH1893",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 27
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "X682C",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 10
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "HS3",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 5
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-G9650",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 2
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "A44 Power",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "Redmi 6A",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 375
//                             },
//                             {
//                                 "type": "click",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "Y51L",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 46
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "CPH1851",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 4
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "CPH1937",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 372
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "TB-8504X",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 6
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "FRD-L02",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-G611FF",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 34
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "Z80",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "RMX2170",
//                         "result": [
//                             {
//                                 "type": "click",
//                                 "count": 1
//                             },
//                             {
//                                 "type": "impression",
//                                 "count": 34
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "X625C",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 2
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "IA5",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 4
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-G955U1",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 8
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "Pixel XL",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 8
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "JSN-L22",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 3
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "P1ma40",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 16
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "Slide Brisk 4G2",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 2
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "CPH1989",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 106
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "KD7",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 2
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-E500H",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 8
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "RMX1827",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 64
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "A5010",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 650
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "X652B",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 4
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-G950F",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 323
//                             },
//                             {
//                                 "type": "click",
//                                 "count": 2
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "U11",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 2
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "ZB602KL (X00TD)",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 389
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-J415F",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 90
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-J400F",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 118
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "NXT-AL10",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 2
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "H900",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-G928C",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 3
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "Z2132",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 20
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-A205F",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 271
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-P610",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 3
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-T285",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 2
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "1801",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 34
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-J710FN",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 36
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-N900",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-G7102",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 9
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "CPH1955",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 23
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "E1003",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 16
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "CPH1853",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 39
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "KOB-L09",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "Mi 8 Lite",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 2
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-J320A",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "1916",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 121
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "H4331",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 2
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-G986W",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "Life One X2",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "Moto Z3 Play",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 4
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "G2299",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 15
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "2",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 2
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "XT1635-02",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 14
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-G386T",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 5
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "1",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 8
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "XT1575",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 4
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "M2006C3LI",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 6
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "Moto G6 Play",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 9
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "C3",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 9
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "BBB100-7",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 4
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "LM-Q710 (FGN)",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-J200H",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "Moto E7 Plus",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 27
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "CPH2023",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "A1 lite",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "G",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 11
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "Z1",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 6
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-M515F",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 357
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "3.1 Plus",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 36
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-G930W8",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 3
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-G570F",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 278
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "3.2",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 18
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-T295",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 7
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "Poco X2",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 110
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "7A",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 281
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "LC8",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "Y15S",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 2
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "CPH2061",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 90
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-J700F",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 263
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "Moto E2",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 3
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-J320F",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 25
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "IN6",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 6
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "A37f",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 119
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "Z91",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 3
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-A720F",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 11
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "A6003",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 15
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "One Power",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 130
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-G986B",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 2
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "Moto E6s",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 38
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "TA-1021",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 43
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-A800I",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 4
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-A750F",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 401
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "Titanium Frames S7",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 2
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-J200G",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 143
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "Mi 8 SE",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-M215F",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 851
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "KB2001",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 153
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "A5000",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 699
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "Bharat 5 Plus",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 2
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "K373",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "Desire 526G Plus",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 2
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "Iris 870",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 2
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "Moto E4",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 18
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "Mega",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "BLN-L22",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 34
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "G013C",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 10
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-P585",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 2
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "2PS6500",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "Q4311",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "D2502",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "CP8676 I02",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 7
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-G9730",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 3
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "Pixel",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 8
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-G973W",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "1851",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 105
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-G615F",
//                         "result": [
//                             {
//                                 "type": "click",
//                                 "count": 1
//                             },
//                             {
//                                 "type": "impression",
//                                 "count": 438
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-G530H",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 4
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "Aqua Supreme ",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "Generic Android Mobile",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 4
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-J720F",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 54
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "S1a40",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 3
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "DRA-LX2",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-A705FN",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 23
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "Redmi 4A",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 248
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-N950W",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 2
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "M2003J15SC",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 270
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "LM-G910",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 2
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "H8296",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 3
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "IF9003",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 2
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "5.1 Plus",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 116
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-J106F",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 5
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "MAR-LX1A",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "STK-L22",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 23
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "CPH1907",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 8
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "1606",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 103
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "M2006C3MII",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 105
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-G900V",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "A7700",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 5
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "i5 Pro",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "TA-1032",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 15
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "Mix 2",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 17
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "H442",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 2
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-C900Y",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-A530F",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 2
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "I1927",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 3
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "LS-5017",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "Moto E5 Plus",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 38
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "A0001",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 13
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "Redmi 5 Plus",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 13
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-P615",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 4
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "CAM-UL00",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 3
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "1723",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 435
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "7",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 167
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "IK-547",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "G011C",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 54
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "H930",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 12
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "H870DS",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 12
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "G8142",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 3
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-C9000",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 13
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "CPH1933",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 121
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "2006",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 19
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-M015G",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 156
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "2017M27A",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-A205YN",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 3
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "INE-LX2",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 15
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "moto g(9)",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 23
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "CPH1803",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 360
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "6.2",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 9
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "X9009",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 25
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "CPH1801",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 44
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-G988U1",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 4
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-G925I",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 26
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "CPH2083",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 80
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "CPH1881",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 78
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "Moto G6",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 82
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "CPH2095",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 73
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-G928F",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-M315F",
//                         "result": [
//                             {
//                                 "type": "click",
//                                 "count": 1
//                             },
//                             {
//                                 "type": "impression",
//                                 "count": 1557
//                             }
//                         ]
//                     }
//                 ]
//             },
//             {
//                 "appId": "5fa45086075398084712b47b",
//                 "res": [
//                     {
//                         "phoneModel": "SM-A600G",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-A505F",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "MYA-L22",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "EVA-L09",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "Mi A1",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-G973F",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 2
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-J415F",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 2
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-A730F",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "K420",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "Redmi Y2",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "LM-X210",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 2
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-J600G",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 5
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-A750F",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 2
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "6.1",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-J600F",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 2
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "FRD-AL10",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-M307F",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 2
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-M305F",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-J810G",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 4
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-J600GF",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 2
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-G950F",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "PRA-LA1",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "AMN-LX9",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "E6833",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "Desire 628 dual sim",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "TIT-AL00",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-J610F",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-A205F",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-A507FN",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "DUK-L09",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "NEM-L22",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "PRA-AL00X",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "Moto G5 Plus",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "Moto G5S Plus",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "C1",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "LLD-AL10",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-M205F",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 3
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "PRA-AL00",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "Moto E6s",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-G955F",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 2
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-M215F",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "BLN-L22",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "IN2",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "FRD-L02",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 2
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "M2007J20CG",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "1",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-A305F",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 4
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-M315F",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 4
//                             }
//                         ]
//                     }
//                 ]
//             },
//             {
//                 "appId": "5fa45085075398084712b21b",
//                 "res": [
//                     {
//                         "phoneModel": "Redmi Note 5 Pro",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "ZB602KL (X00TD)",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "A5010",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "M2006C3LII",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "CPH1909",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "Note 8 Pro",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "Redmi Note 6 Pro",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "Mi A2",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "7",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "1901",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-J610F (Android 4.2.2)",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 2
//                             }
//                         ]
//                     },
//                     {
//                         "phoneModel": "SM-J600G",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     }
//                 ]
//             },
//             {
//                 "appId": "5fa45085075398084712b29b",
//                 "res": [
//                     {
//                         "phoneModel": "K20 Pro",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     }
//                 ]
//             }
//         ],
//         "typeByPT": [
//             {
//                 "appId": "5fa45084075398084712b15d",
//                 "res": [
//                     {
//                         "platformType": "Android",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 70215
//                             },
//                             {
//                                 "type": "click",
//                                 "count": 22
//                             }
//                         ]
//                     }
//                 ]
//             },
//             {
//                 "appId": "5fa45086075398084712b47b",
//                 "res": [
//                     {
//                         "platformType": "Android",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 72
//                             }
//                         ]
//                     }
//                 ]
//             },
//             {
//                 "appId": "5fa45085075398084712b21b",
//                 "res": [
//                     {
//                         "platformType": "Android",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 13
//                             }
//                         ]
//                     }
//                 ]
//             },
//             {
//                 "appId": "5fa45085075398084712b29b",
//                 "res": [
//                     {
//                         "platformType": "Android",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     }
//                 ]
//             }
//         ],
//         "typeByPin": [
//             {
//                 "appId": "5fa45084075398084712b15d",
//                 "res": [
//                     {
//                         "zip": "400703",
//                         "result": [
//                             {
//                                 "type": "click",
//                                 "count": 2
//                             },
//                             {
//                                 "type": "impression",
//                                 "count": 444
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "400087",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "400010",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 862
//                             },
//                             {
//                                 "type": "click",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "400002",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 353
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "400065",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 565
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "400024",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 412
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "400083",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 182
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "400704",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 41
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "400028",
//                         "result": [
//                             {
//                                 "type": "click",
//                                 "count": 1
//                             },
//                             {
//                                 "type": "impression",
//                                 "count": 442
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "410201",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 14
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "410222",
//                         "result": [
//                             {
//                                 "type": "click",
//                                 "count": 1
//                             },
//                             {
//                                 "type": "impression",
//                                 "count": 63
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "400092",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 14
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "400004",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 520
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "400056",
//                         "result": [
//                             {
//                                 "type": "click",
//                                 "count": 1
//                             },
//                             {
//                                 "type": "impression",
//                                 "count": 607
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "400603",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 328
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "400706",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 915
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "400707",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 56
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "400015",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 799
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "400602",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1188
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "421301",
//                         "result": [
//                             {
//                                 "type": "click",
//                                 "count": 2
//                             },
//                             {
//                                 "type": "impression",
//                                 "count": 668
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "400607",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 71
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "400078",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 721
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "400031",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 25
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "400022",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 755
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "410101",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 4
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "400104",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1208
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "400034",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 300
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "400050",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 966
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "400095",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 275
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "401209",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 212
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "421306",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 440
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "400601",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 307
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "400612",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 289
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "421005",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 30
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "400057",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 396
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "421308",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 336
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "410208",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 535
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "421004",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 105
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "400071",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1138
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "400053",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 2233
//                             },
//                             {
//                                 "type": "click",
//                                 "count": 2
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "400075",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 508
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "400708",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 703
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "421002",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 311
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "400014",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 167
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "400030",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 2
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "400093",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 724
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "400042",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 750
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "400099",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 858
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "401201",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 41
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "410203",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "400001",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 453
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "400074",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 453
//                             },
//                             {
//                                 "type": "click",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "421202",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 345
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "400081",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 74
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "400096",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 3
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "410221",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 34
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "421204",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "410202",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 20
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "401106",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 2
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "400066",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 2367
//                             },
//                             {
//                                 "type": "click",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "400007",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 841
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "400017",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 615
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "400061",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 381
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "400051",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1086
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "400064",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 2397
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "400606",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 545
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "400072",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 2790
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "400614",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 244
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "400058",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 274
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "410207",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "421103",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 81
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "400070",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 4932
//                             },
//                             {
//                                 "type": "click",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "400043",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 216
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "400091",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 824
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "400049",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 234
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "400086",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 398
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "400605",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 32
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "400027",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 130
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "400054",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 550
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "400020",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 209
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "400080",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1100
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "400608",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 95
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "400029",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 110
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "400018",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 41
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "401303",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 23
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "400610",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 216
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "421311",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 25
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "400604",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 559
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "400009",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 318
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "400063",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 630
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "400006",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 156
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "400003",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 325
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "400076",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 917
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "401207",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 11
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "400012",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 548
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "400026",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 569
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "400055",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 726
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "400082",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 150
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "400094",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 29
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "400033",
//                         "result": [
//                             {
//                                 "type": "click",
//                                 "count": 1
//                             },
//                             {
//                                 "type": "impression",
//                                 "count": 540
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "400084",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 118
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "401304",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 50
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "400016",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 66
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "421302",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 743
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "400089",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 236
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "400701",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 507
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "400067",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 2266
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "401305",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1097
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "400013",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 237
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "410206",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1245
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "421201",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 673
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "400019",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 311
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "410204",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 72
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "400615",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 117
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "400059",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 95
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "421305",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 2
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "400005",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 45
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "400103",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 345
//                             },
//                             {
//                                 "type": "click",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "400037",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 257
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "400088",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 54
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "401105",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 429
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "400069",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 125
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "410218",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 360
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "400060",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1764
//                             },
//                             {
//                                 "type": "click",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "401208",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 315
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "400008",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 507
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "401107",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 926
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "401301",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 94
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "400079",
//                         "result": [
//                             {
//                                 "type": "click",
//                                 "count": 1
//                             },
//                             {
//                                 "type": "impression",
//                                 "count": 218
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "401101",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 24
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "400098",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 320
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "400101",
//                         "result": [
//                             {
//                                 "type": "click",
//                                 "count": 1
//                             },
//                             {
//                                 "type": "impression",
//                                 "count": 1269
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "400709",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 362
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "401203",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 285
//                             },
//                             {
//                                 "type": "click",
//                                 "count": 4
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "410210",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 677
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "400052",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 271
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "400025",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 91
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "421203",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 255
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "400021",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 46
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "400102",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 230
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "400011",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 145
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "400710",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 62
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "400097",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1451
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "400085",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 4
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "400077",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 428
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "400068",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 187
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "401202",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 329
//                             }
//                         ]
//                     }
//                 ]
//             },
//             {
//                 "appId": "5fa45085075398084712b21b",
//                 "res": [
//                     {
//                         "zip": "400042",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "400065",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "400050",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "400012",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "400091",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "401305",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 2
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "400060",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "400049",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "400070",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "410218",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "401107",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "400708",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     }
//                 ]
//             },
//             {
//                 "appId": "5fa45086075398084712b47b",
//                 "res": [
//                     {
//                         "zip": "400008",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 2
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "400053",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "421004",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "400019",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "401305",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 3
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "400079",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "400042",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "400067",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 2
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "400610",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 2
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "400072",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "400001",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "400015",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 3
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "400002",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "400051",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 5
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "400050",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "421302",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "400009",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 2
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "401107",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "400083",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 2
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "400066",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 7
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "410208",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 2
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "400708",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "400022",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 2
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "400017",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "400602",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "400710",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "400013",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "400012",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "400070",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 6
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "400011",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 3
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "401208",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 2
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "400097",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "410206",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 5
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "421308",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 2
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "400075",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "410201",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "400006",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     },
//                     {
//                         "zip": "400099",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     }
//                 ]
//             },
//             {
//                 "appId": "5fa45085075398084712b29b",
//                 "res": [
//                     {
//                         "zip": "400008",
//                         "result": [
//                             {
//                                 "type": "impression",
//                                 "count": 1
//                             }
//                         ]
//                     }
//                 ]
//             }
//         ]
//     }
// ]

// console.log(adddata.length)

// adddata.map(dada =>{
//     dada.appIds[0].ids.map(id=>{
//         // console.log(id)
//         var appdadimpreco =  dada.typeValues.filter(x => x.appId===id)
//         var timpressionsCount = 0;
//         var tclicksCount = 0;
//         var tcompleteCount = 0;
//         appdadimpreco.map(resut => {
//             resut.res.map(types=>{
//                 if(types.type === 'impression'){
//                     timpressionsCount += types.count
//                 }
//                 if(types.type === 'click'){
//                     tclicksCount += types.count
//                 }
//                 if(types.type === 'complete'){
//                     tcompleteCount += types.count
//                 }
//                 if(types.type === 'companionclicktracking'){
//                     tcompleteCount += types.count
//                 }
//                 if(types.type === 'clicktracking'){
//                     tcompleteCount += types.count
//                 }
//             })
//         })
//         var appdadlan =  dada.typeByLan.filter(x => x.appId===id)
//         var languageReport = [];
//         appdadlan.map(det => {
//             det.res.map(resu =>{
//                 var Limpre = 0;
//                 var Lclick = 0;
//                 var Lcomplete = 0;
//                 resu.result.map(types=>{
//                     if(types.type === 'impression'){
//                         Limpre += types.count 
//                     }
//                     if(types.type === 'click'){
//                         Lclick += types.count 
//                     }
//                     if(types.type === 'complete'){
//                         Lcomplete += types.count 
//                     }
//                     if(types.type === 'companionclicktracking'){
//                         Lcomplete += types.count 
//                     }
//                     if(types.type === 'clicktracking'){
//                         Lcomplete += types.count 
//                     }
//                 })
//                 languageReport.push({language:resu.language,impressions:Limpre,clicks:Lclick,complete:Lcomplete})
//             })
//         })
//         var appdadreg =  dada.typebyRegion.filter(x => x.appId===id)
//         var regionReport = [];
//         appdadreg.map(det => {
//             det.res.map(resu =>{
//                 var Rimpre = 0;
//                 var Rclick = 0;
//                 var Rcomplete = 0;
//                 resu.result.map(types=>{
//                     if(types.type === 'impression'){
//                         Rimpre += types.count 
//                     }
//                     if(types.type === 'click'){
//                         Rclick += types.count 
//                     }
//                     if(types.type === 'complete'){
//                         Rcomplete += types.count 
//                     }
//                     if(types.type === 'companionclicktracking'){
//                         Rcomplete += types.count 
//                     }
//                     if(types.type === 'clicktracking'){
//                         Rcomplete += types.count 
//                     }
//                 })
//                 regionReport.push({region:resu.region,impressions:Rimpre,clicks:Rclick,complete:Rcomplete})
//             })
//         })
//         var appdadpt =  dada.typeByPT.filter(x => x.appId===id)
//         var platformTypeReport = [];
//         appdadpt.map(det => {
//             det.res.map(resu =>{
//                 var PTimpre = 0;
//                 var PTclick = 0;
//                 var PTcomplete = 0;
//                 resu.result.map(types=>{
//                     if(types.type === 'impression'){
//                         PTimpre += types.count 
//                     }
//                     if(types.type === 'click'){
//                         PTclick += types.count 
//                     }
//                     if(types.type === 'complete'){
//                         PTcomplete += types.count 
//                     }
//                     if(types.type === 'companionclicktracking'){
//                         PTcomplete += types.count 
//                     }
//                     if(types.type === 'clicktracking'){
//                         PTcomplete += types.count 
//                     }
//                 })
//                 platformTypeReport.push({platformType:resu.platformType,impressions:PTimpre,clicks:PTclick,complete:PTcomplete})
//             })
//         })
//         var appdadosver =  dada.typeByOSV.filter(x => x.appId===id)
//         var osVersionTypeReport = [];
//         appdadosver.map(det => {
//             det.res.map(resu =>{
//                 var osvimpre = 0;
//                 var osvclick = 0;
//                 var osvcomplete = 0;
//                 resu.result.map(types=>{
//                     if(types.type === 'impression'){
//                         osvimpre += types.count 
//                     }
//                     if(types.type === 'click'){
//                         osvclick += types.count 
//                     }
//                     if(types.type === 'complete'){
//                         osvcomplete += types.count 
//                     }
//                     if(types.type === 'companionclicktracking'){
//                         osvcomplete += types.count 
//                     }
//                     if(types.type === 'clicktracking'){
//                         osvcomplete += types.count 
//                     }
//                 })
//                 osVersionTypeReport.push({osVersion:resu.osVersion,impressions:osvimpre,clicks:osvclick,complete:osvcomplete})
//             })
//         })
//         console.log(id,timpressionsCount,tclicksCount,tcompleteCount,languageReport,regionReport,platformTypeReport,osVersionTypeReport)
//     })
// })
