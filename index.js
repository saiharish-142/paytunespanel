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
//         var dte = d.getFullYear() + '-' + (d.getMonth()+1) + '-' + '0' + d.getDate()
//     }else{
//         var dte = d.getFullYear() + '-' + (d.getMonth()+1) + '-' + d.getDate()
//     }
    // var yd = new Date(dte)
    // console.log(dte)
app.listen(port, () => console.log(`app listening on port ${port}!`))

cron.schedule('20 00 * * *', function() {
    var d = new Date()
    d.setDate(d.getDate()-1);
    if(d.getDate() < 10){
        var date = d.getFullYear() + '-' + (d.getMonth()+1) + '-' + '0' + d.getDate()
    }else{
        var date = d.getFullYear() + '-' + (d.getMonth()+1) + '-' + d.getDate()
    }
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
});

// var data = [
//     {
//         "report": [
//             {
//                 "appId": "5efac6f9aeeeb92b8a1ee056",
//                 "type": [
//                     {
//                         "type": "impression",
//                         "count": 10851
//                     },
//                     {
//                         "type": "complete",
//                         "count": 19518
//                     },
//                     {
//                         "type": "companionclicktracking",
//                         "count": 130
//                     }
//                 ],
//                 "region": [
//                     "DL",
//                     "HR",
//                     "UP"
//                 ]
//             }
//         ],
//         "campaignId": "5f9f80237124ce17a1764c30",
//         "date": "2020-11-02"
//     },
//     {
//         "report": [
//             {
//                 "appId": "5efac6f9aeeeb92b8a1ee056",
//                 "type": [
//                     {
//                         "type": "companionclicktracking",
//                         "count": 562
//                     },
//                     {
//                         "type": "complete",
//                         "count": 85878
//                     },
//                     {
//                         "type": "impression",
//                         "count": 47577
//                     }
//                 ],
//                 "region": [
//                     "RJ",
//                     "UP",
//                     "DL",
//                     "HR"
//                 ]
//             }
//         ],
//         "campaignId": "5f9f80237124ce17a1764c30",
//         "date": "2020-11-04"
//     },
//     {
//         "report": [
//             {
//                 "appId": "5efac6f9aeeeb92b8a1ee056",
//                 "type": [
//                     {
//                         "type": "companionclicktracking",
//                         "count": 554
//                     },
//                     {
//                         "type": "complete",
//                         "count": 91213
//                     },
//                     {
//                         "type": "impression",
//                         "count": 50369
//                     }
//                 ],
//                 "region": [
//                     "UP",
//                     "HR",
//                     "DL",
//                     "RJ"
//                 ]
//             }
//         ],
//         "campaignId": "5f9f80237124ce17a1764c30",
//         "date": "2020-11-05"
//     },
//     {
//         "report": [
//             {
//                 "appId": "5efac6f9aeeeb92b8a1ee056",
//                 "type": [
//                     {
//                         "type": "impression",
//                         "count": 49452
//                     },
//                     {
//                         "type": "complete",
//                         "count": 89362
//                     },
//                     {
//                         "type": "companionclicktracking",
//                         "count": 764
//                     }
//                 ],
//                 "region": [
//                     "RJ",
//                     "UP",
//                     "DL",
//                     "HR"
//                 ]
//             }
//         ],
//         "campaignId": "5f9f80237124ce17a1764c30",
//         "date": "2020-11-07"
//     },
//     {
//         "report": [
//             {
//                 "appId": "5efac6f9aeeeb92b8a1ee056",
//                 "type": [
//                     {
//                         "type": "complete",
//                         "count": 99986
//                     },
//                     {
//                         "type": "companionclicktracking",
//                         "count": 817
//                     },
//                     {
//                         "type": "impression",
//                         "count": 55572
//                     }
//                 ],
//                 "region": [
//                     "HR",
//                     "UP",
//                     "DL",
//                     "RJ"
//                 ]
//             }
//         ],
//         "campaignId": "5f9f80237124ce17a1764c30",
//         "date": "2020-11-08"
//     },
//     {
//         "report": [
//             {
//                 "appId": "5efac6f9aeeeb92b8a1ee056",
//                 "type": [
//                     {
//                         "type": "complete",
//                         "count": 77691
//                     },
//                     {
//                         "type": "impression",
//                         "count": 42960
//                     },
//                     {
//                         "type": "companionclicktracking",
//                         "count": 536
//                     }
//                 ],
//                 "region": [
//                     "DL",
//                     "UP",
//                     "RJ",
//                     "HR"
//                 ]
//             }
//         ],
//         "campaignId": "5f9f80237124ce17a1764c30",
//         "date": "2020-11-03"
//     },
//     {
//         "report": [
//             {
//                 "appId": "5efac6f9aeeeb92b8a1ee056",
//                 "type": [
//                     {
//                         "type": "companionclicktracking",
//                         "count": 640
//                     },
//                     {
//                         "type": "complete",
//                         "count": 92936
//                     },
//                     {
//                         "type": "impression",
//                         "count": 51238
//                     }
//                 ],
//                 "region": [
//                     "UP",
//                     "DL",
//                     "HR",
//                     "RJ"
//                 ]
//             }
//         ],
//         "campaignId": "5f9f80237124ce17a1764c30",
//         "date": "2020-11-06"
//     },
//     {
//         "report": [
//             {
//                 "appId": "5efac6f9aeeeb92b8a1ee056",
//                 "type": [
//                     {
//                         "type": "companionclicktracking",
//                         "count": 390
//                     },
//                     {
//                         "type": "complete",
//                         "count": 67416
//                     },
//                     {
//                         "type": "impression",
//                         "count": 37218
//                     }
//                 ],
//                 "region": [
//                     "HR",
//                     "DL",
//                     "UP",
//                     "RJ"
//                 ]
//             }
//         ],
//         "campaignId": "5f9f80237124ce17a1764c30",
//         "date": "2020-11-09"
//     }
// ]

// const Report = mongoose.model('Report')
// var compledata = [];
// async function dataaa() {
//     await data.forEach(async (daata)=>{
//         daata.report.forEach(async (re)=>{
//             var impre = 0;
//             var compl = 0;
//             var click = 0;
//             re.type.forEach(repo=>{
//                 if(repo.type==='impression'){
//                     impre += repo.count
//                 }
//                 if(repo.type==='complete'){
//                     compl += repo.count
//                 }
//                 if(repo.type==='companionclicktracking'){
//                     click += repo.count
//                 }
//                 if(repo.type==='clicktracking'){
//                     click += repo.count
//                 }
//                 if(repo.type==='click'){
//                     click += repo.count
//                 }
//             })
//             const report = new Report({
//                 date: daata.date,
//                 campaignId: daata.campaignId,
//                 appId : re.appId,
//                 impressions:impre,
//                 clicks:click,
//                 complete:compl,
//                 region: re.region
//             })
//             // let postda = await report.save().catch(err => console.log(err))
//             // compledata.push(postda)
//         })
//     })
//     await console.log(compledata,1)
// }

// dataaa()