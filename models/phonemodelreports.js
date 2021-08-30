var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var phonemodelreportsSchema = new Schema({
    campaignId: { type: Schema.Types.ObjectId, ref: 'streamingadObj' },
    appId: String,
    phoneModel: String,
    requests: Number,
    rtbType: String,
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
phonemodelreportsSchema.index({ phoneModel: 1 });

phonemodelreportsSchema.statics.load = function(id, cb) {
    this.findOne({
            _id: id
        })
        .exec(cb);
};
var phonemodelreportObj = mongoose.model('phonemodelreports', phonemodelreportsSchema);
module.exports = phonemodelreportObj;
