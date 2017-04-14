var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({storage: storage});
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});

var User = require('../models/user');

router.post('/upload', upload.single('img_file'), function (req, res, next) {
    var myfile = req.file;
    User.updateImage(myfile.originalname, req.session.user.username, function (err, user) {
        req.session.user.filename = myfile.originalname;
        if (err) throw  err;
        else res.redirect('/profile');
    });
});

router.get('/allusers', function (req, res) {
    if (req.session && req.session.user) {
        User.getAllUsers(function (err, users) {
            if (err) throw err;
            res.render('profile-users', {
                layout: 'profile-layout',
                userlist: users,
                user: req.session.user,
                reg_user: req.session.user
            });
        });
    }
    else {
        res.redirect('/users/login');
    }
});

router.get('/:username', function (req, res) {
    if (req.session && req.session.user) {
        User.findOne({username: req.params.username, 'status': true}).populate('posts').exec(function (err, user) {
            console.log("found: " + user);
            res.render('profile-posts', {
                layout: 'profile-layout',
                user: user,
                reg_user: req.session.user
            });
        });
    }
    else {
        res.redirect('/users/login');
    }
});

router.post('/delete', function (req, res) {

    User.deleteUser(req.body.user_id, function (err, user) {
        if (err) throw err;
        res.send(user);
    })
});

router.post('/make-admin', function (req, res) {

    User.makeAdmin(req.body.user_id, function (err, user) {
        if (err) throw err;
        res.send(user);
    })
});

router.post('/undo-admin', function (req, res) {

    User.undoAdmin(req.body.user_id, function (err, user) {
        if (err) throw err;
        res.send(user);
    })
});


router.get('/', function (req, res) {
    if (req.session && req.session.user) {
        User.findOne({_id: req.session.user._id, 'status': true}).populate('posts').exec(function (err, user) {
            res.render('profile-posts', {
                layout: 'profile-layout',
                user: user,
                reg_user: user
            });
        });
    }
    else {
        res.redirect('/users/login');
    }
});
module.exports = router;

