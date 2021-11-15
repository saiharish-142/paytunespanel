var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// const { ObjectId } = mongoose.Schema.Types;

var frequencyConsoleSchema = new Schema({
	frequency: { type: Number, unique: true },
	users: Number,
	impression: Number,
	appId: String,
	click: Number
});

frequencyConsoleSchema.index({ campaignId: 1 });

frequencyConsoleSchema.statics.load = function(id, cb) {
	this.findOne({
		_id: id
	}).exec(cb);
};

module.exports = mongoose.model('frequencyConsole', frequencyConsoleSchema);
