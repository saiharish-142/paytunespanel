const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Rtbrequest = mongoose.model('rtbrequests')
const adminauth  = require('../authenMiddleware/adminauth')

router.get('/rtbrs',adminauth,(req,res)=>{
    Rtbrequest.find()
    .then((result) => {
        res.json(result)
    }).catch((err) => {
        console.log(err)
    });
})

router.post('/addrtbr',adminauth,(req,res)=>{
    const {
        bidreq, bidid, imp, app, device, user, at, tmax, source, 
        ext, Type, bidstatus
    } = req.body
    if(!Type || !imp || !app || !bidreq || !bidid || !user){
        return res.status(422).json({error:'Enter all the fields'})
    }
    const rtb = new Rtbrequest({
        bidreq, bidid, imp, app, device, user, at, tmax, source, 
        ext, Type, bidstatus
    })
    rtb.save()
    .then(response => {
        res.json(response)
    })
    .catch(err => console.log(err))
})

module.exports = router