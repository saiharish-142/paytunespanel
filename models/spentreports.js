var mongoose = require('mongoose');
// var streamingadObj = require('./../streamingads/streamingads.js');
var Schema = mongoose.Schema;
var spentreportsSchema = new Schema({
    // campaignId: { type: Schema.Types.ObjectId, ref: 'streamingadObj' },
    // appId: String,
    // date: { type: String },
    // rtbType: String,
    // totalSpent: Number,
    // impression: Number,
    // createdOn: { type: Date, default: Date.now },
    campaignId: { type: Schema.Types.ObjectId, ref: 'streamingadObj' },
    appId: String,
    ssp: String,
    apppubid: String,
    date: { type: String },
    rtbType: String,
    totalSpent: Number,
    impression: Number,
    createdOn: { type: Date, default: Date.now },
});
spentreportsSchema.index({ campaignId: 1 });

spentreportsSchema.statics.load = function(id, cb) {
    this.findOne({
            _id: id
        })
        .exec(cb);
};
var spentreportObj = mongoose.model('spentreports', spentreportsSchema);
module.exports = spentreportObj;
