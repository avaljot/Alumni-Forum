var express = require('express');
var router = express.Router();

var Post = require('../models/post');

// Register
router.post('/addPost', function (req, res) {
    var title = req.body.title;
    var description = req.body.description;
    var tags = req.body.tags.split(" ");
    var dateCreated=Date.now;
    var lastModified=Date.now;
    var upvotes=0;
    var user=req.session.user._id;
    var downvotes=0;
    var status= true;
    var newPost=new Post({
        title: title, description : description ,
        tags : tags, dateCreated : dateCreated() , lastModified : lastModified() ,
        upvotes : upvotes, downvotes : downvotes, status : status, user:user,comments: null
    });
    Post.createPost(newPost, function (err, post) {
        if (err) throw err;
        console.log(post);
    });
    req.flash('success_msg', 'Discussion Created');
    res.redirect('/');
});

router.get('/viewPosts', function (req, res) {

    Post.getPostByNewest(function (err, posts) {
        if (err) throw err;
        res.render("index",{posts: posts,reg_user:req.session.user});
    });
});


module.exports = router;


/*
 tile: String,
 description: String,
 tags: [String],
 dateCreated: Date,
 lastModified: Date,
 versions: [String],
 upvotes: Number,
 downvotes: Number,
 comments:[
 {type:Schema.Types.ObjectId,
 ref: 'Comment'}
 ],
 user : {type:Schema.Types.ObjectId,
 ref: 'User'},
 status: Boolean
 });
 */