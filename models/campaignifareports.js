var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var campaignifareportsSchema = new Schema({
	campaignId: { type: Schema.Types.ObjectId, ref: 'streamingads' },
	ccampaignId: String,
	appId: String,
	ifa: String,
	zip: String,
	apppubid: String,
	rtbType: String,
	impression: Number,
	click: Number,
	createdOn: { type: Date, default: Date.now }
});
campaignifareportsSchema.index({ ifa: 1 });

campaignifareportsSchema.statics.load = function(id, cb) {
	this.findOne({
		_id: id
	}).exec(cb);
};

mongoose.model('campaignifareports', campaignifareportsSchema);
