const mongoose = require('mongoose')

var apppublishersSchema = new mongoose.Schema({
    publisherid: String,
    publishername: String,
    ssp: { type: String },
});

mongoose.model('apppublishers',apppublishersSchema)
module.exports=apppublishersSchema