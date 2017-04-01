var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var multer = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});

var upload = multer({storage: storage});

var User = require('../models/user');

// Register
router.get('/register', function (req, res) {
    res.render('register'); //rendering register-view
});

// Login
router.get('/login', function (req, res) {
    res.render('login'); // rendering login-view
});

router.post('/addUser', function (req, res) { // adding user to db
    var name = req.body.name;
    var email = req.body.email;
    var username = req.body.username;
    var password = req.body.password;
    var password2 = req.body.password2;

    // Validation
    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('password', 'Pasword: Minimum length should be 8').isLength({min: 8});
    req.checkBody('password2', 'Passwords do not match').equals(req.body.password);


    var errors = req.validationErrors();

    User.getUserByUsername(username, function (err, user) {
        if (err) throw err;
        if (user) {
            if (errors) {
                res.render('register', {
                    message: "User already exist!!",
                    err: errors
                });
            }
            else {
                res.render('register', {
                    message: "User already exist!!"
                });
            }
        }
        else if (errors) {
            res.render('register', {
                err: errors
            });
        }
        else {
            //create a new unique user
            var newUser = new User({
                name: name,
                email: email,
                username: username,
                password: password,
                filename: "unknown.png"
            });
            User.createUser(newUser, function (err, user) {
                if (err) throw err;
                console.log(user);
            });
            req.flash('success_msg', 'You are registered and can now login');
            res.redirect('/users/login');
        }
    });//render view register and send errors to display
});
// passport documentation
passport.use(new LocalStrategy(
    function (username, password, done) {
        User.getUserByUsername(username, function (err, user) {
            if (err) throw err;
            if (!user) {
                return done(null, false, {message: 'User does not exist!!'});
            }
            User.comparePassword(password, user.password, function (err, isMatch) {
                if (err) throw err;
                if (isMatch) {
                    return done(null, user);
                } else {
                    return done(null, false, {message: 'Invalid password :('});
                }
            });
        });
    }));

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.getUserById(id, function (err, user) {
        done(err, user);
    });
});


router.post('/authenticate',
    passport.authenticate('local', {failureRedirect: '/users/login', failureFlash: true}),
    function (req, res) {
        req.session.user = req.user;
        res.redirect('/');
    });

router.get('/logout', function (req, res) {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    req.session.destroy();
    res.redirect('/users/login');
});

router.get('/profile', function (req, res) {
    if (req.session && req.session.user) {
        res.render('profile', {reg_user: req.session.user})
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
        else res.redirect('/users/profile');

    });
});
module.exports = router;
