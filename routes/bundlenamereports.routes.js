const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const bundlenamereports = mongoose.model('bundlenamereports')
const adminauth  = require('../authenMiddleware/adminauth')

router.get('/',adminauth,(req,res)=>{
    bundlenamereports.find()
    .then(result=>{
        res.json(result)
    })
    .catch(err=>res.status(422).json(err))
})

module.exports = router