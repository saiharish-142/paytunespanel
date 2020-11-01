const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const adminauth = require('../authenMiddleware/adminauth')
const publisherapps = mongoose.model('publisherapps')

router.get('/allpublishers',(req,res)=>{
    publisherapps.find()
    .then(apps=>{
        res.json(apps)
    })
    .catch(err=>console.log(err))
})

router.post('/addpublisher',adminauth,(req,res)=>{
    const { AppName, PublisherId, AppId } = req.body
    if(!AppName || !PublisherId || !AppId){
        return res.status(422).json({error:'Enter the all required fields'})
    }
    const publisher = new publisherapps({
        AppName,AppId,PublisherId
    })
    publisher.save()
    .then(result=>{
        res.json(result)
    })
    .catch(err=>console.log(err))
})

module.exports = router