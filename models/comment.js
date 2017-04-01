var mongoose = require('mongoose');
var UserSchema = require('../models/user');
var Schema = mongoose.Schema;
// User Schema
var CommentSchema = mongoose.Schema({
    text: String,
    dateCreated: Date,
    lastModified: Date,
    versions: [String],
    upvotes: Number,
    downvotes: Number,
    comments:[Schema.Types.ObjectId],
    user : Schema.Types.ObjectId
});


var Comment = module.exports = mongoose.model('Comment', CommentSchema);