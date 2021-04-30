var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var resreportsSchema = new Schema({
    date: String,
    rtbType: String,
    campaignId: { type: Schema.Types.ObjectId, ref: 'streamingadObj' },
    ssp: String,
    appId: String, //publisher id 
    ads: Number  
});
resreportsSchema.index({ date: 1 });

resreportsSchema.statics.load = function(id, cb) {
    this.findOne({
            _id: id
        })
        .exec(cb);
};
var resreportObj = mongoose.model('resreport', resreportsSchema);
module.exports = resreportObj;
//req
//date, ssp, rtbtype 
//res
// campaignid , appid name populate

