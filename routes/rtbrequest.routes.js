const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Rtbrequest = mongoose.model('rtbrequests')
const adminauth = require('../authenMiddleware/adminauth')
const Reqreport = mongoose.model('reqreport')
const Resreport = mongoose.model('resreport')
const EpisodeModel = require('../models/episodemodel')
// const Campaignwisereports=require('../models/campaignwisereports.model')
const SpentReport = mongoose.model('spentreports')
const Campaignwisereports = mongoose.model('campaignwisereports')

router.get('/rtbrs', adminauth, (req, res) => {
    Rtbrequest.find()
        .then((result) => {
            res.json(result)
        }).catch((err) => {
            console.log(err)
        });
})

router.post('/addrtbr', adminauth, (req, res) => {
    const {
        bidreq, bidid, imp, app, device, user, at, tmax, source,
        ext, Type, bidstatus
    } = req.body
    if (!Type || !imp || !app || !bidreq || !bidid || !user) {
        return res.status(422).json({ error: 'Enter all the fields' })
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

router.post(
    '/get_reqreports_via_ssp',
    adminauth,
    async (req, res) => {
        try {
            const ssp = req.body.ssp
            console.log(1)
            const reports = await Reqreport.aggregate([
                { $match: { ssp } },
                {
                    $group: {
                        _id: { Date: "$date" },
                        requests: {
                            $sum: "$requests"
                        }

                    }
                }
            ])


            res.status(200).json(reports)
        } catch (err) {
            res.status(400).json({ error: err.message })
            console.log(err.message)
        }
    }
)

router.post(
    '/get_resreports_via_ssp',
    adminauth,
    async (req, res) => {
        try {
            const ssp = req.body.ssp
            const reports = await Resreport.aggregate([
                { $match: { ssp } },
                // {$lookup:{
                //     from:'streamingads',
                //     localField:'campaignId',
                //     foreignField:'_id',
                //     as:'campaign_details'
                // }},

                //  {$unwind:'$campaign_details'},
                // {$lookup:{
                //     from:'publisherapps',
                //     localField:'appId',
                //     foreignField:'AppId',
                //     as:'app_details'
                // }},
                // {$unwind:'$app_details'},
                {
                    $group: {
                        _id: { Date: "$date" },
                        requests: {
                            $sum: "$ads"
                        }
                    }
                },
                // {$project:{
                //     rtbType:1,
                //     ads:"$requests",
                //     //requests,
                //     campaign_name:"$campaign_details.AdTitle",
                //     app_name:"$app_details.AppName"
                // }}

            ])
            res.status(200).json(reports)
        } catch (err) {
            res.status(400).json({ error: err.message })
        }
    }
)

router.get(
    '/get_bids_won',
    adminauth,
    async (req, res) => {
        try {
            const result = await SpentReport.aggregate([
                {
                    $facet: {
                        "Triton_Data": [
                            { $match: { ssp: "Triton" } },
                            {
                                $group: {
                                    _id: { Date: "$date" },
                                    impressions: { $sum: "$impression" }
                                }
                            }],
                        "Rubicon_Data": [
                            { $match: { ssp: "Rubicon" } },
                            {
                                $group: {
                                    _id: { Date: "$date" },
                                    impressions: { $sum: "$impression" }
                                }
                            }]
                    }
                }
                //     {$group:{_id:{Date:"$date"},
                //     impressions:{$sum:"$impression"}
                // }}
            ])
            res.status(200).json(result)
        } catch (err) {
            console.log(err.message)
            res.status(400).json({ error: err.message })
        }
    }
)

router.get(
    '/get_bids_won_publisher',
    adminauth,
    async (req, res) => {
        try {
            // const dat=new Date().toISOString()
            // const t=dat.split('T')
            // const date=t[0]
            const result = await Campaignwisereports.aggregate([
                { $group: { _id: { Date: '$date', appId: '$appId' }, impressions: { $sum: "$impression" } } },
                //{$match:{ '_id.Date':date}},

                { $addFields: { "new_appid": { "$toObjectId": "$_id.appId" } } },
                {
                    $lookup: {
                        from: 'publisherapps',
                        localField: 'new_appid',
                        foreignField: '_id',
                        as: 'app_details'
                    }
                },
                { $unwind: { path: "$app_details", preserveNullAndEmptyArrays: true } },

                {
                    $project: {
                        appName: "$app_details.AppName",
                        date: '$_id.Date',
                        impressions: 1
                    }
                },
                { $sort: { impressions: -1 } }
            ])
            res.status(200).json(result)

        } catch (err) {
            console.log(err.message)
            res.status(400).json({ error: err.message })
        }
    }
)



router.get(
    '/spent_data_via_date',
    adminauth,
    async (req, res) => {
        try {
            const result = await SpentReport.aggregate([
                {
                    $facet: {
                        "Triton_Data": [
                            { $match: { ssp: "Triton" } },
                            {
                                $group: {
                                    _id: { Date: "$date" },
                                    total_spent: { $sum: "$totalSpent" }
                                }
                            }],
                        "Rubicon_Data": [
                            { $match: { ssp: "Rubicon" } },
                            {
                                $group: {
                                    _id: { Date: "$date" },
                                    total_spent: { $sum: "$totalSpent" }
                                }
                            }]
                    }
                }
            ])
            console.log(result[0].Triton_Data)
            res.status(200).json(result)
        } catch (err) {
            res.status(400).json({ error: err.message })
            console.log(err.message)
        }
    }
)

router.post(
    '/getepisodewise_report',
    adminauth,
    async (req, res) => {
        try {
            const result = await EpisodeModel.aggregate([
                {
                    $group: {
                        _id: "$episodename",
                        category: { $addToSet: "$category" },
                        publisher: { $addToSet: "$publisherid" },
                        request: { $sum: "$requests" }
                    }
                },
                {
                    $lookup:{
                    from:'apppublishers',
                    localField:'publisher',
                    foreignField:'publisherid',
                    as:'publisher_details'
                    }
                },
                // {$unwind:"$publisher_details"},
                {$project:{
                    episodename:"$_id",
                    category:"$category",
                    publisher:{$setUnion:["$publisher_details.publishername",[]]},
                    request:"$request"
                }}
            ])
            res.status(200).json({result})
        } catch (err) {
            res.status(400).json({ error: err.message })
            console.log(err.message)
        }
    }
)

module.exports = router