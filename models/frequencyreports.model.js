var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var frequencyreportsSchema = new Schema({
	campaignId: { type: Schema.Types.ObjectId, ref: 'streamingadObj' },
	frequency: Number,
	users: Number
});
frequencyreportsSchema.index({ campaignId: 1 });

frequencyreportsSchema.statics.load = function(id, cb) {
	this.findOne({
		_id: id
	}).exec(cb);
};

mongoose.model('frequencyreports', frequencyreportsSchema);
