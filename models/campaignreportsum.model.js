var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var campaignreportssumSchema = new Schema({
	campaignId: { type: Schema.Types.ObjectId, ref: 'streamingadObj' },
	rtbType: String,
	noofDays: Number,
	balanceDays: Number,
	targetImpression: Number,
	impression: Number,
	balanceimpression: Number,
	avgreq: Number,
	avgach: Number,
	startDate: String,
	endDate: String,
	createdOn: String
});
campaignreportssumSchema.index({ campaignId: 1, rtbType: 1 });

campaignreportssumSchema.statics.load = function(id, cb) {
	this.findOne({
		_id: id
	}).exec(cb);
};

mongoose.model('campaignreportsSum', campaignreportssumSchema);
