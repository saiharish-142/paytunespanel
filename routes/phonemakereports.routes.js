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
    phonemakereports.find({campaignId:{$in:ids}})
    .then(result=>res.json(result))
    .catch(err=>res.status(422).json(err))
})

module.exports = router