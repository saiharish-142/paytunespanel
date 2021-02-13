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
    .limit(20)
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
            publishunique:{$push:"$publishunique"} , 
            campunique:{$push:"$campunique"} , 
            impressions:{$sum:"$impressions"}, 
            thirdQuartile:{$sum:"$thirdQuartile"}, 
            firstQuartile:{$sum:"$firstQuartile"}, 
            midpoint:{$sum:"$midpoint"}, 
            complete:{$sum:"$complete"}, 
            clicks:{$sum:"$clicks"}
        }},{$project:{
            Publisher:"$_id", 
            updatedAt:"$updatedAt", 
            campaignId:"$camp", 
            publishunique:"$publishunique", 
            campunique:"$campunique", 
            impressions:"$impressions", 
            complete:"$complete", 
            midpoint:"$midpoint", 
            firstQuartile:"$firstQuartile", 
            thirdQuartile:"$thirdQuartile", 
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

router.put('/regionsum1',adminauth,(req,res)=>{
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
        res.json(reports)
    })
    .catch(err=>console.log(err))
})

router.put('/regionsum',adminauth,(req,res)=>{
    const { campaignId } = req.body
    var resu = [];
    // Report.db.db.command({
    //     aggregate: "Report",
    //     pipeline:[
    //         {$match:{
    //             "campaignId":{$in:campaignId}
    //         }},{$group:{
    //             _id:"$appId", 
    //             region:{$push:"$region"}
    //         }},{$project:{
    //             region:"$region",
    //             _id:0,
    //             appId:"$_id"
    //         }}
    //     ],
    //     allowDiskUse: true,
    //     cursor: {  }
    // })
    Report.aggregate([
        {$match:{
            "campaignId":{$in:campaignId}
        }},{$group:{
            _id:"$appId", 
            region:{$push:"$region"}
        }},{$project:{
            region:"$region",
            _id:0,
            appId:"$_id"
        }}
    ])
    .then(reports=>{
        // resu = reports;
        var resregion = [];
        resu = reports.map((det)=>{
            var regionde = datamaker(det.region,'region')
            det.region = regionde;
            resregion = resregion.concat(regionde)
            return det;
        })
        resregion = datamaker2(resregion,'region')
        res.json([{region:resregion}])
    })
    .catch(err=>console.log(err))
})

