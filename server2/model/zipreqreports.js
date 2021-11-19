var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var zipreqreportsSchema = new Schema({
    date: String,
    rtbType: String,
    pincode: String,
    ads: Number
});
zipreqreportsSchema.index({ date: 1, pincode:1});

zipreqreportsSchema.statics.load = function(id, cb) {
    this.findOne({
            _id: id
        })
        .exec(cb);
};
var zipreqreportObj = mongoose.model('zipreqreports', zipreqreportsSchema);
module.exports = zipreqreportsSchema;