var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bundlenamereportsSchema = new Schema({
    campaignId: { type: Schema.Types.ObjectId, ref: 'streamingadObj' },
    appId: String,
    bundlename: String,
    requests: Number,
    ads: Number, ///AdServed
    servedAudioImpressions: Number,
    servedCompanionAds: Number,
    completedAudioImpressions: Number,
    error: Number,
    impression: Number,
    start: Number,
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
bundlenamereportsSchema.index({ bundlename: 1 });

bundlenamereportsSchema.statics.load = function(id, cb) {
    this.findOne({
            _id: id
        })
        .exec(cb);
};
var bundlenamereportObj = mongoose.model('bundlenamereports', bundlenamereportsSchema);
module.exports = bundlenamereportObj;
