const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const adminauth  = require('../authenMiddleware/adminauth')
const campaignwisereports = mongoose.model('campaignwisereports')
const StreamingAds = mongoose.model('streamingads')
const publisherapps = mongoose.model('publisherapps')
const apppublishers = mongoose.model('apppublishers')

router.get('/reports',adminauth,(req,res)=>{
    campaignwisereports.aggregate([
        {$lookup:{
            from:'apppublishers',
            localField:'apppubid',
            foreignField:'publisherid',
            as:'apppubidpo'
        }},
        { $limit : 300 }
    ])
    .then(async (result)=>{
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

router.put('/sumreportofcamtest',adminauth,(req,res)=>{
    const { test1 } = req.body
    var ids = test1.map(id => mongoose.Types.ObjectId(id))
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

const removeDuplicates = inputArray => {
    const ids = [];
    return inputArray.reduce((sum, element) => {
        if(!ids.includes(element.toString())){
            sum.push(element);
            ids.push(element.toString());
        }
       return sum;
    }, []);
};

function remove_duplicates_arrayobject (gotarray,unique){
    var obj = {};
    var array = gotarray;
    // console.log(array)
    for ( var i=0, len=array.length; i < len; i++ )
        obj[array[i][unique]] = array[i];

    array = new Array();
    for ( var key in obj )
        array.push(obj[key]);

    return array;
}

router.put('/sumreportofcamall',adminauth,(req,res)=>{
    const { campaignId } = req.body
    // var ids = campaignId.map(id => mongoose.Types.ObjectId(id))
    var audio = campaignId.audio.map(id => mongoose.Types.ObjectId(id))
    var display = campaignId.display.map(id => mongoose.Types.ObjectId(id))
    var video = campaignId.video.map(id => mongoose.Types.ObjectId(id))
    // var resu = [];
    campaignwisereports.aggregate([
        {$facet:{
            "audio":[
                {$match:{
                    "campaignId":{$in:audio}
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
                }}],
            "display":[
                {$match:{
                    "campaignId":{$in:display}
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
                }}],
            "video":[
                {$match:{
                    "campaignId":{$in:video}
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
                }}],
        }}
    ])
    .then(async (reports)=>{
        var response = reports[0]
        var updatedAtTimes = [];
        var audioCompleteReport   = {impressions : 0,clicks : 0,complete : 0,firstQuartile : 0,midpoint : 0,thirdQuartile : 0}
        var displayCompleteReport = {impressions : 0,clicks : 0,complete : 0,firstQuartile : 0,midpoint : 0,thirdQuartile : 0}
        var videoCompleteReport   = {impressions : 0,clicks : 0,complete : 0,firstQuartile : 0,midpoint : 0,thirdQuartile : 0}
        response.audio = await publisherapps.populate(response.audio,{path:'Publisher',select:'_id AppName'}).catch(err=>console.log(err))
        response.display = await publisherapps.populate(response.display,{path:'Publisher',select:'_id AppName'}).catch(err=>console.log(err))
        response.video = await publisherapps.populate(response.video,{path:'Publisher',select:'_id AppName'}).catch(err=>console.log(err))
        response.audio = await StreamingAds.populate(response.audio,{path:'campaignId',select:'_id TargetImpressions startDate endDate'}).catch(err=>console.log(err))
        response.display = await StreamingAds.populate(response.display,{path:'campaignId',select:'_id TargetImpressions startDate endDate'}).catch(err=>console.log(err))
        response.video = await StreamingAds.populate(response.video,{path:'campaignId',select:'_id TargetImpressions startDate endDate'}).catch(err=>console.log(err))
        response.audio && response.audio.map(x=>{
            x.updatedAt = [...new Set(x.updatedAt)];
            x.campaignId = remove_duplicates_arrayobject(x.campaignId,'_id')
            audioCompleteReport.impressions += parseInt(x.impressions)
            audioCompleteReport.clicks += parseInt(x.clicks)
            audioCompleteReport.complete += parseInt(x.complete)
            audioCompleteReport.midpoint += parseInt(x.midpoint)
            audioCompleteReport.firstQuartile += parseInt(x.firstQuartile)
            audioCompleteReport.thirdQuartile += parseInt(x.thirdQuartile)
            x.updatedAt.sort(function(a,b){
                return new Date(b) - new Date(a);
            })
            x.updatedAt = x.updatedAt[0]
            x.campaignId = x.campaignId[0]
            updatedAtTimes.push(x.updatedAt)
        })
        response.display && response.display.map(x=>{
            x.updatedAt = [...new Set(x.updatedAt)];
            x.campaignId = remove_duplicates_arrayobject(x.campaignId)
            displayCompleteReport.impressions += parseInt(x.impressions)
            displayCompleteReport.clicks += parseInt(x.clicks)
            displayCompleteReport.complete += parseInt(x.complete)
            displayCompleteReport.midpoint += parseInt(x.midpoint)
            displayCompleteReport.firstQuartile += parseInt(x.firstQuartile)
            displayCompleteReport.thirdQuartile += parseInt(x.thirdQuartile)
            x.updatedAt.sort(function(a,b){
                return new Date(b) - new Date(a);
            })
            x.updatedAt = x.updatedAt[0]
            x.campaignId = x.campaignId[0]
            updatedAtTimes.push(x.updatedAt)
        })
        response.video && response.video.map(x=>{
            x.updatedAt = [...new Set(x.updatedAt)];
            x.campaignId = remove_duplicates_arrayobject(x.campaignId)
            videoCompleteReport.impressions += parseInt(x.impressions)
            videoCompleteReport.clicks += parseInt(x.clicks)
            videoCompleteReport.complete += parseInt(x.complete)
            videoCompleteReport.midpoint += parseInt(x.midpoint)
            videoCompleteReport.firstQuartile += parseInt(x.firstQuartile)
            videoCompleteReport.thirdQuartile += parseInt(x.thirdQuartile)
            x.updatedAt.sort(function(a,b){
                return new Date(b) - new Date(a);
            })
            x.updatedAt = x.updatedAt[0]
            x.campaignId = x.campaignId[0]
            updatedAtTimes.push(x.updatedAt)
        })
        updatedAtTimes.sort(function(a,b){
            return new Date(b) - new Date(a);
        })
        var summaryCompleteReport = {impressions : 0,clicks : 0,complete : 0}
        summaryCompleteReport.impressions += parseInt(audioCompleteReport.impressions) + parseInt(displayCompleteReport.impressions) + parseInt(videoCompleteReport.impressions)
        summaryCompleteReport.clicks += parseInt(audioCompleteReport.clicks) + parseInt(displayCompleteReport.clicks) + parseInt(videoCompleteReport.clicks)
        summaryCompleteReport.complete += parseInt(audioCompleteReport.complete) + parseInt(displayCompleteReport.complete) + parseInt(videoCompleteReport.complete)
        response.audioCompleteReport = audioCompleteReport
        response.displayCompleteReport = displayCompleteReport
        response.videoCompleteReport = videoCompleteReport
        response.summaryCompleteReport = summaryCompleteReport
        response.allrecentupdate = updatedAtTimes ? updatedAtTimes[0] : undefined;
        res.json(response)
        // var data = reports;
        // data = data.filter(x => x.Publisher!== "")
        // publisherapps.populate(data,{path:'Publisher'},function(err,populatedreports){
        //     if(err){
        //         return res.status(422).json(err)
        //     }
        //     resu = populatedreports;
        //     // console.log(populatedreports)
        //     resu.map((det)=>{
        //         var resregion = [].concat.apply([], det.region);
        //         resregion = [...new Set(resregion)];
        //         det.region = resregion
        //         var rescampaignId = [].concat.apply([], det.campaignId);
        //         rescampaignId = [...new Set(rescampaignId)];
        //         det.campaignId = rescampaignId[0]
        //         var updatedDate = det.updatedAt
        //         updatedDate.sort(function(a,b){
        //             return new Date(b) - new Date(a);
        //         });
        //         det.updatedAt = updatedDate
        //     })
        //     StreamingAds.populate(resu,{path:'campaignId'},function(err,populatedres){
        //         if(err){
        //             return res.status(422).json(resu)
        //         }
        //         res.json(populatedres)
        //     })
        // })
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