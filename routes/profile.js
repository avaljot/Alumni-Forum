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

router.get('/users', function (req, res) {
    if (req.session && req.session.user) {
        User.getAllUsers(function (err, users) {
            if (err) throw err;
            res.render('profile-users', {
                userlist: users,
                layout: 'profile-layout',
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
        User.getUserByUsername(req.params.username, function (err, user) {
            if (err)throw err;
            res.render('profile-posts', {
                layout: 'profile-layout',
                user: user,
                reg_user: req.session.user
            });

        });

    } else {
        res.redirect('/users/login');
    }
});

router.get('/', function (req, res) {
    if (req.session && req.session.user) {
        res.render('profile-posts', {
            layout: 'profile-layout',
            user: req.session.user,
            reg_user: req.session.user
        });
    }
    else {
        res.redirect('/users/login');
    }
});
module.exports = router;

