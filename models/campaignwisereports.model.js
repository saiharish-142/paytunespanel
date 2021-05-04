const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types

var campaignwisereportsSchema = new mongoose.Schema({
    date: { type: String },
    campaignId: { type: ObjectId, ref: 'streamingadObj' },
    appId: String,
    language: String,
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

mongoose.model('campaignwisereports',campaignwisereportsSchema)
