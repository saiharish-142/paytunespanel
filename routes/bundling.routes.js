const { json } = require('express')
const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const adminauth  = require('../authenMiddleware/adminauth')
const bindstreamingads = mongoose.model('bindstreamingads')
const streamingads = mongoose.model('streamingads')

router.get('/',adminauth,(req,res)=>{
    bindstreamingads.find()
    .populate('ids','_id AdTitle Category Advertiser Pricing PricingModel startDate endDate')
    .then(result=>{
        res.json(result)
    }).catch(err=>res.status(422).json({error:'Error occured....!',err}))
})

router.get('/:id',adminauth,(req,res)=>{
    const {id} = req.params
    bindstreamingads.findById(id)
    .populate('ids','_id AdTitle Category Advertiser Pricing PricingModel startDate endDate')
    .then(result=>{
        res.json(result)
    }).catch(err=>res.status(422).json({error:'Error occured....!',err}))
})

router.get('/title/:title',adminauth,(req,res)=>{
    const {title} = req.params
    bindstreamingads.findOne({bundleadtitle:title})
    .populate('ids','_id AdTitle Category Advertiser Pricing PricingModel startDate endDate')
    .then(result=>{
        res.json(result)
    }).catch(err=>res.status(422).json({error:'Error occured....!',err}))
})

router.post('/createBundle',adminauth,(req,res)=>{
    const {Category,Advertiser,bundleadtitle,ids,Pricing,PricingModel,endDate,startDate} = req.body
    if(!ids || !bundleadtitle || !startDate || !endDate){
        return res.status(400).json({error:'Enter all the Given fields'})
    }
    const somebundle = new bindstreamingads({
        Category,Advertiser,bundleadtitle,ids,Pricing,PricingModel,startDate,endDate
    })
    somebundle.save()
    .then(result=>{
        res.json({message:'saved...!',result})
    })
    .catch(err=>{
        console.log(err)
        return res.status(422).json({error:'Error occured....!',err})
    })
})

router.put('/UpdateBundle',adminauth,(req,res)=>{
    const {Category,Advertiser,bundleadtitle,id,Pricing,PricingModel,endDate,startDate} = req.body
    if(!id || !bundleadtitle || !startDate || !endDate){
        return res.status(400).json({error:'Enter all the Given fields'})
    }
    bindstreamingads.findByIdAndUpdate(id)
    .then(somebundle=>{
        if(Category){somebundle.Category = Category}
        if(Advertiser){somebundle.Advertiser = Advertiser}
        if(bundleadtitle){somebundle.bundleadtitle = bundleadtitle}
        if(Pricing){somebundle.Pricing = Pricing}
        if(PricingModel){somebundle.PricingModel = PricingModel}
        if(startDate){somebundle.startDate = startDate}
        if(endDate){somebundle.endDate = endDate}
        somebundle.save()
        .then(result=>{
            res.json({message:'saved...!',result})
        })
        .catch(err=>{
            console.log(err)
            return res.status(422).json({error:'Error occured....!',err})
        })
    })
    .catch(err=>{
        console.log(err)
        return res.status(422).json({error:'Error occured....!',err})
    })
})

router.put('/addadtobundle',adminauth,(req,res)=>{
    const {id,bundleid} = req.body
    bindstreamingads.findByIdAndUpdate(bundleid,{$push:{ids:id}},{new:true})
    .populate('ids','_id AdTitle Category Advertiser Pricing PricingModel startDate endDate')
    .exec((err,result)=>{
        if(err){
            console.log(err)
            return res.status(422).json({error:'Error occured....!',err})
        }else{
            return res.json({result,message:'id added...!'})
        }
    })
})

router.put('/removeadtobundle',adminauth,(req,res)=>{
    const {id,bundleid} = req.body
    bindstreamingads.findByIdAndUpdate(bundleid,{$pull:{ids:id}},{new:true})
    .populate('ids','_id AdTitle Category Advertiser Pricing PricingModel startDate endDate')
    .exec((err,result)=>{
        if(err){
            console.log(err)
            return res.status(422).json({error:'Error occured....!',err})
        }else{
            return res.json({result,message:'id removed...!'})
        }
    })
})

router.delete('/deleteoneBundle',adminauth,(req,res)=>{
    const { id } = req.body
    bindstreamingads.findByIdAndDelete(id)
    .exec((err,result)=>{
        if(err){
            console.log(err)
            return res.status(422).json({error:'Error occurred',err})
        }else{
            res.json({message:'Deleted successfully...!',result})
        }
    })
})

router.delete('/deleteallbundles',adminauth,(req,res)=>{
    bindstreamingads.deleteMany()
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:'Error occured....!',err})
        }else{
            return res.json({message:''})
        }
    })
})

module.exports = router