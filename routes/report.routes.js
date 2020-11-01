const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Report = mongoose.model('Report')
const trackinglogs = mongoose.model('trackinglogs')
const StreamingAds = mongoose.model('StreamingAds')
const Rtbrequest = mongoose.model('Rtbrequest')
const adminauth  = require('../authenMiddleware/adminauth')

router.get('/reports',adminauth,(req,res)=>{
    Report.find()
    .sort('-createdAt')
    .then(reports=>{
        res.json(reports)
    })
    .catch(err=>console.log(err))
})

router.post('/createReport',(req,res)=>{
    var data = [];
    var mediatype;
    const { date, campaignId, appId } = req.body
    StreamingAds.findById(campaignId)
    .then(campaign=>{
        if(campaign){
            mediatype = campaign.Linear[0].MediaFiles[0].Type
        }
        console.log(mediatype)
        trackinglogs.find({
            date:date,
            campaignId:campaignId,
            appId:appId
        })
        .populate('rtbreqid')
        .then(logs=>{
            data = logs
            // console.log(data)
            // data = data.filter(x => x.appId===appId)
            Rtbrequest
            const report = new Report({
                Date:date,
                Publisher:appId,
                mediatype,
                // dealID,
                impressions:data.length,
                Spend:data.length + ' USD',
                avgSpend:1
            })
            console.log(report)
        })
        .catch(err=>console.log(err))
    })
    .catch(err=>console.log(err))
})

module.exports = router