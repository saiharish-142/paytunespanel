var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var campaignifareportsSchema = new Schema({
    campaignId: { type: Schema.Types.ObjectId, ref: 'streamingadObj' },
    ccampaignId: String,
    ifa: String,
    createdOn: { type: Date, default: Date.now },
});
campaignifareportsSchema.index({ ifa: 1 });

campaignifareportsSchema.statics.load = function(id, cb) {
    this.findOne({
            _id: id
        })
        .exec(cb);
};
var campaignifareportObj = mongoose.model('campaignifareports', campaignifareportsSchema);
module.exports = campaignifareportObj;
