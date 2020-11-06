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
            return res.status(422).json({error:"not found",result})
        }
        res.json(logs)
    })
    .catch(err => console.log(err))
})

router.get('/trackinglogs/:id',adminauth,(req,res)=>{
    trackinglogs.find({_id:req.params.id})
    .then(logs=>{
        if(!logs.length){
            return res.status(422).json({error:"not found",result})
        }
        res.json(logs)
    })
    .catch(err => console.log(err))
})

router.post('/logbyDate/:num',adminauth,(req,res)=>{
    var dat = new Date(req.body.date)
    const num = req.params.num
    trackinglogs.find({createdOn:{$gte : dat}})
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

router.post('/creareport',adminauth,(req,res)=>{
    const { campaignId, date, tdate } = req.body
    var dat = new Date(date)
    var tdat = new Date(tdate)
    var Ldata = [];
    var data = [];
    var fdata = [];
    var i=0;
    console.log('started',dat,tdat)
    async function reportMaker(){
        trackinglogs.find({createdOn:{$lte:dat}})
        .sort('-createdOn')
        .limit(1000)
        .skip(1000*i)
        .then(async (result)=>{
            data = result
            data = await data.filter(x=>x.campaignId.equals(campaignId))
            Ldata = await data.filter(x=>{
                var d = new Date(x.createdOn)
                if(d<=tdat){
                    return x;
                }
            })
            fdata = fdata.concat(data)
            console.log(data.length,`completed round ${i} in campaign`,fdata.length)
            i++;
            // if(result.length===0 || Ldata.length>1){
                // clearInterval(timer)
                if(fdata.length===0)
                console.log('noo logs found')
                if(fdata.length>0){
                    // publisherfinder(fdata,date,campaignId)
                }
                return res.json({message:'no more logs available',fdata,data})
            // }else{console.log('done')}
            // region = await data.map(log => {return log.region })
        })
        .catch(err => {
            console.log(err)
            clearInterval(timer)
            // publisherfinder(fdata,date,campaignId)
        })
    }
    var timer = setInterval(reportMaker, 300000)
})

async function publisherfinder({logs,date,campaignId}){
    var app = [];
    var applogs = [];
    var i = 0;
    function removeDuplicates(originalArray, prop) {
        var newArray = [];
        var lookupObject  = {};
    
        for(var i in originalArray) {
            lookupObject[originalArray[i][prop]] = originalArray[i];
        }
    
        for(i in lookupObject) {
            newArray.push(lookupObject[i]);
        }
        return newArray;
    }
    
    // var logs = await removeDuplicates(jlogs, "_id");
    publisherapps.find()
    .then(async (result)=>{
        app = await result.map(x => x._id)
        async function midware(){
            applogs = await logs.filter(x => x.appId.equals(app[i]))
            if(app[i]!== undefined){
            console.log(app[i],logs)
            reportposter(applogs,app[i],date,campaignId)}
            if(i>=app.length){
                clearInterval(tim)
            }
            i++;
        }
        var tim = setInterval(midware, 3000)
    })
    .catch(err => console.log(err))
}

async function reportposter({logsFiltered,appid,date,campaignId}){
    var region = [];
    var complete = [];
    var clicked = [];
    var clicked2 = [];
    var impressions = [];
    // var start = [];
    region = await logsFiltered.map(x => { return x.region })
    region = [...new Set(region)];
    complete = await logsFiltered.filter(x => x.type==='complete')
    impressions = await data.filter(x => x.type==='impression')
    // start = await data.filter(x => x.type==='start')
    if(appid.equals('5f91ca4441375c24943f4756')){
        clicked = logsFiltered.filter(x=>x.type==='clicktracking')
        clicked2 = logsFiltered.filter(x => x.type==='click')
        clicked = clicked.concat(clicked2)
    }else{
        clicked = logsFiltered.filter(x=>x.type==='companionclicktracking')
        clicked2 = logsFiltered.filter(x => x.type==='click')
        clicked = clicked.concat(clicked2)
    }
    const report = new Report({
        date:date,
        Publisher:appid,
        campaignId:campaignId,
        impressions:impressions.length,
        complete:complete.length,
        clicks:clicked.length,
        region:region,
        Spend:logsFiltered.length + ' USD',
        avgSpend:logsFiltered.length
    })
    report.save()
    .then(reul => console.log(reul))
    .catch(err => console.log(err))
}

router.post('/logbtdet/:num',adminauth,(req,res)  =>{
    var data = [];
    var data2 = [];
    var dat = new Date(req.body.date)
    var dat2 = new Date(req.body.date2)
    const num = req.params.num
    trackinglogs.find({
        createdOn:{$gte: dat}
    })
    .sort('-createdOn')
    .limit(1000)
    .skip(1000*num)
    .then(async (result)=>{
        data = await result
        data = await data.filter(x => x.campaignId!== undefined)
        data = await data.filter(x => x.campaignId!== null)
        data = await data.filter(x => x.campaignId.equals(req.body.campaignId))
        data2 = data.map(x => {return {id:x.campaignId, cam:req.body.campaignId , match:x.campaignId.equals(req.body.campaignId)}})
        // data = data.map(x => {x.campaignId,req.body.campaignId,x.campaignId===req.body.campaignId})
        if(!result.length){
            return res.status(422).json({error:"not found",result})
        }
        await res.json({data,data2})
    })
    .catch(err => console.log(err))
})

router.post('/logbtdet',adminauth,(req,res)=>{
    var dat = new Date(req.body.date)
    trackinglogs.find({
        campaignId:req.body.campaignId,
        createdOn:{$gte : dat},
        appId:req.body.appId
    })
    .sort('-createdOn')
    .limit(100)
    .then(result=>{
        if(!result.length){
            return res.status(422).json({error:"not found",result})
        }
        res.json(result)
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