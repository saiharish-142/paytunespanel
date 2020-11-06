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
    createdOn: { type: Date, default: Date.now }
})

mongoose.model('trackinglogs',trackinglogsSchema)