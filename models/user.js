var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var Schema = mongoose.Schema;

// User Schema
var UserSchema = mongoose.Schema({
    firstname: String,
    lastname: String,
    username: String,
    email: String,
    workStatus: String,
    password: String,
    company: String,
    university: String,
    filename: String,
    status: Boolean
});

var User = module.exports = mongoose.model('User', UserSchema);

module.exports.createUser = function (newUser, callback) {
    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(newUser.password, salt, function (err, hash) {
            newUser.password = hash;
            newUser.save(callback);
        });
    });
};

module.exports.getUserByUsername = function (username, callback) {
    var query = {username: username};
    User.findOne(query, callback);
};

module.exports.getUserById = function (id, callback) {
    User.findById(id, callback);
};

module.exports.comparePassword = function (candidatePassword, hash, callback) {
    bcrypt.compare(candidatePassword, hash, function (err, isMatch) {
        if (err) throw err;
        callback(null, isMatch);
    });
};

module.exports.getAllUsers = function (callback) {
    User.find({}).exec(callback);
};
module.exports.updateImage = function (filename, username, callback) {
    var query = {'username': username};
    User.findOneAndUpdate(query, {$set: {filename: filename}}, callback)

};