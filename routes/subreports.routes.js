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
const phonemodel2=require('../models/phonemodel2reports')
const Zipreports2=require('../models/zipdata2reports')
const CategoryReports2=require('../models/categoryreports2')
const CategoryReports=require('../models/categoryreports')
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

router.put('/phonemakebycampids',adminauth,async(req,res)=>{
    const {campaignId} = req.body
    const dumd =[];
    var ids = campaignId ? campaignId.map(id=>mongoose.Types.ObjectId(id)) : dumd    
    phonemakereports.aggregate([
        {$match:{campaignId:{$in:ids}}},
        
        {$project:{phoneMake:{$toLower:'$phoneMake'},
            campaignId:"$campaignId",
            impression:"$impression", 
            CompanionClickTracking:"$CompanionClickTracking", 
            SovClickTracking:"$SovClickTracking", 
            start:"$start", 
            midpoint:"$midpoint",
            thirdQuartile:"$thirdQuartile",
            complete:"$complete",
            createdOn:"$createdOn"
        }},
        {$group:{_id:{phoneMake:"$phoneMake"}, 
            campaignId:{$push:"$campaignId"},
            impression:{$sum:"$impression"}, 
            CompanionClickTracking:{$sum:"$CompanionClickTracking"}, 
            SovClickTracking:{$sum:"$SovClickTracking"}, 
            start:{$sum:"$start"}, 
            midpoint:{$sum:"$midpoint"},
            thirdQuartile:{$sum:"$thirdQuartile"},
            complete:{$sum:"$complete"},
            createdOn:{$push:"$createdOn"}
        }},
        {$lookup:{
            from:'phonemodel2reports',
            localField:'_id.phoneMake',
            foreignField:'make_model',
            as:'extra'
        }},
         {$unwind:"$extra"},
        {$project:{
            phoneMake:"$_id.phoneMake", campaignId:"$_id.campaignId",impression:1,CompanionClickTracking:1,SovClickTracking:1,
            start:1,midpoint:1,thirdQuartile:1,complete:1,createdOn:1,_id:0,lowersubcity:'$extra.lowersubcity',subcity:'$extra.subcity'
        }}
    ])
    .then(result=>res.json(result))
    .catch(err=>res.status(422).json(err))
})

//     let {audio,video,layout}=req.body
//     audio=audio.map(aud=>mongoose.Types.ObjectId(aud))
//     video=video.map(aud=>mongoose.Types.ObjectId(aud))
//     layout=layout.map(aud=>mongoose.Types.ObjectId(aud))
//     const result=await phonemakereports.aggregate([{
//         $facet:{
//             'audio':[
//                 {$match:{campaignId:{$in:audio}}},
//                 {$project:{phoneMake:{$toLower:'$phoneMake'},
//             campaignId:"$campaignId",
//             impression:"$impression", 
//             CompanionClickTracking:"$CompanionClickTracking", 
//             SovClickTracking:"$SovClickTracking", 
//             start:"$start", 
//             midpoint:"$midpoint",
//             thirdQuartile:"$thirdQuartile",
//             complete:"$complete",
//             createdOn:"$createdOn"
//         }},
//         {$group:{_id:{phoneMake:"$phoneMake"}, 
//             campaignId:{$push:"$campaignId"},
//             impression:{$sum:"$impression"}, 
//             CompanionClickTracking:{$sum:"$CompanionClickTracking"}, 
//             SovClickTracking:{$sum:"$SovClickTracking"}, 
//             start:{$sum:"$start"}, 
//             midpoint:{$sum:"$midpoint"},
//             thirdQuartile:{$sum:"$thirdQuartile"},
//             complete:{$sum:"$complete"},
//             createdOn:{$push:"$createdOn"}
//         }},{$project:{
//             phoneMake:"$_id.phoneMake", campaignId:"$_id.campaignId",impression:1,CompanionClickTracking:1,SovClickTracking:1,
//             start:1,midpoint:1,thirdQuartile:1,complete:1,createdOn:1,_id:0
//         }}
//             ],
//             'video':[
//                 {$match:{campaignId:{$in:video}}},
//                 {$project:{phoneMake:{$toLower:'$phoneMake'},
//             campaignId:"$campaignId",
//             impression:"$impression", 
//             CompanionClickTracking:"$CompanionClickTracking", 
//             SovClickTracking:"$SovClickTracking", 
//             start:"$start", 
//             midpoint:"$midpoint",
//             thirdQuartile:"$thirdQuartile",
//             complete:"$complete",
//             createdOn:"$createdOn"
//         }},
//         {$group:{_id:{phoneMake:"$phoneMake"}, 
//             campaignId:{$push:"$campaignId"},
//             impression:{$sum:"$impression"}, 
//             CompanionClickTracking:{$sum:"$CompanionClickTracking"}, 
//             SovClickTracking:{$sum:"$SovClickTracking"}, 
//             start:{$sum:"$start"}, 
//             midpoint:{$sum:"$midpoint"},
//             thirdQuartile:{$sum:"$thirdQuartile"},
//             complete:{$sum:"$complete"},
//             createdOn:{$push:"$createdOn"}
//         }},{$project:{
//             phoneMake:"$_id.phoneMake", campaignId:"$_id.campaignId",impression:1,CompanionClickTracking:1,SovClickTracking:1,
//             start:1,midpoint:1,thirdQuartile:1,complete:1,createdOn:1,_id:0
//         }}
//             ],
//             'layout':[
//                 {$match:{campaignId:{$in:layout}}}
//             ]
//         }
//     }
// ])
//     console.log(result)
//     res.status(200).send(result)

