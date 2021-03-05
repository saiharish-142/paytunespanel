const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema.Types

const bindstreamingadsSchema = new mongoose.Schema({
    Category:{type:String},
    Advertiser:{type:String},
    bundleadtitle:{type:String,unique:true,required:true},
    ids:[{type:ObjectId,ref:"streamingads"}],
    Pricing:{type:String},
    PricingModel:{type:String},
    endDate:{type:Date},
    startDate:{type:Date},
    createdOn:{type: Date, default: Date.now}
})

mongoose.model("bindstreamingads" ,bindstreamingadsSchema)