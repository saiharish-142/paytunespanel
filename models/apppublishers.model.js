const mongoose = require('mongoose')

var apppublishersSchema = new mongoose.Schema({
    publisherid: String,
    publishername: String,
    publisherid: String,
    ssp: { type: String },
});

mongoose.model('apppublishers',apppublishersSchema)