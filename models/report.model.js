const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types

const subSchemaregion = new mongoose.Schema({
    region:{type:String},result:[]
},{ _id : false })

const subSchemaplatformtype = new mongoose.Schema({
    platformType:{type:String},result:[]
},{ _id : false })

const subSchemapincode = new mongoose.Schema({
    zip:{type:String},result:[]
},{ _id : false })

const subSchemaosVersion = new mongoose.Schema({
    osVersion:{type:String},result:[]
},{ _id : false })

const subSchemalanguage = new mongoose.Schema({
    language:{type:String},result:[]
},{ _id : false })

const subSchemaphoneModel = new mongoose.Schema({
    phoneModel:{type:String},result:[]
},{ _id : false })

const reportSchema = new mongoose.Schema({
    date:{type:String},
    Publisher:{type:ObjectId,ref:'publisherapps'},
    campaignId:{type:String},
    mediatype:{type:String},
    dealID:{type:String},
    impressions:{type:Number},
    spend:{type:String},
    avgSpend:{type:String},
    region:[subSchemaregion],
    platformtype:[subSchemaplatformtype],
    pincode:[subSchemapincode],
    osVersion:[subSchemaosVersion],
    language:[subSchemalanguage],
    phoneModel:[subSchemaphoneModel],
    complete:{type:Number},
    clicks:{type:Number}
},{timestamps:true})

mongoose.model('Report',reportSchema)