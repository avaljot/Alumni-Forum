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

router.get('/', function (req, res) {
    if (req.session && req.session.user) {
        res.render('profile-posts', {layout: 'profile-layout', reg_user: req.session.user})
    }
    else {
        res.redirect('/users/login');
    }
});

router.post('/upload', upload.single('img_file'), function (req, res, next) {
    var myfile = req.file;
    User.updateImage(myfile.originalname, req.session.user.username, function (err, user) {
        req.session.user.filename = myfile.originalname;
        if (err) throw  err;
        else res.redirect('/profile');
    });
});

module.exports = router;

