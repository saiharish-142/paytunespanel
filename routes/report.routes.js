const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const StreamingAds = mongoose.model('streamingads')
const Report = mongoose.model('Report')
const publisherapps = mongoose.model('publisherapps')
const adminauth  = require('../authenMiddleware/adminauth')

router.get('/reports',adminauth,(req,res)=>{
    Report.find()
    .populate('Publisher')
    .sort('-date')
    .then(reports=>{
        res.json(reports)
    })
    .catch(err=>console.log(err))
})

router.put('/reportbydate',adminauth,(req,res)=>{
    const { date } = req.body
    Report.find({date:date})
    .populate('Publisher')
    .sort('-date')
    .then(reports=>{
        res.json(reports)
    })
    .catch(err=>console.log(err))
})

router.put('/reportbydatereq',adminauth,(req,res)=>{
    const { date, campaignId, appId } = req.body
    Report.find({date:date, campaignId:campaignId, Publisher:appId})
    .populate('Publisher')
    .sort('-date')
    .then(reports=>{
        res.json(reports)
    })
    .catch(err=>console.log(err))
})

router.put('/sumrepobyjoincamp',adminauth,(req,res)=>{
    const { adtitle } = req.body
    StreamingAds.aggregate([
        {$match:{
            AdTitle:{$regex:adtitle}
        }},{$project:{
            id:"$_id"
        }}
    ])
    .then(resp=>{
        var ids = [];
        resp.map(re => {
            ids.push(re.id)
        })
        Report.aggregate([
            {$match:{
                "campaignId": {$in : ids}
            }},{$group:{
                _id:"$Publisher", updatedAt:{$push:"$updatedAt"}, impressions:{$sum:"$impressions"}, complete:{$sum:"$complete"}, clicks:{$sum:"$clicks"}, region:{$push:"$region"}
            }},{$project:{
                Publisher:"$_id", updatedAt:"$updatedAt", impressions:"$impressions", complete:"$complete", clicks:"$clicks", region:"$region", _id:0
            }}
        ])
        .then(reports=>{
            publisherapps.populate(reports,{path:'Publisher'},function(err,populatedreports){
                if(err){
                    return res.status(422).json(err)
                }
                resu = populatedreports;
                resu.map((det)=>{
                    var resregion = [].concat.apply([], det.region);
                    resregion = [...new Set(resregion)];
                    det.region = resregion
                    var updatedDate = det.updatedAt
                    updatedDate.sort(function(a,b){
                        return new Date(b) - new Date(a);
                    });
                    det.updatedAt = updatedDate
                })
                res.json(resu)
            })
        })
        .catch(err=>console.log(err))
    })
    .catch(err=>console.log(err))
})

router.put('/sumreportofcam',adminauth,(req,res)=>{
    const { campaignId } = req.body
    var resu = [];
    Report.aggregate([
        {$match:{
            "campaignId":campaignId
        }},{$group:{
            _id:"$Publisher", updatedAt:{$push:"$updatedAt"}, impressions:{$sum:"$impressions"}, complete:{$sum:"$complete"}, clicks:{$sum:"$clicks"}, region:{$push:"$region"}
        }},{$project:{
            Publisher:"$_id", updatedAt:"$updatedAt", impressions:"$impressions", complete:"$complete", clicks:"$clicks", region:"$region", _id:0
        }}
    ])
    .then(reports=>{
        publisherapps.populate(reports,{path:'Publisher'},function(err,populatedreports){
            if(err){
                return res.status(422).json(err)
            }
            resu = populatedreports;
            resu.map((det)=>{
                var resregion = [].concat.apply([], det.region);
                resregion = [...new Set(resregion)];
                det.region = resregion
                var updatedDate = det.updatedAt
                updatedDate.sort(function(a,b){
                    return new Date(b) - new Date(a);
                });
                det.updatedAt = updatedDate
            })
            res.json(resu)
        })
    })
    .catch(err=>console.log(err))
})

