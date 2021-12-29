var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var overallFreqSchema = new Schema({
	rtbType: String,
	users: Number,
	createdOn: String
});
overallFreqSchema.index({ rtbTpe: 1 });

overallFreqSchema.statics.load = function(id, cb) {
	this.findOne({
		_id: id
	}).exec(cb);
};

mongoose.model('overallfreqreport', overallFreqSchema);
