const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema.Types

const trackinglogsSchema = new mongoose.Schema({
    appId:{type:ObjectId,required:true},
    id:{type:ObjectId},
    campaignId:{type:ObjectId,required:true},
    type:{type:String,required:true},
    rtbreqid:{type:ObjectId},
    date:{type:String,required:true},
    createdOn:{type:Date,required:true},
    region:{type:String},
    ifa:{type:String}
})

mongoose.model('trackinglogs',trackinglogsSchema)