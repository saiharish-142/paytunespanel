const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const tempModelSchema = new mongoose.Schema({
	time: { type: String },
	campaignId: { type: String },
	impression: { type: Number },
	click: { type: Number },
	firstquartile: { type: Number },
	thirdquartile: { type: Number },
	midpoint: { type: Number },
	start: { type: Number },
	complete: { type: Number }
});
tempModelSchema.index({ campaignId: 1, time: 1 });

mongoose.model('tempModel', tempModelSchema);
