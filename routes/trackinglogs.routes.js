const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const trackinglogs = mongoose.model('trackinglogs')
const Report = mongoose.model('Report')
const StreamingAds = mongoose.model('streamingads')
const Unique = mongoose.model('unique')
const adsetting = mongoose.model('adsetting')
const publisherapps = mongoose.model('publisherapps')
const adminauth = require('../authenMiddleware/adminauth')

router.get('/trackinglogs',adminauth,(req,res)=>{
    trackinglogs.find()
    .sort('-createdOn')
    .limit(200)
    .then(logs=>{
        if(!logs.length){
            return res.status(422).json({error:"not found",logs})
        }
        res.json(logs)
    })
    .catch(err => console.log(err))
})

router.get('/trackinglogsty',adminauth,(req,res)=>{
    trackinglogs.find()
    .sort('-createdOn')
    .limit(200)
    .then(logs=>{
        if(!logs.length){
            return res.status(422).json({error:"not found",logs})
        }
        logs.map(log => {
            typeof log.campaignId
        })
        res.json(logs)
    })
    .catch(err => console.log(err))
})

router.get('/trackinglogs/:id',adminauth,(req,res)=>{
    trackinglogs.find({_id:req.params.id})
    .then(logs=>{
        if(!logs.length){
            return res.status(422).json({error:"not found",logs})
        }
        res.json(logs)
    })
    .catch(err => console.log(err))
})

router.post('/logbyDate/:num',adminauth,(req,res)=>{
    const { date, campaignId } = req.body
    const num = req.params.num
    trackinglogs.find({date:date,campaignId:campaignId})
    .sort('-createdOn')
    .limit(100)
    .skip(100*num)
    .then(result=>{
        if(!result.length){
            return res.status(422).json({error:"not found",result})
        }
        res.json(result)
    })
    .catch(err=>{
        console.log(err)
    })
})

router.post('/suspect',adminauth,(req,res)=>{
    const { date, campaignId, createdOn } = req.body
    // const num = req.params.num
    const da = new Date(createdOn)
    console.log(da)
    trackinglogs.find({date:date,campaignId:campaignId, createdOn:{$lte : da}})
    .sort('-createdOn')
    .then(result=>{
        if(!result.length){
            return res.status(422).json({error:"not found",result})
        }
        res.json(result)
    })
    .catch(err=>{
        console.log(err)
    })
})

router.put('/repotest',adminauth,(req,res)=>{
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
    // ReportsRefresher(date,ISTTime)
    console.log(date,ISTTime)
    const trackinglogs = mongoose.model('trackinglogs')
    var data = [];
    Report.deleteMany({date:date})
    .then(repon=>{
        console.log({relt:repon,mess:"deleted"})
    })
    trackinglogs.aggregate([
        { $match: {
            "date":date,
            "type":{$in:["impression","complete","click","companionclicktracking","clicktracking"]},
            "createdOn":{$lte : ISTTime}
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
        // console.log(JSON.stringify(data))
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
})

router.post('/logcamp/:num',adminauth,(req,res)=>{
    const num = req.params.num
    trackinglogs.find({campaignId:req.body.campaignId})
    .sort('-createdOn')
    .limit(100)
    .skip(100*num)
    .then(result=>{
        if(result.length===0){
            return res.status(422).json({error:"not found",result})
        }
        res.json(result)
    })
    .catch(err=>{
        console.log(err)
    })
})

router.post('/repotcre',adminauth,async (req,res)  =>{
    const { date, campaignId } = req.body
    var resu = [];
    trackinglogs.aggregate([
        { $match: {
            "campaignId":campaignId,
            "date":date,
            "type":{$in:["impression","complete","click","companionclicktracking","clicktracking"]}
        } },
        { $group:{
            _id: {date:"$date" ,campaignId:"$campaignId" ,appId: "$appId",region :"$region",type:"$type"},count:{$sum:1}
        }},{$group:{
            _id:{date:"$_id.date" ,campaignId:"$_id.campaignId" ,appId:"$_id.appId",type:"$_id.type"} , 
            region:{$push:"$_id.region"}, 
            count:{$sum:"$count"}
        }},{$group:{
            _id:{date:"$_id.date" ,campaignId:"$_id.campaignId" ,appId:"$_id.appId"}, 
        }},{$project:{
            date: "$_id.date",campaignId:"$_id.campaignId",app_id:"$_id.appId", type:"$type",region:"$region", _id:0
        }}
    ])
    .then(result=>{
        resu = result;
        resu.map((det)=>{
            var resregion = [].concat.apply([], det.region);
            resregion = [...new Set(resregion)];
            det.region = resregion
        })
        res.json(resu)
    })
    .catch(err => console.log(err))
})

router.post('/reportdate',adminauth,async (req,res)  =>{
    const { date } = req.body
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
        res.json(compr)
    })
    .catch(err => console.log(err))
})

router.post('/procedtest1',adminauth,async (req,res)  =>{
    const { campaignId, date } = req.body
    var resu = [];
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
        var resus = [];
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
                resus.push(report)
                // console.log(report)
                report.save()
                .then(sdsa=>{console.log('completed')})
                .catch(err=>{console.log(err)})
            })
        })
        res.json(resus)
    })
    .catch(err => console.log(err))
})

