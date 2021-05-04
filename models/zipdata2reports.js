var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var zipreports2Schema = new Schema({
    area:String, //urban/rural
    pincode: Number,
    lowersubcity:String,
    subcity:String,
    city:String,
    grandcity:String,
    district:String,
    comparison:Number,
    state:String,
    grandstate:String,
    latitude:String,
    longitude:String
});
zipreports2Schema.index({ zip: 1 });

zipreports2Schema.statics.load = function(id, cb) {
    this.findOne({
            _id: id
        })
        .exec(cb);
};
var zipreportObj2 = mongoose.model('zipreports2', zipreports2Schema);
module.exports = zipreportObj2;