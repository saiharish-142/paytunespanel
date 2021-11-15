const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types

const adsettingsSchema = new mongoose.Schema({
    deal:{type:String},
    dealID:{type:String},
    appId:{type:String},
    priority:{type:String},
    campaignId:{type:ObjectId},
    publisherId:{type:String},
    type:{type:String},
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
    isRunning:{type:Boolean},
    Investing :{type:Boolean} ,
    ET : {type:Boolean},
    ZeeNews : {type:Boolean},
    HT : {type:Boolean},
    Jagran : {type:Boolean},
    Abp : {type:Boolean},
    AajTak : {type:Boolean},
    Cricbuzz : {type:Boolean},
    MoneyControl : {type:Boolean},
})

mongoose.model('adsetting',adsettingsSchema)
module.exports=adsettingsSchema