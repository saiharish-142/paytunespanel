var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var freqpublishreportsSchema = new Schema({
	campaignId: { type: Schema.Types.ObjectId, ref: 'streamingadObj' },
	appId: String,
	users: Number,
	impression: Number,
	click: Number,
	createdOn: { type: Date, default: Date.now }
});
freqpublishreportsSchema.index({ campaignId: 1, appId: 1 }, { unique: true });

freqpublishreportsSchema.statics.load = function(id, cb) {
	this.findOne({
		_id: id
	}).exec(cb);
};

mongoose.model('freqpublishreports', freqpublishreportsSchema);
