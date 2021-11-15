const mongoose = require('mongoose');

const uniqueSchema = new mongoose.Schema({
    audiouser:{type:Number},
    displayuser:{type:Number},
    AdTitle:{type:String,unique:true},
})

mongoose.model('unique',uniqueSchema)