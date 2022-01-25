const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const tempModel1Schema = new mongoose.Schema({
	zip: { type: String },
	campaignId: { type: String },
	impression: { type: Number },
	click: { type: Number },
	firstquartile: { type: Number },
	thirdquartile: { type: Number },
	midpoint: { type: Number },
	start: { type: Number },
	complete: { type: Number }
});
tempModel1Schema.index({ campaignId: 1, time: 1 });

mongoose.model('tempModel1', tempModel1Schema);
