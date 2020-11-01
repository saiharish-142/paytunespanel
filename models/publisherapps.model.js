const mongoose = require('mongoose');
// const ObjectId = mongoose.SchemaType

const publisherappsSchema = new mongoose.Schema({
    AppName:{type:String,required:true},
    PublisherId:{type:String,required:true},
    AppId:{type:String,required:true},
})

mongoose.model('publisherapps',publisherappsSchema)