var express = require('express');
var router = express.Router();

var Post = require('../models/post');

/* GET home page. */
router.get('/', function (req, res) {
    var query = {status: true};
    Post.getPostWithTags(query,function (err, posts) {
        if (err) throw err;
        console.log(posts);
        res.render("index", {posts: posts, reg_user: req.session.user});
    });
});

module.exports = router;
