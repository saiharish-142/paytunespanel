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

router.get('/grouped',adminauth,(req,res)=>{
    StreamingAds.aggregate([
        {$project:{
            AdTitle:{$toLower:"$AdTitle"},
            Category:"$Category",
            Advertiser:"$Advertiser",
            Pricing:"$Pricing", 
            PricingModel:"$PricingModel",
            createdOn:"$createdOn"
        }},{$project:{
            AdTitle:{$split:["$AdTitle","_"]},
            Category:"$Category",
            Advertiser:"$Advertiser",
            Pricing:"$Pricing", 
            PricingModel:"$PricingModel",
            createdOn:"$createdOn"
        }},{$project:{
            AdTitle:{$slice:["$AdTitle",2]} ,
            Category:"$Category",
            Advertiser:"$Advertiser",
            Pricing:"$Pricing", 
            PricingModel:"$PricingModel",
            createdOn:{$substr:["$createdOn",0,10]}
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
            },
            Category:"$Category",
            Advertiser:"$Advertiser",
            Pricing:"$Pricing", 
            PricingModel:"$PricingModel",
            createdOn:"$createdOn"
        }},{$sort: {createdOn: -1}},{$group:{
            _id:"$AdTitle",
            Category:{$push : "$Category"},
            Advertiser:{$push : "$Advertiser"},
            Pricing:{$push : "$Pricing"}, 
            PricingModel:{$push : "$PricingModel"},
            createdOn:{$push : "$createdOn"}
        }},{$project:{
            Adtitle:"$_id",
            Category:"$Category",
            Advertiser:"$Advertiser",
            Pricing:"$Pricing", 
            PricingModel:"$PricingModel",
            createdOn:{$arrayElemAt : ["$createdOn",0]}
        }},{$sort: {createdOn: -1}}
    ])
    .then((respo)=>{
        var data = [];
        data = respo
        data.forEach(ad => {
            var resCategory = [].concat.apply([], ad.Category);
            resCategory = [...new Set(resCategory)];
            ad.Category = resCategory
            var resAdvertiser = [].concat.apply([], ad.Advertiser);
            resAdvertiser = [...new Set(resAdvertiser)];
            ad.Advertiser = resAdvertiser
            var resPricing = [].concat.apply([], ad.Pricing);
            resPricing = [...new Set(resPricing)];
            ad.Pricing = resPricing
            var resPricingModel = [].concat.apply([], ad.PricingModel);
            resPricingModel = [...new Set(resPricingModel)];
            ad.PricingModel = resPricingModel
            return ad;
        })
        res.json(data)
    })
    .catch(err => console.log(err))
})

router.put('/groupedsingle',adminauth,(req,res)=>{
    const { adtitle } = req.body
    StreamingAds.aggregate([
        {$project:{
            AdTitle:{$toLower:"$AdTitle"},
            startDate:"$startDate",
            endDate:"$endDate",
            TargetImpressions:"$TargetImpressions",
            createdOn:"$createdOn"
        }},{$match:{
            AdTitle:{$regex:adtitle.toLowerCase()}
        }},{$project:{
            AdTitle:{$split:["$AdTitle","_"]},
            startDate:"$startDate",
            endDate:"$endDate",
            TargetImpressions:"$TargetImpressions",
            createdOn:"$createdOn"
        }},{$project:{
            AdTitle:{$slice:["$AdTitle",2]} ,
            startDate:"$startDate",
            endDate:"$endDate",
            TargetImpressions:"$TargetImpressions",
            createdOn:{$substr:["$createdOn",0,10]}
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
            },
            startDate:"$startDate",
            endDate:"$endDate",
            TargetImpressions:"$TargetImpressions",
            createdOn:"$createdOn"
        }},{$sort: {createdOn: -1}},{$group:{
            _id:"$AdTitle",
            startDate:{$push : "$startDate"},
            endDate:{$push : "$endDate"},
            TargetImpressions:{$push : "$TargetImpressions"}, 
            createdOn:{$push : "$createdOn"}
        }},{$project:{
            Adtitle:"$_id",
            startDate:"$startDate",
            endDate:"$endDate",
            TargetImpressions:"$TargetImpressions",
            createdOn:{$arrayElemAt : ["$createdOn",0]}
        }},{$sort: {createdOn: -1}}
    ])
    .then((respo)=>{
        var data = [];
        data = respo
        data.forEach(ad => {
            var resstartDate = [].concat.apply([], ad.startDate);
            resstartDate = [...new Set(resstartDate)];
            ad.startDate = resstartDate
            var resendDate = [].concat.apply([], ad.endDate);
            resendDate = [...new Set(resendDate)];
            ad.endDate = resendDate
            var tottar = 0;
            ad.TargetImpressions.forEach(num=> tottar += parseInt(num))
            ad.TargetImpressions = tottar
            return ad;
        })
        res.json(data)
    })
    .catch(err => console.log(err))
})
// ## $split and then $slice it 

router.put('/getids',adminauth, (req,res)=>{
    const { adtitle } = req.body
    StreamingAds.aggregate([
        {$project:{
            _id:"$_id", AdTitle:{$toLower:"$AdTitle"}
        }},{$match:{
            AdTitle:{$regex:adtitle.toLowerCase()}
        }},{$project:{
            id:"$_id"
        }}
    ])
    .then(resp=>{
        var ids = [];
        resp.map(re => {
            ids.push(re.id)
        })
        res.json(ids)
    })
    .catch(err=>console.log(err))
})

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