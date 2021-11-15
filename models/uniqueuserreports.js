var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var uniqueuserreportsSchema = new Schema({
    campaignId: { type: Schema.Types.ObjectId, ref: 'streamingadObj' },
    uniqueusers: Number,
    createdOn: { type: Date, default: Date.now },
});
uniqueuserreportsSchema.index({ ifa: 1 });

uniqueuserreportsSchema.statics.load = function(id, cb) {
    this.findOne({
            _id: id
        })
        .exec(cb);
};
var uniqueuserreportObj = mongoose.model('uniqueuserreports', uniqueuserreportsSchema);
module.exports = uniqueuserreportObj;
