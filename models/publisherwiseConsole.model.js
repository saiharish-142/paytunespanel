var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema.Types;

var publisheriseConsoleSchema = new Schema({
	apppubid: String,
	campaignId: { type: ObjectId, ref: 'streamingadObj' },
	publisherName: String,
	type: String,
	ssp: String,
	impression: Number,
	start: Number,
	firstQuartile: Number,
	midpoint: Number,
	thirdQuartile: Number,
	complete: Number,
	feed: Number,
	click: Number
});

publisheriseConsoleSchema.index({ apppubid: 1 });

publisheriseConsoleSchema.statics.load = function(id, cb) {
	this.findOne({
		_id: id
	}).exec(cb);
};

module.exports = mongoose.model('publisherwiseConsole', publisheriseConsoleSchema);
