const express = require('express')
const app = express()
const port = process.env.PORT || 5000
const mongoose = require('mongoose')
const cors = require('cors')
const { MONGOURI } = require('./config/keys')
const cron = require('node-cron')

app.use(express.json())
app.use(cors())

cron.schedule('00 02 * * *',function(){
    var d = new Date()
    d.setDate(d.getDate()-1);
    var dte = d.getFullYear() + '-' + (d.getMonth()+1) + '-' + d.getDate()
    // var yd = new Date(dte)
    var camIds = []
    var appIds = []
    const Report = mongoose.model('Report')
    const trackinglogs = mongoose.model('trackinglogs')
    const StreamingAds = mongoose.model('streamingads')
    const Rtbrequest = mongoose.model('rtbrequests')
    const publisherapps = mongoose.model('publisherapps')
    // console.log(fd)
    StreamingAds.find()
    .then(ads=>{
        camIds = ads.map(ad => {
            return {_id: ad._id, type:ad.Linear[0].MediaFiles[0].Type}
        })
        publisherapps.find()
        .then(apps => {
            appIds = apps.map(publi => {
                return publi._id
            })
            // console.log(appIds)
            // console.log(camIds)
            for(var i=0;i<camIds.length;i++){
                for(var j=0;j<appIds.length;j++){
                    ReportMaker(yd,camIds[i],appIds[j])
                    // console.log(yd,camIds[i],appIds[j])
                }
            }
        })
    })

    async function ReportMaker(date, campaignId, appId ){
        // console.log(date,campaignId,appId)
        var data = [];
        var clicked = [];
        var impressions = [];
        var completed = [];
        var region = [];
        trackinglogs.find({
            date:dte,
            campaignId:campaignId,
            appId:appId
        })
        // .populate('rtbreqid')
        .then(logs=>{
            console.log(logs.length)
            if(!logs){
                console.log('ntg')
                return res.json({Message:'there are no logs on th given information'})
            }
            data = logs
            region = logs.map(log =>{
                return log.region 
            })
            region = [...new Set(region)];
            // region = logs[0].region
            if(data[0].Type){
                impressions = data.filter(x => x.Type==='impression')
                if(appId === '5f91ca4441375c24943f4756'){
                    clicked = data.filter(x => x.Type==='clicktracking')
                    // console.log('spotify')
                }else{
                    clicked = data.filter(x => x.Type==='companionclicktracking')
                    // console.log('not spotify')
                }
                completed = data.filter(x => x.Type==='complete')
            }// console.log(data)
            if(data[0].type){
                impressions = data.filter(x => x.type==='impression')
                if(appId === '5f91ca4441375c24943f4756'){
                    clicked = data.filter(x => x.type==='clicktracking')
                    // console.log('spotify')
                }else{
                    clicked = data.filter(x => x.type==='companionclicktracking')
                    // console.log('not spotify')
                }
                completed = data.filter(x => x.type==='complete')
            }// console.log(data)
            // data = data.filter(x => x.appId===appId)
            // Rtbrequest
            const report = new Report({
                Date:date,
                Publisher:appId,
                mediatype: campaignId.type,
                // dealID,
                impressions:impressions.length,
                complete:completed.length,
                clicks:clicked.length,
                region:region,
                Spend:data.length + ' USD',
                avgSpend:logs.length?1:0
            })
            // console.log(report)
            report.save()
            .then(result => {
                console.log(result)
            })
            .catch(err => console.log(err))
        })
        .catch(err=>console.log(err))
    }
})
// var d = new Date()
// d.setDate(d.getDate()-1);
// var dte = d.getFullYear() + '-' + (d.getMonth()+1) + '-' + d.getDate()
// var fd = new Date(dte)
// cron.schedule('00 14 * * *',function(){
//     // var camIds = []
//     const Report = mongoose.model('Report')
//     const trackinglogs = mongoose.model('trackinglogs')
//     const StreamingAds = mongoose.model('StreamingAds')
//     const Rtbrequest = mongoose.model('Rtbrequest')
//     // console.log(fd)
//     StreamingAds.find()
//     .then(ads=>{
//         camIds = ads.map(ad => {
//             return ad._id
//         })
//     })
//     // for(var i=0;i<=10;i++)
//     // console.log('started')
// })

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
require('./models/wrappers.model')
require('./models/rtbrequests.model')
require('./models/report.model')

app.use('/auth',require('./routes/user.routes'))
app.use('/streamingads',require('./routes/streamingads.routes'))
app.use('/publishers',require('./routes/publisherapps.routes'))
app.use('/logs',require('./routes/trackinglogs.routes'))
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

app.listen(port, () => console.log(`app listening on port ${port}!`))