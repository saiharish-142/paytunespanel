var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var regionreportsSchema = new Schema({
	campaignId: { type: Schema.Types.ObjectId, ref: 'streamingads' },
	appId: String,
	region: String,
	requests: Number,
	ads: Number, ///AdServed
	servedAudioImpressions: Number,
	servedCompanionAds: Number,
	completedAudioImpressions: Number,
	error: Number,
	impression: Number,
	start: Number,
	midpoint: Number,
	thirdQuartile: Number,
	complete: Number,
	progress: Number,
	creativeView: Number,
	CompanioncreativeView: Number,
	CompanionClickTracking: Number,
	SovcreativeView: Number,
	SovClickTracking: Number,
	createdOn: { type: Date, default: Date.now }
});
regionreportsSchema.index({ region: 1 });

regionreportsSchema.statics.load = function(id, cb) {
	this.findOne({
		_id: id
	}).exec(cb);
};
var regionreportObj = mongoose.model('regionreports', regionreportsSchema);
module.exports = regionreportObj;
