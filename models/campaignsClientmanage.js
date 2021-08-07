const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const ClientCampaignsetSchema = new mongoose.Schema({
	userid: { type: ObjectId, ref: 'admin', required: true },
	campaignName: { type: String },
	audio: { type: String },
	display: { type: String },
	video: { type: String },
	musicapps: { type: String },
	podcast: { type: String },
	onDemand: { type: String }
});

mongoose.model('campaignClient', ClientCampaignsetSchema);
