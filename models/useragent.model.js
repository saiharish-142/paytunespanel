var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var useragentSchema = new Schema({
	ua: { type: String, required: true },
	display: String
});
useragentSchema.index({ ua: 1 });

useragentSchema.statics.load = function(id, cb) {
	this.findOne({
		_id: id
	}).exec(cb);
};

mongoose.model('useragentdata', useragentSchema);
