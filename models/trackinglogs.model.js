const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema.Types

const trackinglogsSchema = new mongoose.Schema({
    id: String,
    appId: { type: String },
    campaignId: { type: String },
    type: { type: String },
    region: { type: String },
    ifa: { type: String },
    date: { type: String },
    rtbreqid:{ type: ObjectId},
    url: { type: String },
    zip:{type:String},
    rtbType:{type:String},
    phoneMake:{type:String},
    phoneModel:{type:String},
    platformType:{type:String},
    osVersion:{type:String},
    language:{type:String},
    pptype:{type:String},
    bundle:{type:String},
    bundlename:{type:String},
    createdOn: { type: Date, default: Date.now },
    citylanguage:{type:String}
})

mongoose.model('trackinglogs',trackinglogsSchema)