router.put('/platformsum',adminauth,(req,res)=>{
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

router.put('/pincodesum',adminauth,(req,res)=>{
    const { campaignId } = req.body
    var resu = [];
    // Report.db.db.command({
    //     aggregate: "Report",
    //     pipeline:[
    //         {$match:{
    //             "campaignId":{$in:campaignId}
    //         }},{$group:{
    //             _id:"$appId", 
    //             pincode:{$push:"$pincode"}
    //         }},{$project:{
    //             pincode:"$pincode",
    //             _id:0
    //         }}
    //     ],
    //     allowDiskUse: true,
    //     cursor: {  }
    // })
    Report.find({"campaignId":{$in:campaignId}}).exec(function(err, datatotalOld) {
        if (err) {
            console.log('Err', err);
        } else {
            //console.log('datatotalOld',datatotalOld);
            //res.json(datatotalOld);
            console.log('datatotalOldlength',datatotalOld.length);
            if(datatotalOld!=undefined && datatotalOld!=''){
                calculatePincodeData(datatotalOld,function(resultteddata){
                    //console.log('resultteddata',resultteddata);
                    res.jsonp(resultteddata);
                });     
            }
            
        }
    }); 
})
function calculatePincodeData(csvDataArray,callback){
    console.log('in callback');
        var pincodeData=[];
                var checkCircle = function(csvDataArray, i) {
                    if (i < csvDataArray.length) {
                        var tVal = csvDataArray[i];
                        if(tVal.pincode!=undefined && tVal.pincode!=''){
                            pincodeData.push(tVal.pincode);
                        }
                        i++;
                        checkCircle(csvDataArray, i);
                    } else {
                        callback(pincodeData);
                    }
                }
                checkCircle(csvDataArray, 0);   
    
    }
router.put('/pincodesum2',adminauth,(req,res)=>{
    const { campaignId } = req.body
    var resu = [];
    // Report.db.db.command({
    //     aggregate: "Report",
    //     pipeline:[
    //         {$match:{
    //             "campaignId":{$in:campaignId}
    //         }},{$group:{
    //             _id:"$appId", 
    //             pincode:{$push:"$pincode"}
    //         }},{$project:{
    //             pincode:"$pincode",
    //             _id:0
    //         }}
    //     ],
    //     allowDiskUse: true,
    //     cursor: {  }
    // })
    Report.aggregate([
        {$match:{
            "campaignId":{$in:campaignId}
        }},{$group:{
            _id:"$appId", 
            pincode:{$push:"$pincode"}
        }},{$project:{
            pincode:"$pincode",
            _id:0
        }}
    ])
    .exec(function(err, datatotalOld) {
        if (err) {
            console.log('Err', err);
        } else {
            res.json(datatotalOld);
        }
    });
})

router.put('/languagesum',adminauth,(req,res)=>{
    const { campaignId } = req.body
    var resu = [];
    Report.aggregate([
        {$match:{
            "campaignId":{$in:campaignId}
        }},{$group:{
            _id:"$appId", 
            language:{$push:"$language"}
        }},{$project:{
            language:"$language",
            _id:0
        }}
    ])
    .then(reports=>{
        // resu = reports;
        var lanres = [];
        resu = reports.map((det)=>{
            var languagede = datamaker(det.language,'language')
            det.language = languagede;
            lanres = lanres.concat(languagede)
            return det;
        })
        lanres = datamaker2(lanres,'language')
        res.json([{language:lanres}])
    })
    .catch(err=>console.log(err))
})

router.put('/phoneModelsum',adminauth,(req,res)=>{
    const { campaignId } = req.body
    var resu = [];
    Report.aggregate([
        {$match:{
            "campaignId":{$in:campaignId}
        }},{$group:{
            _id:null, 
            phoneModel:{$push:"$phoneModel"}
        }},{$project:{
            phoneModel:"$phoneModel",
            _id:0
        }}
    ])
    .then(reports=>{
        resu = reports;
        resu = resu.map((det)=>{
            var phoneModelde = datamaker(det.phoneModel,'phoneModel')
            det.phoneModel = phoneModelde;
            return det;
        })
        res.json(resu)
    })
    .catch(err=>console.log(err))
})

router.put('/phonePlatformsum',adminauth,(req,res)=>{
    const { campaignId } = req.body
    var resu = [];
    Report.aggregate([
        {$match:{
            "campaignId":{$in:campaignId}
        }},{$group:{
            _id:null, 
            phonePlatform:{$push:"$phonePlatform"}
        }},{$project:{
            phonePlatform:"$phonePlatform",
            _id:0
        }}
    ])
    .then(reports=>{
        resu = reports;
        resu = resu.map((det)=>{
            var phonePlatformde = datamaker(det.phonePlatform,'platformType')
            det.phonePlatform = phonePlatformde;
            return det;
        })
        res.json(resu)
    })
    .catch(err=>console.log(err))
})

router.put('/deviceModelsum',adminauth,(req,res)=>{
    const { campaignId } = req.body
    var resu = [];
    Report.aggregate([
        {$match:{
            "campaignId":{$in:campaignId}
        }},{$group:{
            _id:null, 
            deviceModel:{$push:"$deviceModel"}
        }},{$project:{
            deviceModel:"$deviceModel",
            _id:0
        }}
    ])
    .then(reports=>{
        resu = reports;
        resu = resu.map((det)=>{
            var deviceModelde = datamaker(det.deviceModel,'pptype')
            det.deviceModel = deviceModelde;
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
    if (!groups[`${groupName}`+"unique"]) {
        groups[`${groupName}`+"unique"] = [];
    }
    if(super11[i].unique !== undefined){
        groups[`${groupName}`+"unique"].push(super11[i].unique);
    }
    groups[groupName].push(super11[i].result);
    }
    myArray = [];
    // console.log(groups)
    for (var groupName in groups) {
        if(!groupName.includes('unique')){
            if(groups[`${groupName}`+"unique"]){
                groups[`${groupName}`+"unique"] = groups[`${groupName}`+"unique"].sort(function(a,b){return b-a;})
                groups[`${groupName}`+"unique"] = groups[`${groupName}`+"unique"][0]
            }
            myArray.push({[id]: groupName, unique: groups[`${groupName}`+"unique"], result: groups[groupName]});
        }
    }
    // console.log(myArray)
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
        var resultDes = [];
        esc.result.map(eac=>{
            resultDes = resultDes.concat(eac)
        })
        esc.result = sumArray(resultDes)
        // console.log(esc)
    })
    return myArray;
}
function datamaker2(aaa,idrequ){
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
    if (!groups[`${groupName}`+"unique"]) {
        groups[`${groupName}`+"unique"] = 0;
    }
    if(super11[i].unique !== undefined){
        groups[`${groupName}`+"unique"] += super11[i].unique;
    }
    groups[groupName].push(super11[i].result);
    }
    myArray = [];
    // console.log(groups)
    for (var groupName in groups) {
        if(!groupName.includes('unique')){
            myArray.push({[id]: groupName, unique: groups[`${groupName}`+"unique"], result: groups[groupName]});
        }
    }
    // console.log(myArray)
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
        var resultDes = [];
        esc.result.map(eac=>{
            resultDes = resultDes.concat(eac)
        })
        esc.result = sumArray(resultDes)
        // console.log(esc)
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
    Report.find({campaignId:{$in:campaignId},date:date})
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