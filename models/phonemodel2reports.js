var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var phonemodel2reportsSchema = new Schema({
    cost:Number,
    make_model:String, // ref prop
    cumulative:String,
    release:String,
    company:String,
    type:String,
    total_percent:String,
    model:String
    //createdOn: { type: Date, default: Date.now },
});
phonemodel2reportsSchema.index({ make_model: 1 });

phonemodel2reportsSchema.statics.load = function(id, cb) {
    this.findOne({
            _id: id
        })
        .exec(cb);
};

mongoose.model('phonemodel2reports', phonemodel2reportsSchema);
