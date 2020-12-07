const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const trackinglogs = mongoose.model('trackinglogs')
const Report = mongoose.model('Report')
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

router.post('/testcom1',adminauth,async (req,res)  =>{
    const { campaignId, date } = req.body
    var resu = [];
    trackinglogs.aggregate([
        { $match: {
            "date":date
        } },
        {$facet:{
            "appIds":[
                {$group:{_id:{campaignId:"$campaignId",appId:"$appId"}}},
                {$group:{_id:"$_id.campaignId",ids:{$push:"$_id.appId"}}},
                {$project:{_id:0,campaignId:"$_id",ids:"$ids"}}
            ],
            "typeValues":[
                {$group:{_id:{campaignId:"$campaignId",type:"$type",appId:"$appId"}, count:{$sum:1}}},
                {$group:{_id:{appId:"$_id.appId",campaignId:"$_id.campaignId"}, result:{$push:{type:"$_id.type",count:"$count"}}}},
                {$group:{_id:"$_id.campaignId",report:{$push:{appId:"$_id.appId",result:"$result"}}}},
                {$project:{campaignId:"$_id", report:"$report", _id:0}}
            ],"typebyRegion":[
                {$group:{_id:{campaignId:"$campaignId",type:"$type",appId:"$appId",region:"$region"}, count:{$sum:1}}},
                {$group:{_id:{appId:"$_id.appId",campaignId:"$_id.campaignId",region:"$_id.region"}, result:{$push:{type:"$_id.type",count:"$count"}}}},
                {$group:{_id:{appId:"$_id.appId",campaignId:"$_id.campaignId"}, result:{$push:{region:"$_id.region",result:"$result"}}}},
                {$group:{_id:"$_id.campaignId",report:{$push:{appId:"$_id.appId",result:"$result"}}}},
                {$project:{_id:0,campaignId:"$_id",report:"$report"}}
            ],"typeByLan":[
                {$group:{_id:{campaignId:"$campaignId",type:"$type",appId:"$appId",language:"$language"}, count:{$sum:1}}},
                {$group:{_id:{campaignId:"$_id.campaignId",appId:"$_id.appId",language:"$_id.language"}, result:{$push:{type:"$_id.type",count:"$count"}}}},
                {$group:{_id:{appId:"$_id.appId",campaignId:"$_id.campaignId"}, result:{$push:{language:"$_id.language",result:"$result"}}}},
                {$group:{_id:"$_id.campaignId",report:{$push:{appId:"$_id.appId",result:"$result"}}}},
                {$project:{_id:0,campaignId:"$_id",report:"$report"}}
            ],"typeByOSV":[
                {$group:{_id:{campaignId:"$campaignId",type:"$type",appId:"$appId",osVersion:"$osVersion"}, count:{$sum:1}}},
                {$group:{_id:{campaignId:"$_id.campaignId",appId:"$_id.appId",osVersion:"$_id.osVersion"}, result:{$push:{type:"$_id.type",count:"$count"}}}},
                {$group:{_id:{appId:"$_id.appId",campaignId:"$_id.campaignId"}, result:{$push:{osVersion:"$_id.osVersion",result:"$result"}}}},
                {$group:{_id:"$_id.campaignId",report:{$push:{appId:"$_id.appId",result:"$result"}}}},
                {$project:{_id:0,campaignId:"$_id",report:"$report"}}
            ],"typeByPhModel":[
                {$group:{_id:{campaignId:"$campaignId",type:"$type",appId:"$appId",phoneModel:"$phoneModel"}, count:{$sum:1}}},
                {$group:{_id:{campaignId:"$_id.campaignId",appId:"$_id.appId",phoneModel:"$_id.phoneModel"}, result:{$push:{type:"$_id.type",count:"$count"}}}},
                {$group:{_id:{appId:"$_id.appId",campaignId:"$_id.campaignId"}, result:{$push:{phoneModel:"$_id.phoneModel",result:"$result"}}}},
                {$group:{_id:"$_id.campaignId",report:{$push:{appId:"$_id.appId",result:"$result"}}}},
                {$project:{_id:0,campaignId:"$_id",report:"$report"}}
            ],"typeByPT":[
                {$group:{_id:{campaignId:"$campaignId",type:"$type",appId:"$appId",platformType:"$platformType"}, count:{$sum:1}}},
                {$group:{_id:{campaignId:"$_id.campaignId",appId:"$_id.appId",platformType:"$_id.platformType"}, result:{$push:{type:"$_id.type",count:"$count"}}}},
                {$group:{_id:{appId:"$_id.appId",campaignId:"$_id.campaignId"}, result:{$push:{platformType:"$_id.platformType",result:"$result"}}}},
                {$group:{_id:"$_id.campaignId",report:{$push:{appId:"$_id.appId",result:"$result"}}}},
                {$project:{_id:0,campaignId:"$_id",report:"$report"}}
            ],"typeByPin":[
                {$group:{_id:{campaignId:"$campaignId",type:"$type",appId:"$appId",zip:"$zip"}, count:{$sum:1}}},
                {$group:{_id:{campaignId:"$_id.campaignId",appId:"$_id.appId",zip:"$_id.zip"}, result:{$push:{type:"$_id.type",count:"$count"}}}},
                {$group:{_id:{appId:"$_id.appId",campaignId:"$_id.campaignId"}, result:{$push:{zip:"$_id.zip",result:"$result"}}}},
                {$group:{_id:"$_id.campaignId",report:{$push:{appId:"$_id.appId",result:"$result"}}}},
                {$project:{_id:0,campaignId:"$_id",report:"$report"}}
            ]
        }}
    ])
    .then(result=>{
        resu = result;
        res.json(resu)
    })
    .catch(err => console.log(err))
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