router.put('/sumreportofcam22',adminauth,(req,res)=>{
    const { campaignId } = req.body
    var resu = [];
    Report.aggregate([
        {$match:{
            "campaignId":{$in:campaignId}
        }},{$group:{
            _id:"$Publisher", 
            updatedAt:{$push:"$updatedAt"}, 
            camp:{$push:"$campaignId"} , 
            impressions:{$sum:"$impressions"}, 
            complete:{$sum:"$complete"}, 
            clicks:{$sum:"$clicks"}
        }},{$project:{
            Publisher:"$_id", 
            updatedAt:"$updatedAt", 
            campaignId:"$camp", 
            impressions:"$impressions", 
            complete:"$complete", 
            clicks:"$clicks",
            _id:0
        }}
    ])
    .then(reports=>{
        publisherapps.populate(reports,{path:'Publisher'},function(err,populatedreports){
            if(err){
                return res.status(422).json(err)
            }
            resu = populatedreports;
            // console.log(populatedreports)
            resu.map((det)=>{
                var rescampaignId = [].concat.apply([], det.campaignId);
                rescampaignId = [...new Set(rescampaignId)];
                det.campaignId = rescampaignId[0]
                var updatedDate = det.updatedAt
                updatedDate.sort(function(a,b){
                    return new Date(b) - new Date(a);
                });
                det.updatedAt = updatedDate
            })
            StreamingAds.populate(resu,{path:'campaignId'},function(err,populatedres){
                if(err){
                    return res.status(422).json(resu)
                }
                res.json(populatedres)
            })
        })
    })
    .catch(err=>console.log(err))
})

router.put('/regionsum',adminauth,(req,res)=>{
    const { campaignId } = req.body
    var resu = [];
    Report.aggregate([
        {$match:{
            "campaignId":{$in:campaignId}
        }},{$group:{
            _id:null, 
            region:{$push:"$region"}
        }},{$project:{
            region:"$region",
            _id:0
        }}
    ])
    .then(reports=>{
        // resu = reports;
        resu = reports.map((det)=>{
            var regionde = datamaker(det.region,'region')
            det.region = regionde;
            return det;
        })
        res.json(resu)
    })
    .catch(err=>console.log(err))
})

router.put('/regionsum',adminauth,(req,res)=>{
    const { campaignId } = req.body
    var resu = [];
    Report.aggregate([
        {$match:{
            "campaignId":{$in:campaignId}
        }},{$group:{
            _id:null, 
            platformtype:{$push:"$platformtype"}
        }},{$project:{
            platformtype:"$platformtype",
            _id:0
        }}
    ])
    .then(reports=>{
        resu = reports;
        resu = resu.map((det)=>{
            var platformtypede = datamaker(det.platformtype,'platformType')
            det.platformtype = platformtypede;
            return det;
        })
        res.json(resu)
    })
    .catch(err=>console.log(err))
})
// , 
//             region:{$push:"$region"},
//             platformtype:{$push:"$platformtype"},
//             pincode:{$push:"$pincode"},
//             osVersion:{$push:"$osVersion"},
//             language:{$push:"$language"},
//             phoneModel:{$push:"$phoneModel"}
// var regionde = datamaker(det.region,'region')
//                 det.region = regionde
//                 var platformtypede = datamaker(det.platformtype,'platformType')
//                 det.platformtype = platformtypede
//                 var pincodede = datamaker(det.pincode,'zip')
//                 det.pincode = pincodede
//                 var osVersionde = datamaker(det.osVersion,'osVersion')
//                 det.osVersion = osVersionde
//                 var languagede = datamaker(det.language,'language')
//                 det.language = languagede
//                 var phoneModelde = datamaker(det.phoneModel,'phoneModel')
//                 det.phoneModel = phoneModelde
function datamaker(aaa,idrequ){
    var super11 = [];
    aaa.map(part => {
        super11 = super11.concat(part)
    })
    var groups = {};
    var id = idrequ;
    for (var i = 0; i < super11.length; i++) {
    var groupName = super11[i][id];
    if (!groups[groupName]) {
        groups[groupName] = [];
    }
    groups[groupName].push(super11[i].result);
    }
    myArray = [];
    for (var groupName in groups) {
    myArray.push({[id]: groupName, result: groups[groupName]});
    }
    console.log(myArray)
    myArray.map(esc=>{
        // var result = [];
        const sumArray = arr => {
            const res = {};
            for(let i = 0; i < arr.length; i++){
                Object.keys(arr[i]).forEach(key => {
                    res[key] = (res[key] || 0) + arr[i][key];
                });
            };
            return res;
        };
        // console.log(esc)
        esc.result = sumArray(esc.result)
    })
    return myArray;
}

