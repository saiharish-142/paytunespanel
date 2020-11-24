const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types

const campaginwisereportSchema = new mongoose.Schema({
    date : {type:String},
    campaignId : {type:ObjectId},
    appId : {type:String},
    requests : {type:Number},
    ads : {type:Number},
    servedAudioImpressions : {type:Number},
    servedCompanionAds : {type:Number},
    completedAudioImpressions : {type:Number},
    error : {type:Number},
    impression : {type:Number},
    start : {type:Number},
    midpoint : {type:Number},
    thirdQuartile : {type:Number},
    complete : {type:Number},
    progress : {type:Number},
    creativeView : {type:Number},
    CompanioncreativeView : {type:Number},
    CompanionClickTracking : {type:Number},
    createdOn : {type:Date}
},{timestamps:true})

mongoose.model('campaignwisereports',campaginwisereportSchema)