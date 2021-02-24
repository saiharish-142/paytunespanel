const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const phonemakereports = mongoose.model('phonemakereports')
const zipreports = mongoose.model('zipreports')
const uniqueuserreports = mongoose.model('uniqueuserreports')
const regionreports = mongoose.model('regionreports')
const pptypereports = mongoose.model('pptypereports')
const platformtypereports = mongoose.model('platformtypereports')
const citylanguagereports = mongoose.model('citylanguagereports')
const phonemodelreports = mongoose.model('phonemodelreports')
const spentreports = mongoose.model('spentreports')
const adminauth  = require('../authenMiddleware/adminauth')

router.get('/phonemake',adminauth,(req,res)=>{
    phonemakereports.find()
    .then(result=>{
        res.json(result)
    }).catch(err=>res.status(422).json(err))
})

router.get('/spentrepo',adminauth,(req,res)=>{
    spentreports.find()
    .then(result=>{
        res.json(result)
    }).catch(err=>res.status(422).json(err))
})

router.get('/zipwise',adminauth,(req,res)=>{
    zipreports.find()
    .then(result=>{
        res.json(result)
    }).catch(err=>res.status(422).json(err))
})

router.get('/unique',adminauth,(req,res)=>{
    uniqueuserreports.find()
    .then(result=>{
        res.json(result)
    }).catch(err=>res.status(422).json(err))
})

router.get('/regionwise',adminauth,(req,res)=>{
    regionreports.find()
    .then(result=>{
        res.json(result)
    }).catch(err=>res.status(422).json(err))
})

router.get('/pptypewise',adminauth,(req,res)=>{
    pptypereports.find()
    .then(result=>{
        res.json(result)
    }).catch(err=>res.status(422).json(err))
})

router.get('/platformtypewise',adminauth,(req,res)=>{
    platformtypereports.find()
    .then(result=>{
        res.json(result)
    }).catch(err=>res.status(422).json(err))
})

router.get('/citylanguagewise',adminauth,(req,res)=>{
    citylanguagereports.find()
    .then(result=>{
        res.json(result)
    }).catch(err=>res.status(422).json(err))
})

router.get('/phonemodelwise',adminauth,(req,res)=>{
    phonemodelreports.find()
    .then(result=>{
        res.json(result)
    }).catch(err=>res.status(422).json(err))
})

