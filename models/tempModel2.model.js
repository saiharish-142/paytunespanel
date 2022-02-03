const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const tempModel2Schema = new mongoose.Schema({
	phoneModel: { type: String },
	campaignId: { type: String },
	impression: { type: Number },
	click: { type: Number },
	firstquartile: { type: Number },
	thirdquartile: { type: Number },
	midpoint: { type: Number },
	start: { type: Number },
	complete: { type: Number }
});
tempModel2Schema.index({ campaignId: 1, time: 1 });

mongoose.model('tempModel2', tempModel2Schema);
