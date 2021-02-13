const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const phonemakereports = mongoose.model('phonemakereports')
const adminauth  = require('../authenMiddleware/adminauth')

router.get('/',adminauth,(req,res)=>{
    phonemakereports.find()
    .then(result=>{
        res.json(result)
    }).catch(err=>res.status(422).json(err))
})

router.put('/reportbycampids',adminauth,(req,res)=>{
    const {campaignId} = req.body
    var ids = campaignId.map(id=>mongoose.Types.ObjectId(id))
    phonemakereports.aggregate([
        {$match:{campaignId:{$in:ids}}},
        {$group:{_id:{phoneMake:"$phoneMake",campaignId:"$campaignId"}, 
            impression:{$sum:"$impression"}, 
            CompanionClickTracking:{$sum:"$CompanionClickTracking"}, 
            SovClickTracking:{$sum:"$SovClickTracking"}, 
            start:{$sum:"$start"}, 
            midpoint:{$sum:"$midpoint"},
            thirdQuartile:{$sum:"$thirdQuartile"},
            complete:{$sum:"$complete"},
            createdOn:{$push:"$createdOn"}
        }},{$project:{
            phoneMake:"$_id.phoneMake", campaignId:"$_id.campaignId",impression:1,CompanionClickTracking:1,SovClickTracking:1,
            start:1,midpoint:1,thirdQuartile:1,complete:1,createdOn:1,_id:0
        }}
    ])
    .then(result=>res.json(result))
    .catch(err=>res.status(422).json(err))
})

module.exports = router