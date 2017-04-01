var mongoose = require('mongoose');
var CommentSchema = require('../models/comment');
var UserSchema = require('../models/user');
var Schema = mongoose.Schema;


var PostSchema = mongoose.Schema({
    tile: String,
    description: String,
    tags: [String],
    dateCreated: Date,
    lastModified: Date,
    versions: [String],
    upvotes: Number,
    downvotes: Number,
    comments:[Schema.Types.ObjectId],
    user : Schema.Types.ObjectId,
    status: Boolean
});

var Post = module.exports = mongoose.model('Post', PostSchema);


module.exports.createPost = function (newPost,callback) {
      newPost.save(callback);
};

module.exports.getPostbyId = function (id,callback) {
    Post.findById(id,callback);
};

module.exports.getPostByNewest = function (callback) {
    var query = {status: true};
    Post.find(query).sort({lastModified : 'descending'}).exec(callback);
};

module.exports.getPostByNoComment = function (callback) {
    var query = {status: true,comments:null};
    Post.find(query).sort({lastModified : 'descending'}).exec(callback);
};

module.exports.getPostByTags = function (tag,callback) {
    var query = {status: true,tags : tag };
    Post.find(query).sort({lastModified : 'descending'}).exec(callback);
};

module.exports.deletePost = function (id, callback) {
    var query = {status: false};
    Post.findOneAndUpdate(id,query,callback);
};
