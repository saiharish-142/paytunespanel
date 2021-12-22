var mongoose = require('mongoose');

var freqpubOnreportsSchema = new mongoose.Schema({
	appId: String,
	rtbType: String,
	users: Number,
	createdOn: String
});
freqpubOnreportsSchema.index({ appId: 1, rtbType: 1 }, { unique: true });

freqpubOnreportsSchema.statics.load = function(id, cb) {
	this.findOne({
		_id: id
	}).exec(cb);
};

mongoose.model('freqpubOnreports', freqpubOnreportsSchema);
