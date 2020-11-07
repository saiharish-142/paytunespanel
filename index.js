// const fetch = require('node-fetch')
const express = require('express')
const app = express()
const port = process.env.PORT || 5200
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
// var d = new Date()
//     d.setDate(d.getDate()-1);
//     if(d.getDate() < 10){
//         var dte = d.getFullYear() + '-' + (d.getMonth()+1) + '-' + '0' + d.getDate() + 'T00:00:00.000Z'
//     }else{
//         var dte = d.getFullYear() + '-' + (d.getMonth()+1) + '-' + d.getDate() + 'T00:00:00.000Z'
//     }
//     var yd = new Date(dte)
app.listen(port, () => console.log(`app listening on port ${port}!`))

// var arr = [
//     {date:'2020-12-1'},
//     {date:'2020-12-2'},
//     {date:'2020-12-3'},
//     {date:'2020-12-4'},
//     {date:'2020-12-5'},
//     {date:'2020-12-6'},
//     {date:'2020-12-7'},
//     {date:'2020-12-8'},
//     {date:'2020-12-9'},
//     {date:'2020-12-10'},
// ]
// var da = new Date('2020-12-05'+'T00:00:00.000Z')
// console.log(da)
// arr = arr.filter(x =>{
//     var d = new Date(x.date)
//     console.log(d)
//     if(d<da){
//         return x;
//     }
// })
// console.log(arr)
// var ObjectId = require('mongoose').Types.ObjectId; 
// var ob =  new ObjectId('5f9dc3fb3c1b28429c06c014')
// console.log(ob==='5f9dc3fb3c1b28429c06c014')

// router.post('/creareport',adminauth,(req,res)=>{
//     const { campaignId, date, tdate } = req.body
//     var dat = new Date(date)
//     var tdat = new Date(tdate)
//     var Ldata = [];
//     var data = [];
//     var fdata = [];
//     var i=0;
//     console.log('started',dat,tdat)
//     async function reportMaker(){
//         trackinglogs.find({createdOn:{$lte:dat}})
//         .sort('-createdOn')
//         .limit(1000)
//         .skip(1000*i)
//         .then(async (result)=>{
//             data = result
//             data = await data.filter(x=>x.campaignId.equals(campaignId))
//             Ldata = await data.filter(x=>{
//                 var d = new Date(x.createdOn)
//                 if(d<=tdat){
//                     return x;
//                 }
//             })
//             fdata = fdata.concat(data)
//             console.log(data.length,`completed round ${i} in campaign`,fdata.length)
//             i++;
//             // if(result.length===0 || Ldata.length>1){
//                 // clearInterval(timer)
//                 if(fdata.length===0)
//                 console.log('noo logs found')
//                 if(fdata.length>0){
//                     // publisherfinder(fdata,date,campaignId)
//                 }
//                 return res.json({message:'no more logs available',fdata,data})
//             // }else{console.log('done')}
//             // region = await data.map(log => {return log.region })
//         })
//         .catch(err => {
//             console.log(err)
//             clearInterval(timer)
//             // publisherfinder(fdata,date,campaignId)
//         })
//     }
//     var timer = setInterval(reportMaker, 300000)
// })

// async function publisherfinder({logs,date,campaignId}){
//     var app = [];
//     var applogs = [];
//     var i = 0;
//     function removeDuplicates(originalArray, prop) {
//         var newArray = [];
//         var lookupObject  = {};
//         for(var i in originalArray) {
//             lookupObject[originalArray[i][prop]] = originalArray[i];
//         }
    
//         for(i in lookupObject) {
//             newArray.push(lookupObject[i]);
//         }
//         return newArray;
//     }
    
//     // var logs = await removeDuplicates(jlogs, "_id");
//     publisherapps.find()
//     .then(async (result)=>{
//         app = await result.map(x => x._id)
//         async function midware(){
//             applogs = await logs.filter(x => x.appId.equals(app[i]))
//             if(app[i]!== undefined){
//             console.log(app[i],logs)
//             reportposter(applogs,app[i],date,campaignId)}
//             if(i>=app.length){
//                 clearInterval(tim)
//             }
//             i++;
//         }
//         var tim = setInterval(midware, 3000)
//     })
//     .catch(err => console.log(err))
// }

// async function reportposter({logsFiltered,appid,date,campaignId}){
//     var region = [];
//     var complete = [];
//     var clicked = [];
//     var clicked2 = [];
//     var impressions = [];
//     // var start = [];
//     region = await logsFiltered.map(x => { return x.region })
//     region = [...new Set(region)];
//     complete = await logsFiltered.filter(x => x.type==='complete')
//     impressions = await data.filter(x => x.type==='impression')
//     // start = await data.filter(x => x.type==='start')
//     if(appid.equals('5f91ca4441375c24943f4756')){
//         clicked = logsFiltered.filter(x=>x.type==='clicktracking')
//         clicked2 = logsFiltered.filter(x => x.type==='click')
//         clicked = clicked.concat(clicked2)
//     }else{
//         clicked = logsFiltered.filter(x=>x.type==='companionclicktracking')
//         clicked2 = logsFiltered.filter(x => x.type==='click')
//         clicked = clicked.concat(clicked2)
//     }
//     const report = new Report({
//         date:date,
//         Publisher:appid,
//         campaignId:campaignId,
//         impressions:impressions.length,
//         complete:complete.length,
//         clicks:clicked.length,
//         region:region,
//         Spend:logsFiltered.length + ' USD',
//         avgSpend:logsFiltered.length
//     })
//     report.save()
//     .then(reul => console.log(reul))
//     .catch(err => console.log(err))
// }