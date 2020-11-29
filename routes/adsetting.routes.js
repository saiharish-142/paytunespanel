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

router.put('/addetail',adminauth,(req,res)=>{
    const { campaignId } = req.body
    var ids = (typeof campaignId !== 'undefined' && 
                typeof campaignId !== 'string' && 
                typeof campaignId !== 'object') ? 
                campaignId.map(id=>mongoose.Types.ObjectId(id)) : campaignId
    adsetting.find({campaignId:{$in:ids}})
    .sort('-createdOn')
    .then(result=>{
        res.json(result)
    })
    .catch(err => res.status(400).json(err))
})

router.put('/addetails',adminauth,(req,res)=>{
    const { campaignId } = req.body
    var ids = (typeof campaignId !== 'undefined' && 
                typeof campaignId !== 'string' && 
                typeof campaignId !== 'object') ? 
                campaignId.map(id=>mongoose.Types.ObjectId(id)) : campaignId
    adsetting.aggregate([
        {$match:{
            campaignId:{$in:[ids]}
        }},{$group:{
            _id:"$type", ids:{$push:"$campaignId"}
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
        res.json({audio,display,result,ids})
    })
    .catch(err => res.status(400).json(err))
})

router.put('/addetailst',adminauth,(req,res)=>{
    const { campaignId } = req.body
    adsetting.aggregate([
        {$match:{
            campaignId:{$in:campaignId}
        }},{$group:{
            _id:"$type", ids:{$push:"$campaignId"}
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
        res.json({audio,display,result})
    })
    .catch(err => res.status(400).json(err))
})

module.exports = router