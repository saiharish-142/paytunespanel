const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const StreamingAds = mongoose.model('streamingads')
const Report = mongoose.model('Report')
const publisherapps = mongoose.model('publisherapps')
const adminauth  = require('../authenMiddleware/adminauth')

router.get('/reports',adminauth,(req,res)=>{
    Report.find()
    .populate('Publisher')
    .sort('-date')
    .then(reports=>{
        res.json(reports)
    })
    .catch(err=>console.log(err))
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

router.put('/sumrepobyjoincamp',adminauth,(req,res)=>{
    const { adtitle } = req.body
    StreamingAds.aggregate([
        {$match:{
            AdTitle:{$regex:adtitle}
        }},{$project:{
            id:"$_id"
        }}
    ])
    .then(resp=>{
        var ids = [];
        resp.map(re => {
            ids.push(re.id)
        })
        Report.aggregate([
            {$match:{
                "campaignId": {$in : ids}
            }},{$group:{
                _id:"$Publisher", impressions:{$sum:"$impressions"}, complete:{$sum:"$complete"}, clicks:{$sum:"$clicks"}, region:{$push:"$region"}
            }},{$project:{
                Publisher:"$_id", impressions:"$impressions", complete:"$complete", clicks:"$clicks", region:"$region", _id:0
            }}
        ])
        .then(reports=>{
            publisherapps.populate(reports,{path:'Publisher'},function(err,populatedreports){
                if(err){
                    return res.status(422).json(err)
                }
                resu = populatedreports;
                resu.map((det)=>{
                    var resregion = [].concat.apply([], det.region);
                    resregion = [...new Set(resregion)];
                    det.region = resregion
                })
                res.json(resu)
            })
        })
        .catch(err=>console.log(err))
    })
    .catch(err=>console.log(err))
})

router.put('/sumreportofcam',adminauth,(req,res)=>{
    const { campaignId } = req.body
    var resu = [];
    Report.aggregate([
        {$match:{
            "campaignId":campaignId
        }},{$group:{
            _id:"$Publisher", impressions:{$sum:"$impressions"}, complete:{$sum:"$complete"}, clicks:{$sum:"$clicks"}, region:{$push:"$region"}
        }},{$project:{
            Publisher:"$_id", impressions:"$impressions", complete:"$complete", clicks:"$clicks", region:"$region", _id:0
        }}
    ])
    .then(reports=>{
        publisherapps.populate(reports,{path:'Publisher'},function(err,populatedreports){
            if(err){
                return res.status(422).json(err)
            }
            resu = populatedreports;
            resu.map((det)=>{
                var resregion = [].concat.apply([], det.region);
                resregion = [...new Set(resregion)];
                det.region = resregion
            })
            res.json(resu)
        })
    })
    .catch(err=>console.log(err))
})

router.put('/sumreportofcam22',adminauth,(req,res)=>{
    const { campaignId } = req.body
    var resu = [];
    Report.aggregate([
        {$match:{
            "campaignId":{$in:campaignId}
        }},{$group:{
            _id:"$Publisher", camp:{$push:"$campaignId"} , impressions:{$sum:"$impressions"}, complete:{$sum:"$complete"}, clicks:{$sum:"$clicks"}, region:{$push:"$region"}
        }},{$project:{
            Publisher:"$_id", campaignId:"$camp", impressions:"$impressions", complete:"$complete", clicks:"$clicks", region:"$region", _id:0
        }}
    ])
    .then(reports=>{
        publisherapps.populate(reports,{path:'Publisher'},function(err,populatedreports){
            if(err){
                return res.status(422).json(err)
            }
            resu = populatedreports;
            resu.map((det)=>{
                var resregion = [].concat.apply([], det.region);
                resregion = [...new Set(resregion)];
                det.region = resregion
                var rescampaignId = [].concat.apply([], det.campaignId);
                rescampaignId = [...new Set(rescampaignId)];
                det.campaignId = rescampaignId[0]
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

router.put('/detreportcambydat',adminauth,(req,res)=>{
    const { campaignId } = req.body
    var resu = [];
    Report.aggregate([
        {$match:{
            "campaignId":{$in : campaignId}
        }},{$group:{
            _id:{date:"$date"}, impressions:{$sum:"$impressions"}, complete:{$sum:"$complete"}, clicks:{$sum:"$clicks"}, region:{$push:"$region"}
        }},{$project:{
            date:"$_id.date", impressions:"$impressions", complete:"$complete", clicks:"$clicks", region:"$region", _id:0
        }},{$sort: {date: -1}}
    ])
    .then(reports=>{
        resu = reports;
        resu.map((det)=>{
            var resregion = [].concat.apply([], det.region);
            resregion = [...new Set(resregion)];
            det.region = resregion
        })
        res.json(resu)
    })
    .catch(err=>console.log(err))
})

router.put('/reportbycamp',adminauth,(req,res)=>{
    const { campaignId } = req.body
    Report.find({campaignId:{$in : campaignId}})
    .populate('Publisher')
    .sort('-date')
    .then(reports=>{
        res.json(reports)
    })
    .catch(err=>console.log(err))
})

router.put('/detreportbycamp',adminauth,(req,res)=>{
    const { campaignId, date } = req.body
    Report.findOneAndUpdate({campaignId:campaignId,date:date})
    .populate('Publisher')
    .sort('-date')
    .then(reports=>{
        res.json(reports)
    })
    .catch(err=>console.log(err))
})

router.post('/createReport',(req,res)=>{
    const { date, appId, impressions, campaignId, completed, region, clicks, spend } = req.body
    const report = new Report({
        date:date,
        Publisher:appId,
        campaignId:campaignId,
        impressions:impressions,
        complete:completed,
        clicks:clicks,
        region:region,
        spend:spend,
        avgSpend:spend
    })
    report.save()
    .then(result => {
        res.json(result)
    })
    .catch(err => console.log(err))
})

router.delete('/deleteallbyadmin',adminauth,(req,res)=>{
    Report.deleteMany({})
    .then(repon=>{
        res.json({relt:repon,mess:"deleted"})
    })
})

// router.delete('/deleteMany',adminauth,(req,res)=>{
//     Report.deleteMany({_id:req.body.id})
//     .then(repon=>{
//         res.json({relt:repon,mess:"deleted"})
//     })
// })

module.exports = router