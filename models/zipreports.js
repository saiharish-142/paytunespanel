var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var zipreportsSchema = new Schema({
    campaignId: { type: Schema.Types.ObjectId, ref: 'streamingadObj' },
    appId: String,
    zip: Number,
    requests: Number,
    rtbType:String,
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
zipreportsSchema.index({ zip: 1 });

zipreportsSchema.statics.load = function(id, cb) {
    this.findOne({
            _id: id
        })
        .exec(cb);
};
var zipreportObj = mongoose.model('zipreports', zipreportsSchema);
module.exports = zipreportObj;