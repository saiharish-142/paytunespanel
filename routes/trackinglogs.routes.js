const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const trackinglogs = mongoose.model('trackinglogs')
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

router.post('/logbtdet/:num',adminauth,(req,res)=>{
    var data = [];
    var dat = new Date(req.body.date)
    var dat2 = new Date(req.body.date2)
    const num = req.params.num
    trackinglogs.find({
        createdOn:{$gte: dat}
    })
    .sort('-createdOn')
    .limit(1000)
    .skip(1000*num)
    .then(result=>{
        data = result
        data = data.filter(x => x.campaignId === req.body.campaignId)
        data = data.filter(x => x.createdOn < dat2)
        if(!result.length){
            return res.status(422).json({error:"not found",data})
        }
        res.json(result)
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