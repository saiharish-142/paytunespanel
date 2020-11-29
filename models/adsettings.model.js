const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types

const adsettingsSchema = new mongoose.Schema({
    deal:{type:String},
    dealID:{type:String},
    appId:{type:String},
    priority:{type:String},
    campaignId:{type:ObjectId},
    publisherId:{type:String},
    authorizationKey:{type:String},
    targetImpression:{type:Number},
    impressionLimit:{type:Number},
    priceLimit:{type:Number},
    adDomain:{type:String},
    adCategory:{type:String},
    startDate:{type:Date},
    endDate:{type:Date},
    createdOn:{type:Date},
    geoTargetting:{type:Boolean},
    pinTargetting:{type:Boolean},
    regionTargetting:{type:Boolean},
    targettingPin:[],
    targettingRegion:[],
    isRunning:{type:Boolean}
})

mongoose.model('adsetting',adsettingsSchema)