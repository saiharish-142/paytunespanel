const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types

const reportSchema = new mongoose.Schema({
    Date:{type:Date},
    Publisher:{type:ObjectId},
    mediatype:{type:String},
    dealID:{type:String},
    impressions:{type:Number},
    Spend:{type:String},
    avgspend:{type:String}
},{timestamps:true})

mongoose.model('Report',reportSchema)