var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var podcastepisodesSchema = new Schema({
    publisherid: String,
    episodename: String,
    category: String,
    publishername:String,
    language:String,
    requests: Number,
    displayname:String,
    hostPossibility:String
});
podcastepisodesSchema.index({ publisherid: 1,episodename:1, date:1,category:1});

podcastepisodesSchema.statics.load = function(id, cb) {
    this.findOne({
            _id: id
        })
        .exec(cb);
};
var podcastepisodeObj = mongoose.model('podcastepisodes2', podcastepisodesSchema);
module.exports = podcastepisodeObj;