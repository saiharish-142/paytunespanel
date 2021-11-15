var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var podcastepisodesSchema = new Schema({
    publisher: String,
    episodename: String,
    category: String,
    publishername:String,
    language:String,
    requests: Number,
    displayname:String,
    hostPossibility:String,
    tier1:String,
    tier2:String,
    tier3:String,
    new_taxonamy:String,
    createdOn: { type: Date, default: Date.now },
},{collection:'podcastepisodes2_copy'});
podcastepisodesSchema.index({ publisherid: 1,episodename:1, date:1,category:1});

podcastepisodesSchema.statics.load = function(id, cb) {
    this.findOne({
            _id: id
        })
        .exec(cb);
};
var podcastepisodeObj = mongoose.model('podcastepisodes2_copy', podcastepisodesSchema);
module.exports = podcastepisodeObj;