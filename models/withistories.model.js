const mongoose = require('mongoose');

const withistoriesSchema = new mongoose.Schema({
	campaignId:  { type: String } ,
	appId:  { type: String } ,
	date:  { type: String } ,
	auction_price:  { type: String } ,
	rtbType:  { type: String } ,
	url:  { type: String } 
});

mongoose.model('withistories', withistoriesSchema);
