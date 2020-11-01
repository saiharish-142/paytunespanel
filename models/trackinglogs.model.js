const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema.Types

const trackinglogsSchema = new mongoose.Schema({
    Type:{type:String,required:true},
    id:{type:ObjectId},
    appId:{type:ObjectId,required:true},
    campaignId:{type:ObjectId,required:true},
    rtbreqid:{type:ObjectId},
    date:{type:Date,required:true},
    region:{type:String},
    ifa:{type:String}
},{timestamps:true})

mongoose.model('trackinglogs',trackinglogsSchema)