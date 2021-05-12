const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const campaignifareports = mongoose.model('campaignifareports')
const adminauth = require('../authenMiddleware/adminauth')

router.get('/reports',adminauth,(req,res)=>{
    campaignifareports.find()
    .limit(300)
    .sort('-createdOn')
    .then(async (result)=>{
        res.json(result)
    })
    .catch(er => res.status(400).json(er))
})

router.put('/frequency',adminauth,(req,res)=>{
    const { campaignId } = req.body
    var audio = campaignId.audio.map(id => mongoose.Types.ObjectId(id))
    var display = campaignId.display.map(id => mongoose.Types.ObjectId(id))
    var video = campaignId.video.map(id => mongoose.Types.ObjectId(id))
    campaignifareports.aggregate([
        {$facet:{
            "audio":[
                {$match:{"impression":1,"campaignId":{$in:audio}}},
                {$group:{_id:"$ifa",count:{$sum:1}}},
                {$group:{_id:"$count",freq:{$sum:1}}}
            ],
            "display":[
                {$match:{"impression":1,"campaignId":{$in:display}}},
                {$group:{_id:"$ifa",count:{$sum:1}}},
                {$group:{_id:"$count",freq:{$sum:1}}}
            ],
            "video":[
                {$match:{"impression":1,"campaignId":{$in:video}}},
                {$group:{_id:"$ifa",count:{$sum:1}}},
                {$group:{_id:"$count",freq:{$sum:1}}}
            ]
        }}
    ]).then(respo=>{
        res.json(respo[0])
    }).catch(err=>console.log(err))
})

module.exports = router
