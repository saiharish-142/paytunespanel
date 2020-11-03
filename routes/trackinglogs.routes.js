const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const trackinglogs = mongoose.model('trackinglogs')
const adminauth = require('../authenMiddleware/adminauth')

router.get('/trackinglogs',adminauth,(req,res)=>{
    trackinglogs.find()
    .limit(100)
    .then(logs=>{
        res.json(logs)
    })
    .catch(err => console.log(err))
})

router.get('/trackinglogs/:id',adminauth,(req,res)=>{
    trackinglogs.find({_id:req.params.id})
    .then(logs=>{
        res.json(logs)
    })
    .catch(err => console.log(err))
})

router.get('/logbyDate',adminauth,(req,res)=>{
    trackinglogs.find({date:req.body.date})
    .then(result=>{
        res.json(result)
    })
    .catch(err=>{
        console.log(err)
    })
})

router.get('/logbyDate/:num',adminauth,(req,res)=>{
    trackinglogs.find({date:req.body.date})
    .limit(100)
    .skip(100*num)
    .then(result=>{
        res.json(result)
    })
    .catch(err=>{
        console.log(err)
    })
})

router.get('/logbtdet',adminauth,(req,res)=>{
    trackinglogs.find({
        date:req.body.date,
        campaignId:req.body.campaignId
    })
    .then(result=>{
        res.json(result)
    })
    .catch(err => console.log(err))
})

router.get('/logbtdet',adminauth,(req,res)=>{
    trackinglogs.find({
        date:req.body.date,
        campaignId:req.body.campaignId,
        appId:req.body.appId
    })
    .then(result=>{
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