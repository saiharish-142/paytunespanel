const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const StreamingAds = mongoose.model('streamingads')
const adsetting = mongoose.model('adsetting')
const adminauth = require('../authenMiddleware/adminauth')

router.get('/',adminauth,(req,res)=>{
    StreamingAds.find()
    .sort('-createdOn')
    .then(ads=>{
        res.json(ads)
    })
    .catch(err => console.log(err))
})

router.put('/byids',adminauth,(req,res)=>{
    const { campaignId } = req.body
    var ids = campaignId ? campaignId.map(id=>mongoose.Types.ObjectId(id)) : dumd    
    StreamingAds.find({_id:{$in:ids}})
    .sort('-createdOn')
    .then(ads=>{
        res.json(ads)
    })
    .catch(err => console.log(err))
})

router.get('/names',adminauth,(req,res)=>{
    StreamingAds.find({},{_id:1,AdTitle:1})
    .sort('-createdOn')
    .then(ads=>{
        res.json(ads)
    })
    .catch(err => console.log(err))
})

router.get('/allads',adminauth,(req,res)=>{
    StreamingAds.find({},{_id:1,AdTitle:1,Advertiser:1,Category:1,Pricing:1,PricingModel:1,startDate:1,endDate:1,createdOn:1})
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

router.put('/reqtarget',adminauth,(req,res)=>{
    const {ids} = req.body
    StreamingAds.find({_id:{$in:ids}})
    .then(result=>{
        var resu = result;
        var resd = [];
        resu.map(ad => resd.push({_id:ad._id,TargetImpressions:ad.TargetImpressions}))
        res.json(resd)
    })
    .catch(err=>{
        console.log(err)
        res.status(404).json(err)
    })
})

router.get('/grouped',adminauth,(req,res)=>{
    StreamingAds.aggregate([
        {$project:{
            AdTitle:{$toLower:"$AdTitle"},
            Category:"$Category",
            startDate:"$startDate",
            endDate:"$endDate",
            Advertiser:"$Advertiser",
            Pricing:"$Pricing", 
            PricingModel:"$PricingModel",
            createdOn:"$createdOn"
        }},{$project:{
            AdTitle:{$split:["$AdTitle","_"]},
            Category:"$Category",
            Advertiser:"$Advertiser",
            Pricing:"$Pricing", 
            startDate:"$startDate",
            endDate:"$endDate",
            PricingModel:"$PricingModel",
            createdOn:"$createdOn"
        }},{$project:{
            AdTitle:{$slice:["$AdTitle",2]} ,
            Category:"$Category",
            Advertiser:"$Advertiser",
            Pricing:"$Pricing", 
            startDate:"$startDate",
            endDate:"$endDate",
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
            startDate:"$startDate",
            endDate:"$endDate",
            Advertiser:"$Advertiser",
            Pricing:"$Pricing", 
            PricingModel:"$PricingModel",
            createdOn:"$createdOn"
        }},{$sort: {createdOn: -1}},{$group:{
            _id:"$AdTitle",
            Category:{$push : "$Category"},
            Advertiser:{$push : "$Advertiser"},
            Pricing:{$push : "$Pricing"},
            startDate:{$push : "$startDate"},
            endDate:{$push : "$endDate"}, 
            PricingModel:{$push : "$PricingModel"},
            createdOn:{$push : "$createdOn"}
        }},{$project:{
            Adtitle:"$_id",
            Category:"$Category",
            Advertiser:"$Advertiser",
            Pricing:"$Pricing", 
            startDate:"$startDate",
            endDate:"$endDate",
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

router.put('/clientgrouped',adminauth,(req,res)=>{
    const {Advertiser} = req.body
    StreamingAds.aggregate([
        {$match:{"Advertiser":Advertiser}},
        {$project:{
            AdTitle:{$toLower:"$AdTitle"},
            Category:"$Category",
            startDate:"$startDate",
            endDate:"$endDate",
            Advertiser:"$Advertiser",
            Pricing:"$Pricing", 
            PricingModel:"$PricingModel",
            createdOn:"$createdOn"
        }},{$project:{
            AdTitle:{$split:["$AdTitle","_"]},
            Category:"$Category",
            Advertiser:"$Advertiser",
            Pricing:"$Pricing", 
            startDate:"$startDate",
            endDate:"$endDate",
            PricingModel:"$PricingModel",
            createdOn:"$createdOn"
        }},{$project:{
            AdTitle:{$slice:["$AdTitle",2]} ,
            Category:"$Category",
            Advertiser:"$Advertiser",
            Pricing:"$Pricing", 
            startDate:"$startDate",
            endDate:"$endDate",
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
            startDate:"$startDate",
            endDate:"$endDate",
            Advertiser:"$Advertiser",
            Pricing:"$Pricing", 
            PricingModel:"$PricingModel",
            createdOn:"$createdOn"
        }},{$sort: {createdOn: -1}},{$group:{
            _id:"$AdTitle",
            Category:{$push : "$Category"},
            Advertiser:{$push : "$Advertiser"},
            Pricing:{$push : "$Pricing"},
            startDate:{$push : "$startDate"},
            endDate:{$push : "$endDate"}, 
            PricingModel:{$push : "$PricingModel"},
            createdOn:{$push : "$createdOn"}
        }},{$project:{
            Adtitle:"$_id",
            Category:"$Category",
            Advertiser:"$Advertiser",
            Pricing:"$Pricing", 
            startDate:"$startDate",
            endDate:"$endDate",
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

router.put('/clientgroupedbyids',adminauth,(req,res)=>{
    const { campaignId } = req.body
    var ids = campaignId ? campaignId.map(id=>mongoose.Types.ObjectId(id)) : dumd    
    StreamingAds.aggregate([
        {$match:{"_id":{$in:ids}}},
        {$project:{
            AdTitle:{$toLower:"$AdTitle"},
            Category:"$Category",
            startDate:"$startDate",
            endDate:"$endDate",
            Advertiser:"$Advertiser",
            Pricing:"$Pricing", 
            PricingModel:"$PricingModel",
            createdOn:"$createdOn"
        }},{$project:{
            AdTitle:{$split:["$AdTitle","_"]},
            Category:"$Category",
            Advertiser:"$Advertiser",
            Pricing:"$Pricing", 
            startDate:"$startDate",
            endDate:"$endDate",
            PricingModel:"$PricingModel",
            createdOn:"$createdOn"
        }},{$project:{
            AdTitle:{$slice:["$AdTitle",2]} ,
            Category:"$Category",
            Advertiser:"$Advertiser",
            Pricing:"$Pricing", 
            startDate:"$startDate",
            endDate:"$endDate",
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
            startDate:"$startDate",
            endDate:"$endDate",
            Advertiser:"$Advertiser",
            Pricing:"$Pricing", 
            PricingModel:"$PricingModel",
            createdOn:"$createdOn"
        }},{$sort: {createdOn: -1}},{$group:{
            _id:"$AdTitle",
            Category:{$push : "$Category"},
            Advertiser:{$push : "$Advertiser"},
            Pricing:{$push : "$Pricing"},
            startDate:{$push : "$startDate"},
            endDate:{$push : "$endDate"}, 
            PricingModel:{$push : "$PricingModel"},
            createdOn:{$push : "$createdOn"}
        }},{$project:{
            Adtitle:"$_id",
            Category:"$Category",
            Advertiser:"$Advertiser",
            Pricing:"$Pricing", 
            startDate:"$startDate",
            endDate:"$endDate",
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
            id:"$_id",
            AdTitle:{$toLower:"$AdTitle"},
            startDate:"$startDate",
            endDate:"$endDate",
            TargetImpressions:"$TargetImpressions",
            createdOn:"$createdOn"
        }},{$match:{
            AdTitle:{$regex:adtitle.toLowerCase()}
        }},{$project:{
            id:"$id",
            AdTitle:{$split:["$AdTitle","_"]},
            startDate:"$startDate",
            endDate:"$endDate",
            TargetImpressions:"$TargetImpressions",
            createdOn:"$createdOn"
        }},{$project:{
            id:"$id",
            AdTitle:{$slice:["$AdTitle",2]} ,
            startDate:"$startDate",
            endDate:"$endDate",
            TargetImpressions:"$TargetImpressions",
            createdOn:{$substr:["$createdOn",0,10]}
        }},{$project:{
            id:"$id",
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
            id:{$push:"$id"},
            _id:"$AdTitle",
            startDate:{$push : "$startDate"},
            endDate:{$push : "$endDate"},
            TargetImpressions:{$push :{TR: "$TargetImpressions",id:"$id"}}, 
            createdOn:{$push : "$createdOn"}
        }},{$project:{
            id:"$id",
            Adtitle:"$_id",
            startDate:"$startDate",
            endDate:"$endDate",
            TargetImpressions:"$TargetImpressions",
            createdOn:{$arrayElemAt : ["$createdOn",0]}
        }},{$sort: {createdOn: -1}}
    ])
    .then(async (respo)=>{
        var data;
        data = respo.length && respo[0];
        if(data){
            var ids = (typeof campaignId !== 'undefined' && 
                typeof campaignId !== 'string' && 
                typeof campaignId !== 'object') ? 
                data.id.map(id=>mongoose.Types.ObjectId(id)) : data.id
            let id_spliter = await adsetting.find({campaignId:{$in:ids}},{campaignId:1,type:1}).catch(err=>console.log(err))
            data.ids = {audio:[],display:[],video:[]}
            if(id_spliter.length){
                // 
            }else{
                data.ids.audio && data.ids.audio.concat(ids)
            }
            var resstartDate = [].concat.apply([], data.startDate);
            resstartDate = [...new Set(resstartDate)];
            data.startDate = resstartDate
            var resendDate = [].concat.apply([], data.endDate);
            resendDate = [...new Set(resendDate)];
            data.endDate = resendDate
            data.splendid = id_spliter
            // var tottar = 0;
            // data.TargetImpressions.forEach(num=> tottar += parseInt(num))
            // data.TargetImpressions = tottar
            res.json(data)
        }else{
            res.status(422).json({error:"somthing went wrong try again"})
        }
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