const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types

const reportSchema = new mongoose.Schema({
    date:{type:String},
    Publisher:{type:ObjectId,ref:'publisherapps'},
    campaignId:{type:String},
    mediatype:{type:String},
    dealID:{type:String},
    impressions:{type:Number},
    spend:{type:String},
    avgSpend:{type:String},
    region:[{type:String}],
    complete:{type:Number},
    clicks:{type:Number}
})

mongoose.model('Report',reportSchema)