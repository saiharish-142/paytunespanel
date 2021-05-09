const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types

var campaignwisereportsSchema = new mongoose.Schema({
    date: { type: String },
    campaignId: { type: ObjectId, ref: 'streamingadObj' },
    appId: String,
    language: String,
    apppubid: String,
    ssp: String,
    requests: Number,
    ads: Number, ///AdServed
    servedAudioImpressions: Number,
    servedCompanionAds: Number,
    completedAudioImpressions: Number,
    error: Number,
    impression: Number,
    start: Number,
    firstQuartile: Number,
    midpoint: Number,
    thirdQuartile: Number,
    complete: Number,
    progress: Number,
    creativeView: Number,
    CompanioncreativeView: Number,
    CompanionClickTracking: Number,
    SovcreativeView: Number,
    SovClickTracking: Number,
    createdOn: { type: Date, default: Date.now },
});

var apppublishersSchema = mongoose.Schema({
    publisherid: String,
    publishername: String,
    ssp: { type: String },
});


campaignwisereportsSchema.virtual(
    "publishids", // can be any name for your virtual, used as key to populate
    {
        ref: "apppublishers",
        localField: "apppubid", // name of field in author's schema
        foreignField: "publisherid",    
    }
)
    
mongoose.model('apppublishers',apppublishersSchema)
mongoose.model('campaignwisereports',campaignwisereportsSchema)