var express = require('express');
var router = express.Router();

var Post = require('../models/post');

/* GET home page. */
router.get('/', function (req, res) {
    Post.getPostByNewest(function (err, posts) {
        if (err) throw err;
        res.render("index", {posts: posts, reg_user: req.session.user});
    });
});

module.exports = router;
