var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var demographyreportsSchema = new Schema({
    ifa: String,
    ip: String,
    zip: String,
    model: String,
    os: String,
    devicetype: String,
    publisherId: String,
    publisherName: String,
    gender: String,
    yob: String,
    uid:String,
    uniqueDeviceId:String
});
demographyreportsSchema.index({ ifa: 1, ip:1});

demographyreportsSchema.statics.load = function(id, cb) {
    this.findOne({
            _id: id
        })
        .exec(cb);
};
var demographyreportObj = mongoose.model('demographyreports', demographyreportsSchema);
module.exports = demographyreportsSchema;
