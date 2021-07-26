var mongoose = require('mongoose');
var date = new Date();
var year = date.getFullYear();
var month = date.getMonth() + 1;
month = (month < 10 ? "0" : "") + month;
var day = date.getDate();
day = (day < 10 ? "0" : "") + day;
var datvar = year+month+day;
var collectionName = datvar + 'rtbrequests';

var Schema = mongoose.Schema;
var adRtbRequestsSchema = new Schema({
    bidid: { type: String },
    ssp: { type: String },
    type: { type: String },
    version:{ type: String },
    bidreq: { type: Object },
    imp: { type: Object },
    app: { type: Object },
    site: { type: Object },
    device: { type: Object },
    user: { type: Object },
    at: { type: String },
    tmax: { type: String },
    source: { type: Object },
    wseat:{type: Object},
    allimps:{type: Number},
    cur:{type: Object},
    bcat:{type: Object},
    badv:{type: Object},
    ext:{type: Object},
    bidstatus: { type: Boolean, default: false },
    bidresponse:{type: Object},
    createdOn: { type: Date, default: Date.now }
});


adRtbRequestsSchema.statics.load = function(id, cb) {
    this.findOne({
            _id: id
        })
        .exec(cb);
};


var rtbrequestObj = mongoose.model(collectionName, adRtbRequestsSchema);
module.exports = rtbrequestObj;