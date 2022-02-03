const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const tempModel1Schema = new mongoose.Schema({
	zip: { type: String },
	startDate: { type: String },
	impression: { type: Number },
	click: { type: Number },
	complete: { type: Number }
});
tempModel1Schema.index({ zip: 1 });

mongoose.model('tempModel1', tempModel1Schema);
