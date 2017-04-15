var express = require('express');
var router = express.Router();

var Post = require('../models/post');
var User = require('../models/user');
var Comment = require('../models/comment');
var Tags = require('../models/tags');
var async = require("async");
var waterfall = require('async-waterfall');


router.post('/getComments', function (req, res) {
    var commentID = req.body.commentId;
    var comments=new Object();
    var currUser=req.session.user;
    comments.user=false;
    comments.comments=new Array();
    if(currUser!=null)
        comments.user=currUser;
    var count=0;
    console.log("1");
    Comment.getCommentByID(commentID,function (err,comment) {
        if(err) throw err;
        if(comment.comments!=null) {
            if(comment.comments.length==0){
                comments.comments="done";
                res.send(comments,200);
            }
            for (var i = 0; i < comment.comments.length; i++) {
                Comment.getCommentByID(comment.comments[i], function (newErr, commentNow) {
                    if (newErr) throw newErr;
                    if (commentNow != null) {
                        User.getUserById(commentNow.user,function(userErr,userNow){
                            if(userErr) throw userErr;
                            count++;
                            commentNow.user=userNow;
                            comments.comments.push(commentNow);
                            if(count==comment.comments.length){
                                console.log("sending ");
                                res.send(comments);
                            }
                        });
                    }
                });
            }
        }else{
            res.send("done",200);
        }
    });
});

router.post('/getPost', function (req, res) {
    var postID = req.body.getPost;
    var isfav = null;
    console.log("getting post " + postID);
    Post.getPostbyId(postID, function (err, post) {
        if (err) throw err;
        User.getUserById(post.user, function (err, user) {
            if (err) throw err;
            if (user.favs.indexOf(postID.toString()) > 0) {
                isfav = true;
            }
            else
                isfav = false;
            var comments = new Array();
            if (post.comments != null) {
                console.log(post.comments.length);
                for (var i = 0; i < post.comments.length; i++) {
                    //console.log(post.comments[i]);
                    Comment.getCommentByID(post.comments[i], function (commentErr, commentNow) {
                        if (commentErr) throw  commentErr;
                        // console.log(commentNow);
                        User.getUserById(commentNow.user, function (userErr, userNow) {
                            if (userErr) throw userErr;
                            commentNow.user = userNow;
                            comments.push(commentNow);
                            //console.log(comments);
                        });
                    });
                }
            }
            console.log(req.session.user);
            post.preview = post.preview + 1;
            Post.updatePost(post,function (newErr,newPost) {
                if(newErr) throw newErr;
                newPost.tags.forEach(function(ele1,ind1,arr1) {
                    Tags.getTagbyId(ele1,function (err2,tag2) {
                        tag2.preview+=1;
                        Tags.updateTags(tag2,function (err3,tag3) {
                            if(err3) throw err3;
                            //console.log(tag3);
                        });
                    });
                });
            });
            res.render('homePost', {
                post: post,
                layout: 'postLayout.hbs',
                user: user,
                comments: comments,
                reg_user: req.session.user,
                isfav: isfav
            });
        });
    });
});

//addCommentOfComment
router.post('/addCommentOfComment', function (req, res) {
    var commentId = req.body.commentId;
    var text = req.body.comment;
    var dateCreated = Date.now;
    var lastModified = Date.now;
    var upvotes = null;
    var user = req.session.user;
    var downvotes = null;
    var version = null;
    var comments = null;

    var newComment = new Comment({
        text: text, dateCreated: dateCreated(), lastModified: lastModified(),
        upvotes: upvotes, downvotes: downvotes, user: user
    });

    if (user.comments == null)
        user.comments = new Array();

    user.comments.push(newComment);

    Comment.createComment(newComment, function (err, post) {
        if (err) throw err;
    });

    Comment.getCommentByID(commentId, function (err1, comment) {
        if (err1) throw err1;
        if (comment.comments == null) {
            comment.comments = new Array();
        }
        comment.comments.push(newComment);
        Comment.createComment(comment, function (err, comment) {
            if (err) throw err;
        });
    });

    User.getUserById(user, function (err, userObj) {
        if (err) throw err;
        newComment.user = userObj;
        console.log(newComment);
        res.send(newComment);
    });
});

