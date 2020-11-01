const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types

const wrapperSchema = new mongoose.Schema({
    bidid:{type:String},
    Type:{type:String},
    rtbreqId:{type:ObjectId},
    appId:{type:ObjectId,required:true},
    campaignId:{type:ObjectId,required:true},
    userid:{type:String,required:true},
    dpidmd:{type:String},
    dpidsha:{type:String},
    ifa:{type:String},
    city:{type:String},
    region:{type:String},
    price:{type:Number},
    impressions:{type:Boolean},
    burl:{type:Boolean},
    click:{type:Boolean},
    error:{type:Boolean},
    frequencycheck:{type:Boolean}
},{timestamps:true})

mongoose.model('Wrapper',wrapperSchema)