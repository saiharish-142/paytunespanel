const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const StreamingAds = mongoose.model('streamingads')
const adminauth = require('../authenMiddleware/adminauth')

router.get('/allads',adminauth,(req,res)=>{
    StreamingAds.find()
    .sort('-createdOn')
    .then(ads=>{
        res.json(ads)
    })
    .catch(err => console.log(err))
})

router.get('/allads/:id',adminauth,(req,res)=>{
    StreamingAds.find({_id:req.params.id})
    .sort('-createdOn')
    .then(ads=>{
        res.json(ads)
    })
    .catch(err => console.log(err))
})

router.put('/updatename/:id',adminauth,(req,res)=>{
    StreamingAds.findById(req.params.id)
    .then(streamad=>{
        if(req.body.adtitle){
            streamad.AdTitle = req.body.adtitle
        }
        streamad.save()
        .then(result=>{
            res.json({result,message:"title updated"})
        })
        .catch(err => console.log(err))
    })
    .catch(err => console.log(err))
})

router.put('/grouped',adminauth,(req,res)=>{
    StreamingAds.aggregate([
        {$project:{
            AdTitle:{$split:["$AdTitle","_"]},Category:"$Category"
        }},{$project:{
            AdTitle:{$slice:["$AdTitle",2]} ,Category:"$Category"
        }},{$project:{
            AdTitle:{
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
            }, Category:"$Category"
        }},{$group:{
            _id:"$AdTitle", count:{$sum:1}, Category:"$Category"
        }}
    ])
    .then(respo=>res.json(respo))
    .catch(err => console.log(err))
})
// ## $split and then $slice it 

router.get('/alladsp',adminauth,(req,res)=>{
    StreamingAds.find({endDate:{$gte:req.body.date}})
    .sort('-createdOn')
    .then(ads=>{
        res.json(ads)
    })
    .catch(err => console.log(err))
})

router.get('/allads2',adminauth,(req,res)=>{
    const { date } = req.body
    var dat = new Date(date)
    StreamingAds.find({createdAt:{$gte:dat}})
    .sort('-createdOn')
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

// MyModel.find({$text: {$search: searchString}})
//        .skip(20)
//        .limit(10)
//        .exec(function(err, docs) { ... });