router.post('/procedtest2',adminauth,async (req,res)  =>{
    const { campaignId, date } = req.body
    var resu = [];
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
                    appuniquecount = appuniquedata[0].uniqueuser && appuniquedata[0].uniqueuser
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
                resu.push(report)
                report.save()
                .then(ree=>console.log('complete'))
                .catch(err => console.log(err))
            })
        })
        res.json(resu)
    }catch(e){
        console.log(e)
    }
})

router.post('/testcom1',adminauth,async (req,res)  =>{
    const { campaignId, date } = req.body
    var resu = [];
    trackinglogs.db.db.command({
        aggregate: "trackinglogs",
        pipeline:[
        {$facet:{
            "regionwiseunique":[
                {$match:{"type":{$in:["impression"]}}},
                {$group:{_id:{campaignId:"$campaignId",appId:"$appId",region:"$region"},ifa:{$addToSet:"$ifa"}}},
                {$group:{_id:{campaignId:"$_id.campaignId",appId:"$_id.appId"},ifa:{$addToSet:"$ifa"}, uniquerepo:{$push:{region:"$_id.region",unique:{$size:"$ifa"}}}}},
                {$group:{_id:"$_id.campaignId",ifa:{$addToSet:"$ifa"},results:{$push:{appId:"$_id.appId",appwiseunique:{$size:"$ifa"},result:"$uniquerepo"}}}},
                {$project:{_id:0,campaignId:"$_id",uniquecampwise:{$size:"$ifa"},results:1}}
            ],
            "appIds":[
                {$match:{"date":date}},
                {$group:{_id:{campaignId:"$campaignId",date:"$date",appId:"$appId"}}},
                {$group:{_id:{campaignId:"$_id.campaignId",date:"$_id.date"},ids:{$push:"$_id.appId"}}},
                {$project:{_id:0,campaignId:"$_id.campaignId",date:"$_id.date",ids:"$ids"}}
            ],
            "typeValues":[
                {$match:{"date":date}},
                {$group:{_id:{campaignId:"$campaignId",rtbType:"$rtbType",type:"$type",appId:"$appId"}, count:{$sum:1}}},
                {$group:{_id:{appId:"$_id.appId",campaignId:"$_id.campaignId",rtbType:"$_id.rtbType"}, result:{$push:{k:"$_id.type",v:"$count"}}}},
                {$group:{_id:"$_id.campaignId",report:{$push:{appId:"$_id.appId",rtbType:"$_id.rtbType",result:{$arrayToObject:"$result"}}}}},
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
                {$group:{_id:{campaignId:"$campaignId",type:"$type",appId:"$appId",rtbType:"$rtbType",language:"$language"}, count:{$sum:1}}},
                {$group:{_id:{campaignId:"$_id.campaignId",appId:"$_id.appId",rtbType:"$_id.rtbType",language:"$_id.language"}, result:{$push:{k:"$_id.type",v:"$count"}}}},
                {$group:{_id:{appId:"$_id.appId",campaignId:"$_id.campaignId",rtbType:"$_id.rtbType"}, result:{$push:{language:"$_id.language",result:{$arrayToObject:"$result"}}}}},
                {$group:{_id:"$_id.campaignId",report:{$push:{appId:"$_id.appId",rtbType:"$_id.rtbType",result:"$result"}}}},
                {$project:{_id:0,campaignId:"$_id",report:"$report"}}
            ],"typeByPhModel":[
                {$match:{"date":date}},
                {$group:{_id:{campaignId:"$campaignId",type:"$type",appId:"$appId",rtbType:"$rtbType",phoneMake:"$phoneMake",phoneModel:"$phoneModel"}, count:{$sum:1}}},
                {$group:{_id:{campaignId:"$_id.campaignId",appId:"$_id.appId",rtbType:"$_id.rtbType",phoneMake:"$_id.phoneMake",phoneModel:"$_id.phoneModel"}, result:{$push:{k:"$_id.type",v:"$count"}}}},
                {$group:{_id:{appId:"$_id.appId",campaignId:"$_id.campaignId",rtbType:"$_id.rtbType"}, result:{$push:{phoneModel:{$concat: [ "$_id.phoneMake", " - ", "$_id.phoneModel" ]},result:{$arrayToObject:"$result"}}}}},
                {$group:{_id:"$_id.campaignId",report:{$push:{appId:"$_id.appId",rtbType:"$_id.rtbType",result:"$result"}}}},
                {$project:{_id:0,campaignId:"$_id",report:"$report"}}
            ],"typeByPT":[
                {$match:{"date":date}},
                {$group:{_id:{campaignId:"$campaignId",type:"$type",appId:"$appId",rtbType:"$rtbType",platformType:"$platformType",osVersion:"$osVersion"}, count:{$sum:1}}},
                {$group:{_id:{campaignId:"$_id.campaignId",appId:"$_id.appId",rtbType:"$_id.rtbType",platformType:"$_id.platformType",osVersion:"$_id.osVersion"}, result:{$push:{k:"$_id.type",v:"$count"}}}},
                {$group:{_id:{appId:"$_id.appId",campaignId:"$_id.campaignId",rtbType:"$_id.rtbType"}, result:{$push:{platformType:{$concat: [ "$_id.platformType", " - ", "$_id.osVersion" ]},result:{$arrayToObject:"$result"}}}}},
                {$group:{_id:"$_id.campaignId",report:{$push:{appId:"$_id.appId",rtbType:"$_id.rtbType",result:"$result"}}}},
                {$project:{_id:0,campaignId:"$_id",report:"$report"}}
            ],"typeByPin":[
                {$match:{"date":date}},
                {$group:{_id:{campaignId:"$campaignId",type:"$type",appId:"$appId",rtbType:"$rtbType",zip:"$zip"}, count:{$sum:1}}},
                {$group:{_id:{campaignId:"$_id.campaignId",appId:"$_id.appId",rtbType:"$_id.rtbType",zip:"$_id.zip"}, result:{$push:{k:"$_id.type",v:"$count"}}}},
                {$group:{_id:{appId:"$_id.appId",campaignId:"$_id.campaignId",rtbType:"$_id.rtbType"}, result:{$push:{zip:"$_id.zip",result:{$arrayToObject:"$result"}}}}},
                {$group:{_id:"$_id.campaignId",report:{$push:{appId:"$_id.appId",rtbType:"$_id.rtbType",result:"$result"}}}},
                {$project:{_id:0,campaignId:"$_id",report:"$report"}}
            ],"typeByDev":[
                {$match:{"date":date}},
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
        resu = result.cursor.firstBatch;
        res.json(resu)
    })
    .catch(err => console.log(err))
})

router.post('/testcom2',adminauth,async (req,res)  =>{
    const { campaignId, date, audio } = req.body
    let audioUnique = await trackinglogs.db.db.command({
        aggregate: "trackinglogs",
        pipeline:[
            {$match:{ "type":"impression","campaignId" : { $in : audio} }},
            {$group:{_id:"$ifa", total:{$sum:1},}},
            {$count: "count"}
        ],
        allowDiskUse: true,
        cursor: {  }
    }).catch(err => console.log(err))
    res.json(audioUnique)
})

router.post('/testcom2f',adminauth,async (req,res)  =>{
    const { campaignId, date, audio } = req.body
    trackinglogs.db.db.command({
        aggregate: "trackinglogs",
        pipeline:[
            {$match:{ "type":"impression","campaignId" : { $in : audio} }},
            {$group:{_id:"$ifa", total:{$sum:1},}},
            {$count: "count"}
        ],
        allowDiskUse: true,
        cursor: {  }
    })
    .then(audioUnique=>{
        res.json(audioUnique)
    })
    .catch(err => console.log(err))
})

router.post('/testcom2f2',adminauth,async (req,res)  =>{
    const { campaignId, date, audio } = req.body
    let logids = await trackinglogs.aggregate([
        {$match:{"date":date}},
        {$group:{_id:null,ids:{$addToSet:"$campaignId"}}},
        {$project:{_id:0,ids:1}}
    ])
    .then(audioUnique=>{
        var logids = audioUnique
        logids = logids[0].ids
        res.json({audioUnique,logids})
    })
    .catch(err => console.log(err))
})

router.post('/testcom3',adminauth,async (req,res)  =>{
    const { campaignId, date } = req.body
    var resu = [];
    var newdate = new Date(date)
    try{
        let logids = await trackinglogs.aggregate([
            {$match:{"date":date}},
            {$group:{_id:null,ids:{$addToSet:"$campaignId"}}},
            {$project:{_id:0,ids:1}}
        ])
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
        })
        wholetypelist = wholetypelist.cursor.firstBatch
        res.json({logids,uniqueuserslist,wholetypelist})
    }catch(e){
        console.log(e)
        res.status(400).json(e)
    }
})

router.put('/uniquetest1',async (req,res) =>{
    const { date } = req.body
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
        // console.log(audioUnique)
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
        // console.log(displayUnique)
        const uniquedata = new Unique({
            audiouser:audioCount ? audioCount :0,
            displayuser:displayCount ? displayCount :0,
            AdTitle:title
        })
        console.log(audioCount,displayCount,title,uniquedata)
    })
    res.json({response,ree})
})

