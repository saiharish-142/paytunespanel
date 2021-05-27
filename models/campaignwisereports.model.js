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
    feed:String,
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

campaignwisereportsSchema.virtual('Apppubid', {
    ref: 'apppublishers', // The model to use
    localField: 'apppubid', // The field in playerListSchema
    foreignField: 'publisherid', // The field on videoSchema. This can be whatever you want.
});

mongoose.model('campaignwisereports',campaignwisereportsSchema)