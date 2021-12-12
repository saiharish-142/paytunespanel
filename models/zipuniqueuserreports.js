var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var zipuniqueuserreportsSchema = new Schema({
	campaignId: { type: Schema.Types.ObjectId, ref: 'streamingads' },
	zip: { type: String },
	uniqueusers: Number,
	createdOn: { type: Date, default: Date.now }
});
zipuniqueuserreportsSchema.index({ zip: 1 });

zipuniqueuserreportsSchema.statics.load = function(id, cb) {
	this.findOne({
		_id: id
	}).exec(cb);
};
var zipuniqueuserreportObj = mongoose.model('zipuniqueuserreports', zipuniqueuserreportsSchema);
module.exports = zipuniqueuserreportObj;