router.put('/uniqueprod1',async (req,res) =>{
    const { date } = req.body
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
        // console.log(audioUnique)
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
        // console.log(displayUnique)
        const uniquedata = new Unique({
            audiouser:audioCount ? audioCount :0,
            displayuser:displayCount ? displayCount :0,
            AdTitle:title
        })
        let dala = await Unique.deleteMany({AdTitle:title}).catch(err => console.log(err))
        uniquedata.save()
        .then(resu =>{
            return console.log('completeunique',dala)
        })
        .catch(err =>{
            console.log(audioCount,displayCount,title,uniquedata)
            return console.log(err,dala)
        })
    })
    res.json({response,ree})
})

router.put('/uniqueprod2',async (req,res) =>{
    // const { date } = req.body
    let uniqueids = await trackinglogs.distinct( "campaignId",{"type":"impression"}).catch(err => console.log(err))
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
    // res.json({response,ree})
})

router.post('/repotcrecamp',adminauth,async (req,res)  =>{
    const { campaignId } = req.body
    var resu = [];
    trackinglogs.aggregate([
        { $match: {
            "campaignId":campaignId
        } },
        { $group:{
            _id: {appId: "$appId",campaignId:"$campaignId", date:"$date" ,region :"$region",type:"$type"},
            count:{$sum:1}
        }},{$group:{
            _id:{appId:"$_id.appId",campaignId:"$_id.campaignId", date:"$_id.date", type:"$_id.type"} , 
            region:{$push:"$_id.region"}, 
            count:{$sum:"$count"}
        }},{$group:{
            _id:{appId:"$_id.appId",campaignId:"$_id.campaignId" ,date:"$_id.date"}, 
            type:{$push:{type:"$_id.type",count:"$count"}}, 
            region:{$push:"$region"}
        }},{$group:{
            _id:{date:"$_id.date",campaignId:"$_id.campaignId"}, 
            report:{$push:{appId:"$_id.appId",type:"$type",region:"$region"}}
        }},{$project:{
            campaignId:"$_id.campaignId",
            date:"$_id.date", 
            report:"$report", 
            _id:0
        }},{$sort: {date: -1}}
    ])
    .then(result=>{
        resu = result;
        resu.map((daterepo)=>{
            daterepo.report.map(detapp=>{
                var resregion = [].concat.apply([], detapp.region);
                resregion = [...new Set(resregion)];
                detapp.region = resregion
            })
        })
        res.json(resu)
    })
    .catch(err => console.log(err))
})