// })


//////// editted api //////////////////////////  

router.put('/zipbycampids',adminauth,(req,res)=>{
    const {campaignId} = req.body
    const dumd =[];
    var ids = campaignId ? campaignId.map(id=>mongoose.Types.ObjectId(id)) : dumd    
    zipreports.aggregate([
        {$match:{campaignId:{$in:ids}}},
        {$group:{_id:{zip:"$zip"}, 
            campaignId:{$push:"$campaignId"}, 
            impression:{$sum:"$impression"}, 
            CompanionClickTracking:{$sum:"$CompanionClickTracking"}, 
            SovClickTracking:{$sum:"$SovClickTracking"}, 
            start:{$sum:"$start"}, 
            midpoint:{$sum:"$midpoint"},
            thirdQuartile:{$sum:"$thirdQuartile"},
            complete:{$sum:"$complete"},
            createdOn:{$push:"$createdOn"}
        }},
        {
            $lookup:{
                from:'zipreports2',
                localField:'_id.zip',
                foreignField:'pincode',
                as:'extra'
            }
        },
        {$unwind:{path:'$extra',preserveNullAndEmptyArrays:true}},
        {$project:{
            zip:"$_id.zip", campaignId:"$_id.campaignId",impression:1,CompanionClickTracking:1,SovClickTracking:1,
            start:1,midpoint:1,thirdQuartile:1,complete:1,createdOn:1,_id:0,area:'$extra.area',lowersubcity:'$area.lowersubcity',
            subcity:'$extra.subcity',city:'$extra.city',grandcity:'$extra.grandcity',district:'$extra.district',comparison:'$extra.comparison'
            ,state:'$extra.state',grandstate:'$extra.grandstate',latitude:'$extra.latitude',longitude:'$extra.longitude'
        }}
    ])
    .then(result=>res.json(result))
    .catch(err=>res.status(422).json(err))
})