router.post('/postsComment', function (req, res) {
    var postId = req.body.getPost;
    var text = req.body.comment;
    console.log(postId);
    console.log(text);

    var dateCreated = Date.now;
    var lastModified = Date.now;
    var upvotes = null;
    var user = req.session.user;
    var downvotes = null;
    var version = null;
    var comments = null;

    var newComment = new Comment({
        text: text, dateCreated: dateCreated(), lastModified: lastModified(),
        upvotes: upvotes, downvotes: downvotes, user: user
    });

    if (user.comments == null)
        user.comments = new Array();

    user.comments.push(newComment);
    Comment.createComment(newComment, function (err, post) {
        if (err) throw err;
    });

    Post.getPostbyId(postId, function (err1, post) {
        if (err1) throw err1;
        if (post.comments == null) {
            post.comments = new Array();
        }
        post.comments.push(newComment);
        Post.createPost(post, function (err, post) {
            if (err) throw err;
        });
    });

    User.getUserById(user, function (err, userObj) {
        if (err) throw err;
        newComment.user = userObj;
        //console.log(newComment);
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
    var tagsArray = new Array();
    if(tags.length==0){
        createPost(title,description,tagsArray,req, res);
    }
    var count=0;
    console.log(tags);
    console.log(tags.length);
    tags.forEach(function(element,index,array){
        Tags.getTagByText(element,function (errNow,tagNow) {
            console.log("tag now "+element);
            console.log(array.length+" "+index);
            if(errNow) throw errNow;
            if(tagNow==null || tagNow==''){
                console.log('inside');
                var newTag=new Tags({
                    text : element, posts : [] , comments : [] , preview : 0
                });
                Tags.createTags(newTag,function (newErr,newTag) {
                    if(newErr) throw newErr;
                    tagsArray.push(newTag);
                    //console.log(newTag);
                    count++;
                    console.log("count "+count+" tagsArrayLength "+tagsArray.length);
                    if(count==tags.length)
                        createPost(title,description,tagsArray,req, res);
                });
            }else{
                tagsArray.push(tagNow[0]);
                count++;
                console.log("count old "+count+" tagsArrayLength "+tagsArray.length);
                if(count==tags.length)
                    createPost(title,description,tagsArray,req, res);
            }
        });
    });
});

function createPost(title,description,tagsArray,req,res){
    var dateCreated = Date.now;
    var lastModified = Date.now;
    var upvotes = null;
    var user = req.session.user;
    var downvotes = null;
    var status = true;

    var newPost = new Post({
        title: title, description: description,
        tags: new Array(), dateCreated: dateCreated(), lastModified: lastModified(),
        upvotes: upvotes, downvotes: downvotes, status: status, user: user, comments: null, preview: 0
    });

    if(tagsArray.length==0){
        createPostOther(title,description,tagsArray,req,res,newPost,user);
    }

    var count=0;
    tagsArray.forEach(function(element,index,array){
        console.log(array[index]);
        console.log(array[index].posts);
        console.log(array[index].preview);
        array[index].posts.push(newPost);
        Tags.updateTags(tagsArray[index],function (err,tagNow) {
            if(err) throw err;
            newPost.tags.push(tagNow);
            count++;
            if(count==tagsArray.length)
                createPostOther(title,description,tagsArray,req,res,newPost,user);
        });
    });
}

function createPostOther(title,description,tagsArray,req,res,newPost,user){
    if (user.posts == null)
        user.posts = [];
    user.posts.push(newPost);
    console.log("1");
    User.updatePosts(user, function (err, updatedUser) {
        if (err)throw err;
        //console.log("user updated");
    });
    console.log("2");
    Post.createPost(newPost, function (err, post) {
        if (err) throw err;
    });
    req.flash('success_msg', 'Discussion Created');
    res.redirect('/');
}

router.get('/viewPosts', function (req, res) {
    var query = {status: true};
    Post.getPostWithTags(query,function (err, posts) {
        if (err) throw err;
        console.log(posts);
        res.render("index", {posts: posts, reg_user: req.session.user});
    });
});


router.post('/increaseUpvotes', function (req, res) {

    var postId = req.body.getPost;
    Post.getPostbyId(postId, function (err, post) {
        if (err) throw err;
        if (post.upvotes == null)
            post.upvotes = new Array();
        post.upvotes.push(req.session.user);
        Post.updatePost(post, function (newErr, newPost) {
            if (newErr) throw err;
            console.log(newPost);
            console.log('upvotes ' + newPost.upvotes.length);
            res.send(newPost.upvotes.length.toString());
        });
        //res.send(post.upvotes.length);
    });
});

router.post('/increaseDownvotes', function (req, res) {
    var postId = req.body.getPost;
    Post.getPostbyId(postId, function (err, post) {
        if (err) throw err;
        if (post.downvotes == null)
            post.downvotes = new Array();
        post.downvotes.push(req.session.user);
        Post.updatePost(post, function (newErr, newPost) {
            if (newErr) throw err;
            console.log(newPost);
            console.log('downvotes ' + newPost.upvotes.length);
            res.send(newPost.downvotes.length.toString());
        });
        //res.send(post.upvotes.length.toString());
    });
});

//favPost

router.post('/favPost', function (req, res) {
    var postId = req.body.getPost;
    var user = req.session.user;
    Post.getPostbyId(postId, function (err, post) {
        if (err) throw err;
        if (user.favs == null)
            user.favs = new Array();
        user.favs.push(post);
        User.updateFav(user, function (newErr, newUser) {
            if (newErr) throw newErr;
            res.send("ok", 200);
            console.log("fav added");
        });
    });
});

router.post('/unfavPost', function (req, res) {
    var postId = req.body.getPost;
    var user = req.session.user;
    Post.getPostbyId(postId, function (err, post) {
        if (err) throw err;
        User.removeFav(user, postId, function (newErr, newUser) {
            if (newErr) throw newErr;
            User.getUserById(user._id, function (err, updatedUser) {
                if (err) throw err;
                req.session.user = updatedUser;
                res.send("ok", 200);
                console.log("fav removed");
            });
        });
    });
});

//getPostByNoComment
//getPostByMostComment

router.post('/getPostByNoComment',function (req,res) {
    var query = {status: true,comments : null};
    Post.getPostWithTags(query,function (err, posts) {
        if (err) throw err;
        res.send(posts);
    });
});

router.post('/getPostByMostComment',function (req,res) {
    var query = {status: true,comments : { $ne: null }};
    Post.getPostWithTagsWithMostComments(query,function (err, posts) {
        if (err) throw err;
        res.send(posts);
    });
});

router.post('/getPostByTag',function (req,res) {
    var tags=req.body.tags;
    var flag=false;
    if(tags==null){
        flag=true;
    }
    else{
        tags=tags.split(" ");
    }
    var tasArr=req.body.tags;
    var posts=new Array();
    var addedTags="-----";
    if(flag || tasArr==''||tags.length==0){
        var query = {status: true};
        Post.getPostWithTags(query,function (err, posts) {
            if (err) throw err;
            res.send(posts);
        });
    }
    else {
        var count = 0;
        waterfall([
            function (callback) {
                async.each(tags, function (tag, callback) {
                    if(tag=='' || tag.length<1){
                        count++;
                        if(count == tags.length)
                            res.send(posts);
                    }
                    else {
                        Tags.getPostWithTags(tag, function (errNow, tagsNow) {
                            if (tagsNow == null || tagsNow == '') {
                                count++;
                            }
                            else {
                                async.each(tagsNow, function (ele1, callback1) {
                                    async.each(ele1.posts, function (ele2, callback2) {
                                        if (addedTags.indexOf(ele2._id.toString()) == -1) {
                                            addedTags += ele2._id + "-----";
                                            posts.push(ele2);
                                        }
                                    });
                                });
                                count++;
                            }
                            if (count == tags.length) {
                                res.send(posts);
                            }
                        });
                    }
                });
            }
        ], function (err) {
            console.log("done");
        });
    }
});

module.exports = router;

/*
 async.each(tagsNow,function (ele1,callback1) {

 });


 }, function(err){console.log("done");});
 */

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