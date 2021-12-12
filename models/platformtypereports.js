var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var platformtypereportsSchema = new Schema({
	campaignId: { type: Schema.Types.ObjectId, ref: 'streamingads' },
	appId: String,
	platformType: String,
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
platformtypereportsSchema.index({ platformType: 1 });

platformtypereportsSchema.statics.load = function(id, cb) {
	this.findOne({
		_id: id
	}).exec(cb);
};
var platformtypereportObj = mongoose.model('platformtypereports', platformtypereportsSchema);
module.exports = platformtypereportObj;
