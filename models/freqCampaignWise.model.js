const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const FrequecyCampwiseDate = new mongoose.Schema({
	campaignId: { type: ObjectId, ref: 'streamingads' },
	rtbType: String,
	users: Number,
	createdOn: String
});
FrequecyCampwiseDate.index({ campaignId: 1, rtbType: 1 }, { unique: true });

FrequecyCampwiseDate.statics.load = function(id, cb) {
	this.findOne({
		_id: id
	}).exec(cb);
};

mongoose.model('freqCampWise', FrequecyCampwiseDate);
