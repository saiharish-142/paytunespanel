const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Report = mongoose.model('Report')
const adminauth  = require('../authenMiddleware/adminauth')

router.get('/reports',adminauth,(req,res)=>{
    Report.find()
    .populate('Publisher')
    .sort('-createdAt')
    .then(reports=>{
        res.json(reports)
    })
    .catch(err=>console.log(err))
})

router.put('/reportbydate',adminauth,(req,res)=>{
    const { date } = req.body
    Report.find({date:date})
    .populate('Publisher')
    .sort('-createdAt')
    .then(reports=>{
        res.json(reports)
    })
    .catch(err=>console.log(err))
})

router.put('/sumreportofcam',adminauth,(req,res)=>{
    const { campaignId } = req.body
    Report.aggregate([
        {$match:{
            "campaignId":campaignId
        }},{$group:{
            _id:"$Publisher", impressions:{$sum:"$impressions"}, complete:{$sum:"$complete"}, clicks:{$sum:"$clicks"}, region:{$push:"$region"}
        }}{$lookup:{
            from:"Publisher",
            localField:"_id",
            foreignField:"_id",
            as:"Publisher"
        }},{$project:{
            Publisher:"$Publisher.AppName", impressions:"$impressions", complete:"$complete", clicks:"$clicks", region:"$region"
        }}
    ])
    .then(reports=>{
        res.json(reports)
    })
    .catch(err=>console.log(err))
})

router.put('/reportbycamp',adminauth,(req,res)=>{
    const { campaignId } = req.body
    Report.find({campaignId:campaignId})
    .populate('Publisher')
    .sort('-createdAt')
    .then(reports=>{
        res.json(reports)
    })
    .catch(err=>console.log(err))
})

router.put('/detreportbycamp',adminauth,(req,res)=>{
    const { campaignId, date } = req.body
    Report.find({campaignId:campaignId,date:date})
    .populate('Publisher')
    .sort('-createdAt')
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

module.exports = router