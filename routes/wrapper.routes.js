const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const Wrapper = mongoose.model('wrappers')
const adminauth = require('../authenMiddleware/adminauth')

router.get('/allwrappers',(req,res)=>{
    Wrapper.find()
    .then(result=>{
        res.json(result)
    })
    .catch(err=>console.log(err))
})

router.post('/addwrapper',adminauth,(req,res)=>{
    const {
        bidid, Type, rtbreqId,
        appId, campaignId, userid,
        dpidmd, dpidsha, ifa,
        city, region, price, impressions,
        burl, click, error, frequencycheck
    } = req.body
    if(!bidid || !Type || !appId || !campaignId || !rtbreqId || !userid){
        return res.status(422).json({error:'Enter all Fields'})
    }
    const wrap = new Wrapper({
        bidid, Type, appId, rtbreqId, campaignId, userid,
        dpidmd, dpidsha, ifa, city, region, price,
        impressions, burl, click, error, frequencycheck
    })
    wrap.save()
    .then(result=>{
        res.json(result)
    })
    .catch(err=>console.log(err))
})

module.exports = router