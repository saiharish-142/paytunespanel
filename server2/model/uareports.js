var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var uareqreportsSchema = new Schema({
    date: String,
    publisherid: String,
    episodename: String,
    ua: String,
    ads: Number
});
uareqreportsSchema.index({ date: 1, ua:1});

uareqreportsSchema.statics.load = function(id, cb) {
    this.findOne({
            _id: id
        })
        .exec(cb);
};
var uareqreportObj = mongoose.model('uareqreports', uareqreportsSchema);
module.exports = uareqreportsSchema;

//zipreqreports