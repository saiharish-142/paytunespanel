const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const StreamingAds = mongoose.model('streamingads')
const adminauth = require('../authenMiddleware/adminauth')

router.get('/allads',adminauth,(req,res)=>{
    StreamingAds.find()
    .sort('-updatedAt')
    .then(ads=>{
        res.json(ads)
    })
    .catch(err => console.log(err))
})

router.post('/addAds',adminauth,(req,res)=>{
    const {
        AdTitle, adType,
        offset, Category,
        Description, Advertiser,
        AudioPricing, BannerPricing,
        Pricing, PricingModel,
        Expires, minAge,
        maxAge, Gender,
        Billing, enable,
        Genre, platformType,
        language, ConnectionType,
        phoneValue, phoneType,
        ARPU, City,
        State, Age,
        Companion, Linear,
        endDate, startDate,
        Duration, maxARPU,
        minARPU, TargetImpressions
    } = req.body
    if(!AdTitle || !Category || !Advertiser){
        return res.status(422).json({error:"Enter the required Fields"})
    }
    const streamad = new StreamingAds({
        AdTitle, adType,
        offset, Category,
        Description, Advertiser,
        AudioPricing, BannerPricing,
        Pricing, PricingModel,
        Expires, minAge,
        maxAge, Gender,
        Billing, enable,
        Genre, platformType,
        language, ConnectionType,
        phoneValue, phoneType,
        ARPU, City,
        State, Age,
        Companion, Linear,
        endDate, startDate,
        Duration, maxARPU,
        minARPU, TargetImpressions
    })
    streamad.save()
    .then(result=>{
        res.json(result)
    })
    .catch(err=>console.log(err))
})

module.exports = router