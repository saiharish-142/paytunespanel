const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const adminauth  = require('../authenMiddleware/adminauth')
const adsetting = mongoose.model('adsetting')

router.get('/all',adminauth,(req,res)=>{
    adsetting.find()
    .sort('-createdOn')
    .then(result=>res.json(result))
    .catch(err=>res.status(400).json(err))
})

router.put('/addetails',adminauth,(req,res)=>{
    const { campaignId } = req.body
    var ids = campaignId.map(id=>mongoose.Types.ObjectId(id))
    adsetting.aggregate([
        {$match:{
            "campaignId":{$in:ids}
        }},{$group:{
            _id:"$type", ids:{$push:"$_id"}
        }},{$project:{
            type:"$_id",_id:0, ids:"$ids"
        }}
    ])
    .then(result=>{
        var doodle = result;
        var audio = [];
        var display = [];
        doodle.map(sub=>{
            if(sub.type === 'audio')
            audio = audio.concat(sub.ids)
            if(sub.type === 'display')
            display = display.concat(sub.ids)
        })
        res.json({audio,display})
    })
    .catch(err => res.status(400).json(err))
})

module.exports = router