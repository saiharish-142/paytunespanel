var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var reqreportsSchema = new Schema({
    date: String,
    rtbType: String,  //display/video/audio 
    ssp: String, //rubicon/triton
    category:String,  // remove
    requests: Number
});
reqreportsSchema.index({ date: 1 });

reqreportsSchema.statics.load = function(id, cb) {
    this.findOne({
            _id: id
        })
        .exec(cb);
};

mongoose.model('reqreport', reqreportsSchema);
