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

app.use('/auth',require('./routes/user.routes'))
app.use('/streamingads',require('./routes/streamingads.routes'))
app.use('/publishers',require('./routes/publisherapps.routes'))
app.use('/logs',require('./routes/trackinglogs.routes'))
app.use('/oldlogs',require('./routes/oldtracking.routes'))
app.use('/wrapper',require('./routes/wrapper.routes'))
app.use('/report',require('./routes/report.routes'))
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
    console.log(date,credate)
    const trackinglogs = mongoose.model('trackinglogs')
    var data = [];
    trackinglogs.aggregate([
        { $match: {
            "date":date,
            "type":{$in:["impression","complete","click","companionclicktracking","clicktracking"]},
            "createdOn":{$lte : credate}
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
                var region = data[i].report[j].region;
                var appId = data[i].report[j].appId;
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
                console.log(cam,da,appId)
                Report.findOne({campaignId:cam,date:da,Publisher:appId})
                .then(foundreport=>{
                    if(!foundreport){
                        // console.log(data[i])
                        const report = new Report({
                            date:da,
                            Publisher:appId,
                            campaignId:cam,
                            impressions:impre,
                            complete:compl,
                            clicks:click,
                            region:region,
                            spend:impre,
                            avgSpend:impre
                        })
                        report.save()
                        .then(result => {
                            compr.push(result)
                            console.log("completed")
                        })
                        .catch(err => console.log(err))
                    }else{
                        foundreport.date = da;
                        foundreport.Publisher = appId;
                        foundreport.campaignId = cam;
                        foundreport.impressions = impre;
                        foundreport.complete = compl;
                        foundreport.clicks = click;
                        foundreport.region = region;
                        foundreport.spend = impre;
                        foundreport.avgSpend = impre;
                        foundreport.save()
                        .then(ree=> console.log('updated'))
                        .catch(err => console.log(err))
                    }
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