router.put('/phonemakebycampids',adminauth,(req,res)=>{
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

router.put('/zipbycampids',adminauth,(req,res)=>{
    const {campaignId} = req.body
    var ids = campaignId.map(id=>mongoose.Types.ObjectId(id))
    zipreports.aggregate([
        {$match:{campaignId:{$in:ids}}},
        {$group:{_id:{zip:"$zip",campaignId:"$campaignId"}, 
            impression:{$sum:"$impression"}, 
            CompanionClickTracking:{$sum:"$CompanionClickTracking"}, 
            SovClickTracking:{$sum:"$SovClickTracking"}, 
            start:{$sum:"$start"}, 
            midpoint:{$sum:"$midpoint"},
            thirdQuartile:{$sum:"$thirdQuartile"},
            complete:{$sum:"$complete"},
            createdOn:{$push:"$createdOn"}
        }},{$project:{
            zip:"$_id.zip", campaignId:"$_id.campaignId",impression:1,CompanionClickTracking:1,SovClickTracking:1,
            start:1,midpoint:1,thirdQuartile:1,complete:1,createdOn:1,_id:0
        }}
    ])
    .then(result=>res.json(result))
    .catch(err=>res.status(422).json(err))
})

router.put('/regionbycampids',adminauth,(req,res)=>{
    const {campaignId} = req.body
    var ids = campaignId.map(id=>mongoose.Types.ObjectId(id))
    regionreports.aggregate([
        {$match:{campaignId:{$in:ids}}},
        {$group:{_id:{region:"$region",campaignId:"$campaignId"}, 
            impression:{$sum:"$impression"}, 
            CompanionClickTracking:{$sum:"$CompanionClickTracking"}, 
            SovClickTracking:{$sum:"$SovClickTracking"}, 
            start:{$sum:"$start"}, 
            midpoint:{$sum:"$midpoint"},
            thirdQuartile:{$sum:"$thirdQuartile"},
            complete:{$sum:"$complete"},
            createdOn:{$push:"$createdOn"}
        }},{$project:{
            region:"$_id.region", campaignId:"$_id.campaignId",impression:1,CompanionClickTracking:1,SovClickTracking:1,
            start:1,midpoint:1,thirdQuartile:1,complete:1,createdOn:1,_id:0
        }}
    ])
    .then(result=>res.json(result))
    .catch(err=>res.status(422).json(err))
})

router.put('/pptypebycampids',adminauth,(req,res)=>{
    const {campaignId} = req.body
    var ids = campaignId.map(id=>mongoose.Types.ObjectId(id))
    pptypereports.aggregate([
        {$match:{campaignId:{$in:ids}}},
        {$group:{_id:{pptype:"$pptype",campaignId:"$campaignId"}, 
            impression:{$sum:"$impression"}, 
            CompanionClickTracking:{$sum:"$CompanionClickTracking"}, 
            SovClickTracking:{$sum:"$SovClickTracking"}, 
            start:{$sum:"$start"}, 
            midpoint:{$sum:"$midpoint"},
            thirdQuartile:{$sum:"$thirdQuartile"},
            complete:{$sum:"$complete"},
            createdOn:{$push:"$createdOn"}
        }},{$project:{
            pptype:"$_id.pptype", campaignId:"$_id.campaignId",impression:1,CompanionClickTracking:1,SovClickTracking:1,
            start:1,midpoint:1,thirdQuartile:1,complete:1,createdOn:1,_id:0
        }}
    ])
    .then(result=>res.json(result))
    .catch(err=>res.status(422).json(err))
})

router.put('/platformTypebycampids',adminauth,(req,res)=>{
    const {campaignId} = req.body
    var ids = campaignId.map(id=>mongoose.Types.ObjectId(id))
    platformtypereports.aggregate([
        {$match:{campaignId:{$in:ids}}},
        {$group:{_id:{platformType:"$platformType",campaignId:"$campaignId"}, 
            impression:{$sum:"$impression"}, 
            CompanionClickTracking:{$sum:"$CompanionClickTracking"}, 
            SovClickTracking:{$sum:"$SovClickTracking"}, 
            start:{$sum:"$start"}, 
            midpoint:{$sum:"$midpoint"},
            thirdQuartile:{$sum:"$thirdQuartile"},
            complete:{$sum:"$complete"},
            createdOn:{$push:"$createdOn"}
        }},{$project:{
            platformType:"$_id.platformType", campaignId:"$_id.campaignId",impression:1,CompanionClickTracking:1,SovClickTracking:1,
            start:1,midpoint:1,thirdQuartile:1,complete:1,createdOn:1,_id:0
        }}
    ])
    .then(result=>res.json(result))
    .catch(err=>res.status(422).json(err))
})

router.put('/citylanguagebycampids',adminauth,(req,res)=>{
    const {campaignId} = req.body
    var ids = campaignId.map(id=>mongoose.Types.ObjectId(id))
    citylanguagereports.aggregate([
        {$match:{campaignId:{$in:ids}}},
        {$group:{_id:{citylanguage:"$citylanguage",campaignId:"$campaignId"}, 
            impression:{$sum:"$impression"}, 
            CompanionClickTracking:{$sum:"$CompanionClickTracking"}, 
            SovClickTracking:{$sum:"$SovClickTracking"}, 
            start:{$sum:"$start"}, 
            midpoint:{$sum:"$midpoint"},
            thirdQuartile:{$sum:"$thirdQuartile"},
            complete:{$sum:"$complete"},
            createdOn:{$push:"$createdOn"}
        }},{$project:{
            citylanguage:"$_id.citylanguage", campaignId:"$_id.campaignId",impression:1,CompanionClickTracking:1,SovClickTracking:1,
            start:1,midpoint:1,thirdQuartile:1,complete:1,createdOn:1,_id:0
        }}
    ])
    .then(result=>res.json(result))
    .catch(err=>res.status(422).json(err))
})

router.put('/phoneModelbycampids',adminauth,(req,res)=>{
    const {campaignId} = req.body
    var ids = campaignId.map(id=>mongoose.Types.ObjectId(id))
    phonemodelreports.aggregate([
        {$match:{campaignId:{$in:ids}}},
        {$group:{_id:{phoneModel:"$phoneModel",campaignId:"$campaignId"}, 
            impression:{$sum:"$impression"}, 
            CompanionClickTracking:{$sum:"$CompanionClickTracking"}, 
            SovClickTracking:{$sum:"$SovClickTracking"}, 
            start:{$sum:"$start"}, 
            midpoint:{$sum:"$midpoint"},
            thirdQuartile:{$sum:"$thirdQuartile"},
            complete:{$sum:"$complete"},
            createdOn:{$push:"$createdOn"}
        }},{$project:{
            phoneModel:"$_id.phoneModel", campaignId:"$_id.campaignId",impression:1,CompanionClickTracking:1,SovClickTracking:1,
            start:1,midpoint:1,thirdQuartile:1,complete:1,createdOn:1,_id:0
        }}
    ])
    .then(result=>res.json(result))
    .catch(err=>res.status(422).json(err))
})

router.put('/uniqueusersbycampids',adminauth,(req,res)=>{
    const {campaignId} = req.body
    var ids = campaignId.map(id=>mongoose.Types.ObjectId(id))
    uniqueuserreports.aggregate([
        {$match:{campaignId:{$in:ids}}},
        {$group:{_id:"$campaignId",unique:{$sum:"$uniqueusers"}}},
        {$project:{campaignId:"$_id",unique:1,_id:0}}
    ])
    .then(result=>res.json(result))
    .catch(err=>res.status(422).json(err))
})

router.put('/uniqueusersbycampids2',adminauth,(req,res)=>{
    const {campaignId} = req.body
    var ids = campaignId.map(id=>mongoose.Types.ObjectId(id))
    uniqueuserreports.aggregate([
        {$match:{campaignId:{$in:ids}}}
    ])
    .then(result=>res.json(result))
    .catch(err=>res.status(422).json(err))
})

router.put('/spentallrepobyid',adminauth,(req,res)=>{
    const {campaignId} = req.body
    var ids = campaignId.map(id=>mongoose.Types.ObjectId(id))
    spentreports.aggregate([
        {$match:{campaignId:{$in:ids}}},
        {$group:{_id:'$appId',totalspent:{$sum:'$totalSpent'}}},
        {$project:{_id:0,appId:'$_id',totalspent:1}}
    ])
    .then(result=>res.json(result))
    .catch(err=>res.status(422).json(err))
})

module.exports = router