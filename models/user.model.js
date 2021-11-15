const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
	username: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	usertype: { type: String, required: true },
	email: { type: String, required: true },
	targetemail: [ { type: String } ],
	bundles: [ { type: String } ],
	campaigns: [ { type: String } ]
});

mongoose.model('admin', userSchema);
