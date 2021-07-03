var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var categoryreportsSchema1 = new Schema({
	parent: Number,
	category: String,
	Name: String,
	tier1: String,
	tier2: String,
	tier3: String,
	tier4: String,
	genderCategory: String,
	AgeCategory: String,
	new_taxonamy: String,
	impression:Number,
	click:Number,
	feed:String
});
categoryreportsSchema1.index({ category: 1 });

categoryreportsSchema1.statics.load = function(id, cb) {
	this.findOne({
		_id: id
	}).exec(cb);
};

module.exports=mongoose.model('categoryreports2', categoryreportsSchema1);