router.put('/detreportcambydat',adminauth,(req,res)=>{
    const { campaignId } = req.body
    var resu = [];
    Report.aggregate([
        {$match:{
            "campaignId":{$in : campaignId}
        }},{$group:{
            _id:{date:"$date"},updatedAt:{$push:'$updatedAt'}, impressions:{$sum:"$impressions"}, complete:{$sum:"$complete"}, clicks:{$sum:"$clicks"}, region:{$push:"$region"}
        }},{$project:{
            date:"$_id.date", updatedAt:"$updatedAt", impressions:"$impressions", complete:"$complete", clicks:"$clicks", region:"$region", _id:0
        }},{$sort: {date: -1}}
    ])
    .then(reports=>{
        resu = reports;
        resu.map((det)=>{
            var resregion = [].concat.apply([], det.region);
            resregion = [...new Set(resregion)];
            det.region = resregion
            var updatedDate = det.updatedAt
            updatedDate.sort(function(a,b){
                return new Date(b) - new Date(a);
            });
            det.updatedAt = updatedDate
        })
        res.json(resu)
    })
    .catch(err=>console.log(err))
})

router.put('/reportbycamp',adminauth,(req,res)=>{
    const { campaignId } = req.body
    Report.find({campaignId:{$in : campaignId}})
    .populate('Publisher')
    .sort('-date')
    .then(reports=>{
        res.json(reports)
    })
    .catch(err=>console.log(err))
})

router.put('/detreportbycamp',adminauth,(req,res)=>{
    const { campaignId, date } = req.body
    Report.findOneAndUpdate({campaignId:campaignId,date:date})
    .populate('Publisher')
    .sort('-date')
    .then(reports=>{
        if(!reports){
            console.log('good')
        }else{
            console.log('bad')
        }
        res.json(reports)
    })
    .catch(err=>console.log(err))
})

router.post('/createReport',(req,res)=>{
    const { date, appId, impressions, campaignId, completed, region, clicks, spend } = req.body
    const report = new Report({
        date:date,
        Publisher:appId,
        campaignId:campaignId,
        impressions:impressions,
        complete:completed,
        clicks:clicks,
        region:region,
        spend:spend,
        avgSpend:spend
    })
    report.save()
    .then(result => {
        res.json(result)
    })
    .catch(err => console.log(err))
})

router.delete('/deleteallbyadmin',adminauth,(req,res)=>{
    const {date} = req.body
    Report.deleteMany({date:date})
    .then(repon=>{
        res.json({relt:repon,mess:"deleted"})
    })
})

router.delete('/singedelte',adminauth,(req,res)=>{
    const {id} = req.body
    Report.deleteOne({_id:id})
    .then(repon=>{
        res.json({relt:repon,mess:"deleted"})
    })
})

// router.delete('/deleteMany',adminauth,(req,res)=>{
//     Report.deleteMany({_id:req.body.id})
//     .then(repon=>{
//         res.json({relt:repon,mess:"deleted"})
//     })
// })

module.exports = router