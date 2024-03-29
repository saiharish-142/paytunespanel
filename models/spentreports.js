var mongoose = require('mongoose');
// var streamingadObj = require('./../streamingads/streamingads.js');
var Schema = mongoose.Schema;
var spentreportsSchema = new Schema({
	campaignId: { type: Schema.Types.ObjectId, ref: 'streamingads' },
	appId: String,
	date: { type: String },
	rtbType: String,
	totalSpent: Number,
	impression: Number,
	createdOn: { type: Date, default: Date.now }
});
spentreportsSchema.index({ campaignId: 1 });

spentreportsSchema.statics.load = function(id, cb) {
	this.findOne({
		_id: id
	}).exec(cb);
};
mongoose.model('spentreports', spentreportsSchema);
