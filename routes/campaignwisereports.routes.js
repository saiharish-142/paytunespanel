const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const adminauth  = require('../authenMiddleware/adminauth')
const campaignwisereports = mongoose.model('campaignwisereports')
const StreamingAds = mongoose.model('streamingads')
const publisherapps = mongoose.model('publisherapps')

router.get('/reports',adminauth,(req,res)=>{
    campaignwisereports.find()
    .then(result=>{
        res.json(result)
    })
    .catch(er => res.status(400).json(er))
})

router.put('/reportbydate',adminauth,(req,res)=>{
    const { date } = req.body
    Report.find({date:date})
    .populate('Publisher')
    .sort('-date')
    .then(reports=>{
        res.json(reports)
    })
    .catch(err=>console.log(err))
})

router.put('/reportbydatereq',adminauth,(req,res)=>{
    const { date, campaignId, appId } = req.body
    Report.find({date:date, campaignId:campaignId, Publisher:appId})
    .populate('Publisher')
    .sort('-date')
    .then(reports=>{
        res.json(reports)
    })
    .catch(err=>console.log(err))
})

router.put('/detreportcambydat',adminauth,(req,res)=>{
    const { campaignId } = req.body
    var resu = [];
    campaignwisereports.aggregate([
        {$match:{
            "campaignId":{$in : campaignId}
        }},{$group:{
            _id:{date:"$date"},updatedAt:{$push:'$createdOn'}, impressions:{$sum:"$impressions"}, complete:{$sum:"$complete"}, clicks:{$sum:"$clicks"}, region:{$push:"$region"}
        }},{$project:{
            date:"$_id.date", updatedAt:"$updatedAt", impressions:"$impressions", complete:"$complete", clicks:"$clicks", region:"$region", _id:0
        }},{$sort: {date: -1}}
    ])
    .then(reports=>{
        resu = reports;
        resu.map((det)=>{
            var resregion = [].concat.apply([], det.region);
            resregion = [...new Set(resregion)];
            det.region = resregion
            var updatedDate = det.updatedAt
            updatedDate.sort(function(a,b){
                return new Date(b) - new Date(a);
            });
            det.updatedAt = updatedDate && updatedDate[0]
        })
        res.json(resu)
    })
    .catch(err=>console.log(err))
})

router.put('/sumreportofcam22',adminauth,(req,res)=>{
    const { campaignId } = req.body
    var resu = [];
    campaignwisereports.aggregate([
        {$match:{
            "campaignId":{$in:campaignId}
        }},{$group:{
            _id:"$Publisher", updatedAt:{$push:"$createdOn"}, camp:{$push:"$campaignId"} , impressions:{$sum:"$impressions"}, complete:{$sum:"$complete"}, clicks:{$sum:"$clicks"}, region:{$push:"$region"}
        }},{$project:{
            Publisher:"$_id", updatedAt:"$updatedAt", campaignId:"$camp", impressions:"$impressions", complete:"$complete", clicks:"$clicks", region:"$region", _id:0
        }}
    ])
    .then(reports=>{
        publisherapps.populate(reports,{path:'Publisher'},function(err,populatedreports){
            if(err){
                return res.status(422).json(err)
            }
            resu = populatedreports;
            // console.log(populatedreports)
            resu.map((det)=>{
                var resregion = [].concat.apply([], det.region);
                resregion = [...new Set(resregion)];
                det.region = resregion
                var rescampaignId = [].concat.apply([], det.campaignId);
                rescampaignId = [...new Set(rescampaignId)];
                det.campaignId = rescampaignId[0]
                var updatedDate = det.updatedAt
                updatedDate.sort(function(a,b){
                    return new Date(b) - new Date(a);
                });
                det.updatedAt = updatedDate && updatedDate[0]
            })
            StreamingAds.populate(resu,{path:'campaignId'},function(err,populatedres){
                if(err){
                    return res.status(422).json(resu)
                }
                res.json(populatedres)
            })
        })
    })
    .catch(err=>console.log(err))
})


router.put('/reportbycamp',adminauth,(req,res)=>{
    const { campaignId } = req.body
    campaignwisereports.find({campaignId:{$in : campaignId}})
    .populate('Publisher')
    .sort('-date')
    .then(reports=>{
        res.json(reports)
    })
    .catch(err=>console.log(err))
})

router.put('/detreportbycamp',adminauth,(req,res)=>{
    const { campaignId, date } = req.body
    campaignwisereports.findOneAndUpdate({campaignId:campaignId,date:date})
    .populate('Publisher')
    .sort('-date')
    .then(reports=>{
        if(!reports){
            console.log('good')
        }else{
            console.log('bad')
        }
        res.json(reports)
    })
    .catch(err=>console.log(err))
})

module.exports = router