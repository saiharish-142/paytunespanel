const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const adminauth  = require('../authenMiddleware/adminauth')
const campaignwisereports = mongoose.model('campaignwisereports')

router.get('/reports',adminauth,(req,res)=>{
    campaignwisereports.find()
    .then(result=>{
        res.json(result)
    })
    .catch(er => res.status(400).json(er))
})

module.exports = router