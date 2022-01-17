const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const tempModelSchema = new mongoose.Schema({
	time: { type: String },
	campaignId: { type: String },
	impression: { type: Number },
	click: { type: Number },
	complete: { type: Number }
});

mongoose.model('tempModel', tempModelSchema);
