var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var tvrequestsSchema = new Schema({
    date: String,
    publisherid: String,
    rtbType: String,
    ssp: String,
    request: Number
});
tvrequestsSchema.index({ date: 1, publisherid: 1, rtbType:1});

tvrequestsSchema.statics.load = function(id, cb) {
    this.findOne({
            _id: id
        })
        .exec(cb);
};
module.exports=tvrequestsSchema;
// var tvrequestObj = mongoose.model('tvrequests', tvrequestsSchema);
// module.exports = tvrequestObj;