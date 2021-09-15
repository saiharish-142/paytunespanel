var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var zipreportsSchema = new Schema({
	campaignId: { type: Schema.Types.ObjectId, ref: 'streamingadObj' },
	zip: Number,
	error: Number,
	impression: Number,
	clicks: Number,
	createdOn: String
});
zipreportsSchema.index({ zip: 1, campaignId: 1 });

zipreportsSchema.statics.load = function(id, cb) {
	this.findOne({
		_id: id
	}).exec(cb);
};
mongoose.model('zipsumreport', zipreportsSchema);
