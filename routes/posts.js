var express = require('express');
var router = express.Router();

var Post = require('../models/post');
var User = require('../models/user');
var Comment=require('../models/comment');


router.post('/getComments',function(req,res){
    var commentID=req.body.commentId;
    var comments=[];
    Comment.getCommentByID(commentID,function (err,comment) {
        if(err) throw err;
        if(comment.comments!=null){

            for(var i=0;i<comment.comments.length;i++){
                Comment.getCommentByID(comment.comments[i],function (errNow,commentNow) {
                    if(errNow) throw errNow;
                    User.getUserById(commentNow.user,function (errUser,userUser) {
                        if(errUser) throw errUser;
                        commentNow.user=userUser;
                        comments.push(commentNow);
                        console.log(commentNow);
                        res.(commentNow);
                    });
                });
            }
            console.log(comments);

        }
    });
});


router.post('/getPost',function (req, res) {
    var postID =req.body.getPost;
    console.log("getting post "+postID);
    Post.getPostbyId(postID, function (err, post) {
        if (err) throw err;
        User.getUserById(post.user, function (err, user){
            if (err) throw err;
            var comments=new Array();
            if(post.comments!=null){
                console.log(post.comments.length);
                for(var i=0;i<post.comments.length;i++){
                    //console.log(post.comments[i]);
                    Comment.getCommentByID(post.comments[i],function (commentErr,commentNow) {
                         if (commentErr) throw  commentErr;
                        // console.log(commentNow);
                         User.getUserById(commentNow.user,function(userErr,userNow){
                                if(userErr) throw userErr;
                                commentNow.user=userNow;
                                comments.push(commentNow);
                                console.log(comments);
                         });
                    });
                }
            }
            res.render('homePost', {post: post,layout: 'postLayout.hbs',user:user,comments:comments});
        });
    });
});

//addCommentOfComment
router.post('/addCommentOfComment',function (req, res) {
    var commentId=req.body.commentId;
    var text=req.body.comment;
    var dateCreated=Date.now;
    var lastModified=Date.now;
    var upvotes=0;
    var user=req.session.user;
    var downvotes=0;
    var version=null;
    var comments=null;

    var newComment=new Comment({
        text: text, dateCreated : dateCreated() , lastModified : lastModified() ,
        upvotes : upvotes, downvotes : downvotes, user:user
    });

    Comment.createComment(newComment, function (err, post) {
        if (err) throw err;
    });

    Comment.getCommentByID(commentId,function (err1,comment) {
        if(err1) throw err1;
        if(comment.comments==null){
            comment.comments=new Array();
        }
        comment.comments.push(newComment);
        Comment.createComment(comment,function (err,comment) {
             if(err) throw err;
        });
    });

    User.getUserById(user,function (err,userObj) {
        if(err) throw err;
        newComment.user=userObj;
        console.log(newComment);
        res.send(newComment);
    });
});

router.post('/postsComment',function (req, res) {
    var postId=req.body.getPost;
    var text=req.body.comment;
    console.log(postId);
    console.log(text);

    var dateCreated=Date.now;
    var lastModified=Date.now;
    var upvotes=0;
    var user=req.session.user;
    var downvotes=0;
    var version=null;
    var comments=null;

    var newComment=new Comment({
        text: text, dateCreated : dateCreated() , lastModified : lastModified() ,
        upvotes : upvotes, downvotes : downvotes, user:user
    });

    Comment.createComment(newComment, function (err, post) {
        if (err) throw err;
    });

    Post.getPostbyId(postId,function (err1, post) {
        if (err1) throw err1;
        if(post.comments==null){
            post.comments=new Array();
        }
        post.comments.push(newComment);
        Post.createPost(post,function (err,post) {
            if (err) throw err;;
        });
    });

    User.getUserById(user,function (err,userObj) {
        if(err) throw err;
        newComment.user=userObj;
        console.log(newComment);
        res.send(newComment);
    });
});

/*        console.log(newComment);
 text: String,
 dateCreated: Date,
 lastModified: Date,
 versions: [String],
 upvotes: Number,
 downvotes: Number,
 comments:{type:[Schema.Types.ObjectId],ref: 'Comment'},
 user : {type:Schema.Types.ObjectId,ref: 'User'}
 */

// Register
router.post('/addPost', function (req, res) {
    var title = req.body.title;
    var description = req.body.description;
    var tags = req.body.tags.split(" ");
    var dateCreated=Date.now;
    var lastModified=Date.now;
    var upvotes=0;
    var user=req.session.user;
    var downvotes=0;
    var status= true;
    var newPost=new Post({
        title: title, description : description ,
        tags : tags, dateCreated : dateCreated() , lastModified : lastModified() ,
        upvotes : upvotes, downvotes : downvotes, status : status, user:user,comments: null,preview:0
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