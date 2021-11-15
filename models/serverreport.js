var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var serverstatusreportsSchema = new Schema({
    servername: String,
    runningstatus: String,
    createdOn: { type: Date, default: Date.now },
});
var serverstatusreportObj = mongoose.model('serverstatusreports', serverstatusreportsSchema);
module.exports = serverstatusreportObj;