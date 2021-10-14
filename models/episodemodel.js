var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var podcastepisodesSchema = new Schema({
    publisherid: String,
    episodename: String,
    language:String,
    category: String,
    date: { type: String },
    requests: Number,
    displayname:String,
    hostPossibility:String,
    createdOn: { type: Date, default: Date.now },
});
podcastepisodesSchema.index({ publisherid: 1,episodename:1, date:1,category:1});

podcastepisodesSchema.statics.load = function(id, cb) {
    this.findOne({
            _id: id
        })
        .exec(cb);
};
var podcastepisodeObj = mongoose.model('podcastepisodes', podcastepisodesSchema);
module.exports = podcastepisodeObj;