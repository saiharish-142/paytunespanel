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
    .populate('Publisher')
    .sort('-createdAt')
    .then(reports=>{
        res.json(reports)
    })
    .catch(err=>console.log(err))
})

router.post('/createReport',(req,res)=>{
    var data = [];
    var clicked = [];
    var impressions = [];
    var completed = [];
    var mediatype,region;
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
        // .populate('rtbreqid')
        .then(logs=>{
            if(!logs){
                return res.json({Message:'there are no logs on th given information'})
            }
            data = logs
            region = logs[0].region
            impressions = data.filter(x => x.Type==='impression')
            if(appId === '5f91ca4441375c24943f4756'){
                clicked = data.filter(x => x.Type==='clicktracking')
                // console.log('spotify')
            }else{
                clicked = data.filter(x => x.Type==='companionclicktracking')
                // console.log('not spotify')
            }
            completed = data.filter(x => x.Type==='complete')
            // console.log(data)
            // data = data.filter(x => x.appId===appId)
            // Rtbrequest
            const report = new Report({
                Date:date,
                Publisher:appId,
                mediatype,
                // dealID,
                impressions:impressions.length,
                complete:completed.length,
                clicks:clicked.length,
                region:region,
                Spend:data.length + ' USD',
                avgSpend:1
            })
            // console.log(report)
            report.save()
            .then(result => {
                res.json(result)
            })
            .catch(err => console.log(err))
        })
        .catch(err=>console.log(err))
    })
    .catch(err=>console.log(err))
})

module.exports = router