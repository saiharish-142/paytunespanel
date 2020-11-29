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
    adsetting.find({campaignId:{$in:campaignId}})
    .sort('-createdOn')
    .then(result=>{
        res.json(result)
    })
    .catch(err => res.status(400).json(err))
})

module.exports = router