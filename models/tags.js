var mongoose = require('mongoose');
var TagsSchema = require('../models/tags');
var Schema = mongoose.Schema;
// User Schema

var TagsSchema = mongoose.Schema({
    text: String,
    posts: [{type: Schema.ObjectId, ref: 'Post'}],
    comments: {type: [Schema.ObjectId], ref: 'Comment'},
    preview : Number
});

var Tags = module.exports = mongoose.model('Tags', TagsSchema);

module.exports.createTags = function (tag,callback) {
    tag.save(callback);
};

module.exports.getTagByText = function (text,callback) {
    var query = {text: text};
    Tags.find(query).exec(callback);
};

module.exports.updateTags = function (newTags,callback) {
    Tags.findOneAndUpdate({'_id':newTags._id},{$set:{'posts':newTags.posts}},callback);
};
