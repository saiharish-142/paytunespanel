const mongoose = require('mongoose');
// const ObjectId = mongoose.Schema.Types

const streamingadsSchema = new mongoose.Schema({
    AdTitle:{type:String,required:true},
    adType:{type:String},
    offset:{type:String},
    Category:{type:String},
    Description:{type:String},
    Advertiser:{type:String,required:true},
    AudioPricing:{type:String},
    BannerPricing:{type:String},
    Pricing:{type:String},
    PricingModel:{type:String},
    Expires:{type:String},
    minAge:{type:Number},
    maxAge:{type:Number},
    Gender:[{type:String}],
    Billing:{type:String},
    enable:{type:Boolean},
    Genre:[{type:String}],
    platformType:[{type:String}],
    language:[{type:String}],
    ConnectionType:[{type:String}],
    phoneValue:{type:Boolean},
    phoneType:[{type:String}],
    ARPU:{type:Boolean},
    City:[{type:String}],
    State:[{type:String}],
    Age:{type:Boolean},
    Companion:[{
        Title:{type:String},
        Url:{type:String},
        StaticResource:{type:String},
        StaticResourceType:{type:String},
        AltText:{type:String},
        required:{type:String},
        imageFiles:[{
            Height:{type:String},
            Width:{type:String},
            AssetWidth:{type:String},
            AssetHeight:{type:String},
            AdSlotID:{type:String},
            Name:{type:String},
            S3path:{type:String}
            // Id:{type:ObjectId}
        }],
        ClickThroughUrl:{type:String}
    }],
    Linear:[{
        Title:{type:String},
        MediaFiles:[{
            Bitrate:{type:String},
            Codec:{type:String},
            Delivery:{type:String},
            Name:{type:String},
            S3path:{type:String},
            SampleRate:{type:String},
            type:{type:String},
            Tracks:{type:String}
            // Id:{type:ObjectId}
        }]
    }],
    endDate:{type:Date},
    startDate:{type:Date},
    Duration:{type:String},
    maxARPU:{type:Number},
    minARPU:{type:Number},
    TargetImpressions:{type:String},
    createdOn:{type:Date}
})

mongoose.model("streamingads" ,streamingadsSchema)