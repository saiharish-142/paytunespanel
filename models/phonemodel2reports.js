var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var phonemodel2reportsSchema = new Schema({
    cost:Number,
    make_model:String, 
    cumulative:String,
    release:String,
    company:String,
    type:String,
    total_percent:String,
    model:String,
    combined_make_model:String,
    impression:Number,
    click:Number
});
phonemodel2reportsSchema.index({ make_model: 1 });

phonemodel2reportsSchema.statics.load = function(id, cb) {
    this.findOne({
            _id: id
        })
        .exec(cb);
};

module.exports=mongoose.model('phonemodel2reports', phonemodel2reportsSchema);