router.get('/unique',adminauth,async(req,res)=>{
    Unique.find()
    .then(result => {
        res.json(result)
    }).catch(err => res.status(400).json(err))
})

router.put('/uniqueone',adminauth,async(req,res)=>{
    const {title} = req.body
    Unique.find({AdTitle:title})
    .then(result => {
        res.json(result)
    }).catch(err => res.status(400).json(err))
})

router.put('/uniqueid',adminauth,async(req,res)=>{
    const {id} = req.body
    Unique.find({_id:id})
    .then(result => {
        res.json(result)
    }).catch(err => res.status(400).json(err))
})

router.delete('/deleteall',adminauth,async(req,res)=>{
    Unique.deleteMany()
    .then(resl=>{
        res.json(resl)
    }).catch(err => res.status(400).json(err))
})

router.delete('/deletesome',adminauth,async(req,res)=>{
    const {title} = req.body
    Unique.deleteMany({AdTitle:title})
    .then(resl=>{
        res.json(resl)
    }).catch(err => res.status(400).json(err))
})

router.delete('/deletebyid',adminauth,async(req,res)=>{
    const {id} = req.body
    Unique.deleteMany({_id:id})
    .then(resl=>{
        res.json(resl)
    }).catch(err => res.status(400).json(err))
})

router.post('/addlogs',adminauth, (req,res)=>{
    const { Type,id,appId, campaignId, rtbreqid, date, region, ifa } = req.body
    if(!Type || !appId || !campaignId || !rtbreqid || !date){
        return res.status(422).json()
    }
    const logs = new trackinglogs({
        Type,id,appId,campaignId, rtbreqid, date, region, ifa
    })
    logs.save()
    .then(result =>{
        res.json(result)
    })
    .catch(err=>console.log(err))
})

router.put('/updatelog/:id',adminauth,(req,res)=>{
    const { appId, campaignId, rtbreqid, region, ifa } = req.body
    trackinglogs.findById(req.params.id)
    .then(log=>{
        if(appId){log.appId = appId}
        if(campaignId){log.campaignId = campaignId}
        if(rtbreqid){log.rtbreqid = rtbreqid}
        if(region){log.region = region}
        if(ifa){log.ifa = ifa}
        log.save()
        .then(editedlog=>{
            res.json(editedlog)
        })
        .catch(err=>console.log(err))
    })
    .catch(err=>console.log(err))
})

module.exports = router