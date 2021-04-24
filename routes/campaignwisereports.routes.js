const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const adminauth  = require('../authenMiddleware/adminauth')
const campaignwisereports = mongoose.model('campaignwisereports')
const StreamingAds = mongoose.model('streamingads')
const publisherapps = mongoose.model('publisherapps')

router.get('/reports',adminauth,(req,res)=>{
    campaignwisereports.find()
    .limit(300)
    .then(result=>{
        res.json(result)
    })
    .catch(er => res.status(400).json(er))
})

router.put('/reportbydate',adminauth,(req,res)=>{
    const { date } = req.body
    campaignwisereports.find({date:date})
    .sort('-date')
    .then(reports=>{
        var data = reports;
        data = data.filter(x => x.appId!== "")
        publisherapps.populate(data,{path:'appId'},function(err,populatedreports){
            if(err){
                res.status(422).json(err)
            }
            res.json(populatedreports)
        })
    })
    .catch(err=>console.log(err))
})

router.put('/reportbydatereq',adminauth,(req,res)=>{
    const { date, campaignId, appId } = req.body
    var id = mongoose.Types.ObjectId(campaignId)
    campaignwisereports.find({date:date, campaignId:id, appId:appId})
    .sort('-date')
    .then(reports=>{
        var data = reports;
        data = data.filter(x => x.appId!== "")
        publisherapps.populate(data,{path:'appId'},function(err,populatedreports){
            if(err){
                res.status(422).json(err)
            }
            res.json(populatedreports)
        })
    })
    .catch(err=>console.log(err))
})

router.put('/detreportcambydat',adminauth,(req,res)=>{
    const { campaignId } = req.body
    var ids = campaignId.map(id => mongoose.Types.ObjectId(id))
    var resu = [];
    campaignwisereports.aggregate([
        {$match:{
            "campaignId":{$in : ids}
        }},{$group:{
            _id:{date:"$date"},updatedAt:{$push:'$createdOn'}, impressions:{$sum:"$impression"}, complete:{$sum:"$completedAudioImpressions"}, clicks:{$sum:"$CompanionClickTracking"}, region:{$push:"$region"}
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
            det.updatedAt = updatedDate
        })
        res.json(resu)
    })
    .catch(err=>console.log(err))
})

router.put('/sumreportofcam22',adminauth,(req,res)=>{
    const { campaignId } = req.body
    var ids = campaignId.map(id => mongoose.Types.ObjectId(id))
    var resu = [];
    campaignwisereports.aggregate([
        {$match:{
            "campaignId":{$in:ids}
        }},{$group:{
            _id:"$appId", 
            updatedAt:{$push:"$createdOn"}, 
            camp:{$push:"$campaignId"} , 
            impressions:{$sum:"$impression"}, 
            complete:{$sum:"$completedAudioImpressions"}, 
            clicks:{$sum:"$CompanionClickTracking"},
            thirdQuartile:{$sum:"$thirdQuartile"}, 
            firstQuartile:{$sum:"$firstQuartile"}, 
            midpoint:{$sum:"$midpoint"}
        }},{$project:{
            Publisher:"$_id", 
            updatedAt:"$updatedAt", 
            campaignId:"$camp", 
            impressions:"$impressions", 
            complete:"$complete", 
            clicks:"$clicks" ,
            midpoint:"$midpoint", 
            firstQuartile:"$firstQuartile", 
            thirdQuartile:"$thirdQuartile",
            _id:0
        }}
    ])
    .then(reports=>{
        var data = reports;
        data = data.filter(x => x.Publisher!== "")
        publisherapps.populate(data,{path:'Publisher'},function(err,populatedreports){
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
                det.updatedAt = updatedDate
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

router.put('/sumreportofcamall',adminauth,(req,res)=>{
    const { campaignId } = req.body
    var ids = campaignId.map(id => mongoose.Types.ObjectId(id))
    var audio = campaignId.audio.map(id => mongoose.Types.ObjectId(id))
    var display = campaignId.display.map(id => mongoose.Types.ObjectId(id))
    var video = campaignId.video.map(id => mongoose.Types.ObjectId(id))
    var resu = [];
    campaignwisereports.aggregate([
        {$match:{
            "campaignId":{$in:ids}
        }},{$group:{
            _id:"$appId", 
            updatedAt:{$push:"$createdOn"}, 
            camp:{$push:"$campaignId"} , 
            impressions:{$sum:"$impression"}, 
            complete:{$sum:"$completedAudioImpressions"}, 
            clicks:{$sum:"$CompanionClickTracking"},
            thirdQuartile:{$sum:"$thirdQuartile"}, 
            firstQuartile:{$sum:"$firstQuartile"}, 
            midpoint:{$sum:"$midpoint"}
        }},{$project:{
            Publisher:"$_id", 
            updatedAt:"$updatedAt", 
            campaignId:"$camp", 
            impressions:"$impressions", 
            complete:"$complete", 
            clicks:"$clicks" ,
            midpoint:"$midpoint", 
            firstQuartile:"$firstQuartile", 
            thirdQuartile:"$thirdQuartile",
            _id:0
        }}
    ])
    .then(reports=>{
        var data = reports;
        data = data.filter(x => x.Publisher!== "")
        publisherapps.populate(data,{path:'Publisher'},function(err,populatedreports){
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
                det.updatedAt = updatedDate
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
    var ids = campaignId.map(id => mongoose.Types.ObjectId(id))
    campaignwisereports.find({campaignId:{$in : ids}})
    .sort('-date')
    .then(reports=>{
        var data = reports;
        var data2 = [];
        data = data.filter(x => x.appId!== "")
        data2 = reports.filter(x=>!data.includes(x))
        publisherapps.populate(data,{path:'appId'},function(err,populatedreports){
            if(err){
                console.log(err)
                res.status(422).json({err,data,data2})
            }
            res.json(populatedreports)
        })
    })
    .catch(err=>console.log(err))
})

router.put('/detreportbycamp',adminauth,(req,res)=>{
    const { campaignId, date } = req.body
    var id = mongoose.Types.ObjectId(campaignId)
    campaignwisereports.findOneAndUpdate({campaignId:id,date:date})
    .sort('-date')
    .then(reports=>{
        var data = reports;
        var data2 = [];
        data = data.filter(x => x.appId!== "")
        publisherapps.populate(data,{path:'appId'},function(err,populatedreports){
            if(err){
                res.status(422).json(err)
            }
            res.json(populatedreports)
        })
    })
    .catch(err=>console.log(err))
})

module.exports = router