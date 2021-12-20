const mongoose = require('mongoose');

var apppublishersSchema = new mongoose.Schema({
	publisherid: String,
	publishername: {
		type:String,
		default:""
	},
	bundletitle: String,
	ssp: { type: String }
});

module.exports=mongoose.model('apppublishers', apppublishersSchema);
// module.exports=apppublishersSchema
