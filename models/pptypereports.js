var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var pptypereportsSchema = new Schema({
	campaignId: { type: Schema.Types.ObjectId, ref: 'streamingads' },
	appId: String,
	pptype: String,
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
pptypereportsSchema.index({ pptype: 1 });

pptypereportsSchema.statics.load = function(id, cb) {
	this.findOne({
		_id: id
	}).exec(cb);
};
var pptypereportObj = mongoose.model('pptypereports', pptypereportsSchema);
module.exports = pptypereportObj;
