const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types

const reportSchema = new mongoose.Schema({
    date:{type:Date},
    Publisher:{type:ObjectId,ref:'publisherapps'},
    campaignId:{type:ObjectId},
    mediatype:{type:String},
    dealID:{type:String},
    impressions:{type:Number},
    Spend:{type:String},
    avgSpend:{type:String},
    region:[{type:String}],
    complete:{type:Number},
    clicks:{type:Number}
})

mongoose.model('Report',reportSchema)