router.put('/regionbycampids',adminauth,(req,res)=>{
    const {campaignId} = req.body
    const dumd =[];
    var ids = campaignId ? campaignId.map(id=>mongoose.Types.ObjectId(id)) : dumd    
    regionreports.aggregate([
        {$match:{campaignId:{$in:ids}}},
        {$project:{region:{$toLower:'$region'},
            campaignId:"$campaignId",
            impression:"$impression", 
            CompanionClickTracking:"$CompanionClickTracking", 
            SovClickTracking:"$SovClickTracking", 
            start:"$start", 
            midpoint:"$midpoint",
            thirdQuartile:"$thirdQuartile",
            complete:"$complete",
            createdOn:"$createdOn"
        }},
        {$group:{_id:{region:"$region"}, 
            campaignId:{$push:"$campaignId"},
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
    const dumd =[];
    var ids = campaignId ? campaignId.map(id=>mongoose.Types.ObjectId(id)) : dumd    
    pptypereports.aggregate([
        {$match:{campaignId:{$in:ids}}},
        {$project:{pptype:{$toLower:'$pptype'},
            campaignId:"$campaignId",
            impression:"$impression", 
            CompanionClickTracking:"$CompanionClickTracking", 
            SovClickTracking:"$SovClickTracking", 
            start:"$start", 
            midpoint:"$midpoint",
            thirdQuartile:"$thirdQuartile",
            complete:"$complete",
            createdOn:"$createdOn"
        }},
        {$group:{_id:{pptype:"$pptype"}, 
            campaignId:{$push:"$campaignId"},
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
    const dumd =[];
    var ids = campaignId ? campaignId.map(id=>mongoose.Types.ObjectId(id)) : dumd    
    platformtypereports.aggregate([
        {$match:{campaignId:{$in:ids}}},
        {$project:{platformType:{$toLower:'$platformType'},
            campaignId:"$campaignId",
            impression:"$impression", 
            CompanionClickTracking:"$CompanionClickTracking", 
            SovClickTracking:"$SovClickTracking", 
            start:"$start", 
            midpoint:"$midpoint",
            thirdQuartile:"$thirdQuartile",
            complete:"$complete",
            createdOn:"$createdOn"
        }},
        {$group:{_id:{platformType:"$platformType"}, 
            campaignId:{$push:"$campaignId"},
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

router.put('/platformTypebycampidstest',adminauth,(req,res)=>{
    const {campaignId} = req.body
    const dumd =[];
    var ids = campaignId ? campaignId.map(id=>mongoose.Types.ObjectId(id)) : dumd    
    platformtypereports.aggregate([
        {$match:{campaignId:{$in:ids}}},
        {$project:{platformType:{$toLower:'$platformType'},
            campaignId:"$campaignId",
            impression:"$impression", 
            CompanionClickTracking:"$CompanionClickTracking", 
            SovClickTracking:"$SovClickTracking", 
            start:"$start", 
            midpoint:"$midpoint",
            thirdQuartile:"$thirdQuartile",
            complete:"$complete",
            createdOn:"$createdOn"
        }},
        {$group:{_id:{platformType:"$platformType"}, 
            campaignId:{$push:"$campaignId"},
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
    const dumd =[];
    
    var ids = campaignId ? campaignId.map(id=>mongoose.Types.ObjectId(id)) : dumd  
    citylanguagereports.aggregate([
        {$match:{campaignId:{$in:ids}}},
        {$project:{citylanguage:{$toLower:'$citylanguage'},
            campaignId:"$campaignId",
            impression:"$impression", 
            CompanionClickTracking:"$CompanionClickTracking", 
            SovClickTracking:"$SovClickTracking", 
            start:"$start", 
            midpoint:"$midpoint",
            thirdQuartile:"$thirdQuartile",
            complete:"$complete",
            createdOn:"$createdOn"
        }},
        {$group:{_id:{citylanguage:"$citylanguage"}, 
            campaignId:{$push:"$campaignId"},
            impression:{$sum:"$impression"}, 
            CompanionClickTracking:{$sum:"$CompanionClickTracking"}, 
            SovClickTracking:{$sum:"$SovClickTracking"}, 
            start:{$sum:"$start"}, 
            midpoint:{$sum:"$midpoint"},
            thirdQuartile:{$sum:"$thirdQuartile"},
            complete:{$sum:"$complete"},
            createdOn:{$push:"$createdOn"}
        }},{$project:{
            citylanguage:"$_id.citylanguage", campaignId:"$campaignId",impression:1,CompanionClickTracking:1,SovClickTracking:1,
            start:1,midpoint:1,thirdQuartile:1,complete:1,createdOn:1,_id:0
        }}
    ])
    .then(result=>res.json(result))
    .catch(err=>res.status(422).json(err))
})
////////////  editted api//////////////////////////
router.put('/phoneModelbycampids',adminauth,(req,res)=>{
    const {campaignId} = req.body
    const dumd =[];
    var ids = campaignId ? campaignId.map(id=>mongoose.Types.ObjectId(id)) : dumd    
    phonemodelreports.aggregate([
        {$match:{campaignId:{$in:ids}}},
        // {$addFields:{"temp_phone":"$phoneModel"}},
        // {$project:{phoneModel:{$toLower:'$phoneModel'},
        //     campaignId:"$campaignId",
        //     impression:"$impression", 
        //     CompanionClickTracking:"$CompanionClickTracking", 
        //     SovClickTracking:"$SovClickTracking", 
        //     start:"$start", 
        //     midpoint:"$midpoint",
        //     thirdQuartile:"$thirdQuartile",
        //     complete:"$complete",
        //     createdOn:"$createdOn",
        //     temp_phone:1
        // }},
        {$lookup:{
            from:'phonemodel2reports',
            localField:'phoneModel',
            foreignField:'make_model',
            as:'extra'
        }},
        {$unwind:{path:"$extra",preserveNullAndEmptyArrays:true}},
        {$group:{_id:{combined_make_and_model:"$extra.combined_make_model"}, 
            campaignId:{$push:"$campaignId"},
            impression:{$sum:"$impression"}, 
            CompanionClickTracking:{$sum:"$CompanionClickTracking"}, 
            SovClickTracking:{$sum:"$SovClickTracking"}, 
            start:{$sum:"$start"}, 
            midpoint:{$sum:"$midpoint"},
            thirdQuartile:{$sum:"$thirdQuartile"},
            complete:{$sum:"$complete"},
            createdOn:{$push:"$createdOn"},
            extra:{$first:"$extra"} 
        }},
        
        {$project:{
            phoneModel:"$_id.phoneModel", campaignId:"$_id.campaignId",impression:1,CompanionClickTracking:1,SovClickTracking:1,
            start:1,midpoint:1,thirdQuartile:1,complete:1,createdOn:1,_id:0,extra:"$extra"
        }}
    ])
    .then(result=>res.json(result))
    .catch(err=>res.status(422).json(err))
})

router.put('/uniqueusersbycampids',adminauth,(req,res)=>{
    const {campaignId} = req.body
    const dumd =[];
    var ids = campaignId ? campaignId.map(id=>mongoose.Types.ObjectId(id)) : dumd
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
    const dumd =[];
    var ids = campaignId ? campaignId.map(id=>mongoose.Types.ObjectId(id)) : dumd    
    uniqueuserreports.aggregate([
        {$match:{campaignId:{$in:ids}}}
    ])
    .then(result=>res.json(result))
    .catch(err=>res.status(422).json(err))
})

router.put('/spentallrepobyid',adminauth,(req,res)=>{
    const {campaignId} = req.body
    const dumd =[];
    var ids = campaignId ? campaignId.map(id=>mongoose.Types.ObjectId(id)) : dumd    
    spentreports.aggregate([
        {$match:{campaignId:{$in:ids}}},
        {$group:{_id:'$appId',totalspent:{$sum:'$totalSpent'}}},
        {$project:{_id:0,appId:'$_id',totalspent:1}}
    ])
    .then(result=>res.json(result))
    .catch(err=>res.status(422).json(err))
})

router.put('/spentallrepobyid2',adminauth,(req,res)=>{
    const {campaignId} = req.body
    const dumd =[];
    var ids = campaignId ? campaignId.map(id=>mongoose.Types.ObjectId(id)) : dumd    
    spentreports.find({campaignId:{$in:ids}})
    .then(result=>res.json(result))
    .catch(err=>res.status(422).json(err))
})
  
///////////////////  new apis //////////////////////////////

router.post(
    '/categorywisereports',
    adminauth,
    async(req,res)=>{
        try{
            let {campaignId}=req.body
            var ids = campaignId ? campaignId.map(id=>mongoose.Types.ObjectId(id)) : []
            const result=await CategoryReports.aggregate([
                {$match:{campaignId:{$in:ids}}},
                {$group:{_id:{category:"$category"},
                impressions:{"$sum":"$impression"},
                CompanionClickTracking:{$sum:"$CompanionClickTracking"}, 
                SovClickTracking:{$sum:"$SovClickTracking"}
            }},
            {$lookup:{
                from:'categoryreports2',
                localField:'_id.category',
                foreignField:'category',
                as:'extra_details'
            }},
            {$unwind:{path:"$extra_details",preserveNullAndEmptyArrays:true}},
            {$sort:{"impressions":-1}}
            ]).allowDiskUse(true)
            res.status(200).json(result)
        }catch(err){
            res.status(400).json({error:err.message})
        }
    }
)


router.put(
    '/editphonedata',
    adminauth,
    async(req,res)=>{
        try{
            
            //data.make_model=data.make_model.toLowerCase()
            let {_id,make_model,cost,cumulative,release,company,model,total_percent,type}=req.body
            let updates={make_model,cost,cumulative,release,company,model,total_percent,type}
            const updated=await phonemodel2.findOneAndUpdate({_id:mongoose.Types.ObjectId(_id)},{$set:updates},{new:true})
            if(!updated){
                return res.status(400).json({error:"Couldn't Update !"})
            }

            res.status(200).json('Updated Successfuly!')
        }catch(err){
            res.status(400).json({error:err.message})
        }
    }
)

router.get(
    '/phonedata',
    adminauth,
    async(req,res)=>{
        try{
            const phone=await phonemodel2.aggregate([
                {$match:{ $or:[{cost:""},
                {make_model:""},
                {cumulative:""},
                {release:""},
                {company:""},
                {type:""},
                {total_percent:""},
                {model:""}] 
            }},
                {$lookup:{
                    from:'phonemodelreports',
                    localField:'make_model',
                    foreignField:'phoneModel',
                    as:'extra_details'
                }
            },
            {$project:{
                cost:1,
                make_model:1,
                cumulative:1,
                release:1,
                company:1,
                type:1,
                total_percent:1,
                model:1,
                impressions:{$sum:"$extra_details.impression"}
            }},
            //{$unwind:{path:"$extra_details", preserveNullAndEmptyArrays: true}},
            {$sort:{"impressions":-1}},
            
            ]).allowDiskUse(true)
            res.status(200).json(phone)
        }catch(err){
            res.status(400).json({error:err})
        }
    }
)

router.get(
    '/zipdata',
    adminauth,
    async(req,res)=>{
        try{
            const result=await Zipreports2.aggregate([
                {$match:{ $or:[{area:""},
                {pincode:""},
                {city:""},
                {district:""},
                {state:""},
                {latitude:""},
                {longitude:""},
            ]}},
            ])
            res.status(200).json(result)
        }catch(err){
            console.log(err.message)
            res.status(400).send({error:err.mesaage})
        }
    }
)

router.put(
    '/editzipdata',
    adminauth,
    async(req,res)=>{
        try{            
            //data.make_model=data.make_model.toLowerCase()
            
            let {_id,area,pincode,lowersubcity,subcity,city,grandcity,district,comparison,state,grandstate,latitude,longitude}=req.body
            let updates={area,pincode,lowersubcity,subcity,city,grandcity,district,comparison,state,grandstate,latitude,longitude}
            
            const updated=await Zipreports2.findOneAndUpdate({_id:mongoose.Types.ObjectId(_id)},{$set:updates},{new:true})
            if(!updated){
                return res.status(400).json({error:"Couldn't Update !"})
            }

            res.status(200).json('Updated Successfuly!')
        }catch(err){
            res.status(400).json({error:err.message})
        }
    }
)


module.exports = router