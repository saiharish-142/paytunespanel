var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var campaignwisereportsSchema = new Schema({
    date: { type: String },
    campaignId: { type: Schema.Types.ObjectId, ref: 'streamingadObj' },
    appId: String,
    apppubid: String,
    ssp: String,
    creativesetId: String,
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
campaignwisereportsSchema.index({ date: 1 });

campaignwisereportsSchema.statics.load = function(id, cb) {
    this.findOne({
            _id: id
        })
        .exec(cb);
};
var campaignwisereportObj = mongoose.model('campaignwisereports', campaignwisereportsSchema);
module.exports = campaignwisereportObj;