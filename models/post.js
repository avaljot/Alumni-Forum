var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var PostSchema = mongoose.Schema({
    title: String,
    description: String,
    tags: [String],
    dateCreated: Date,
    lastModified: Date,
    versions: [String],
    upvotes: {type:[Schema.ObjectId],ref: 'User'},
    downvotes: {type:[Schema.ObjectId],ref: 'User'},
    comments:{type:[Schema.ObjectId],ref: 'Comment'},
    user : {type:Schema.ObjectId, ref:'User'},
    status: Boolean,
    preview : Number
});

var Post = module.exports = mongoose.model('Post', PostSchema);


module.exports.createPost = function (newPost,callback) {
      newPost.save(callback);
};


module.exports.updatePost = function (newPost,callback) {
    Post.findOneAndUpdate({'_id':newPost._id},{$set:{'upvotes':newPost.upvotes,'downvotes':newPost.downvotes}},callback);
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
