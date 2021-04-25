const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const adminauth  = require('../authenMiddleware/adminauth')
const bindstreamingads = mongoose.model('bindstreamingads')
const streamingads = mongoose.model('streamingads')
const adsetting = mongoose.model('adsetting')

router.get('/',adminauth,(req,res)=>{
    bindstreamingads.find()
    .populate('ids','_id AdTitle Category Advertiser Pricing PricingModel startDate endDate')
    .then(result=>{
        res.json(result)
    }).catch(err=>res.status(422).json({error:'Error occured....!',err}))
})

router.get('/names',adminauth,(req,res)=>{
    bindstreamingads.find({},{_id:1,bundleadtitle:1})
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

router.get('/grp/:id',adminauth,(req,res)=>{
    const {id} = req.params
    bindstreamingads.findById(id)
    .then(async(result)=>{
        var data = {ids:[],_id:0,Category:'',Advertiser:'',bundleadtitle:'',Pricing:'',PricingModel:'',startDate:'',endDate:''}
        data.ids = result.ids
        data._id = result._id
        data.Category = result.Category
        data.Advertiser = result.Advertiser
        data.bundleadtitle = result.bundleadtitle
        data.Pricing = result.Pricing
        data.PricingModel = result.PricingModel
        data.startDate = result.startDate
        data.endDate = result.endDate
        data.idsTar = []
        data.id_spliter = []
        var ids = (typeof campaignId !== 'undefined' && 
                typeof campaignId !== 'string' && 
                typeof campaignId !== 'object') ? 
                data.ids.map(id=>mongoose.Types.ObjectId(id)) : data.ids
        let groupedIdsTitle = await streamingads.aggregate([
            {$match:{"_id":{$in:ids}}},
            {$project:{
                AdTitle:{$toLower:"$AdTitle"},
            }},{$project:{
                AdTitle:{$split:["$AdTitle","_"]},
            }},{$project:{
                AdTitle:{$slice:["$AdTitle",2]} ,
            }},{$project:{
                AdTitle:{
                    '$reduce': {
                        'input': '$AdTitle',
                        'initialValue': '',
                        'in': {
                            '$concat': [
                                '$$value',
                                {'$cond': [{'$eq': ['$$value', '']}, '', '_']}, 
                                '$$this']
                        }
                    }
                },
            }},{$sort: {createdOn: -1}},{$group:{
                _id:"$AdTitle",
            }},{$project:{
                Adtitle:"$_id",
            }},{$sort: {createdOn: -1}}
        ]).catch(err=>console.log(err))
        data.groupedTitles = groupedIdsTitle
        let idsTar = await streamingads.find({_id:{$in:ids}},{_id:1,TargetImpressions:1}).catch(err=>console.log(err))
        let id_spliter = await adsetting.find({campaignId:{$in:ids}},{campaignId:1,type:1,targetImpression:1}).catch(err=>console.log(err))
        data.idsTar = idsTar
        data.id_spliter = id_spliter
        res.json({data,idsTar,id_spliter})
    }).catch(err=>res.status(422).json({error:'Error occured....!',err}))
})

router.get('/unp/:id',adminauth,(req,res)=>{
    const {id} = req.params
    bindstreamingads.findById(id)
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