var express = require('express');
var passport = require('passport');
var router = express.Router();

var User = require('../models/user');
var survey = require("./survey");

/* Utility functin to check if user is authenticated */
function requireAuth(req, res, next){

  // check if the user is logged in
  if(!req.isAuthenticated()){
    return res.redirect('/login');
  }
  next();
}

/* Render home page. */
router.get('/', function (req, res, next) {
    res.render('index', {
        title: 'Home',
        displayName: req.user ? req.user.displayName : ''
    });
});

/* Render Login page. */
router.get('/login', function (req, res, next) {
    if (!req.user) {
        res.render('login', {
            title: 'Login',
            messages: req.flash('loginMessage'),
            displayName: req.user ? req.user.displayName : ''
        });
        return;
    }
    else {
        return res.redirect('/users');
    }
});

/* Process login request */
router.post('/login', passport.authenticate('local-login', {
    //Success go to Users Page / Fail go to Login page
    successRedirect: '/users',
    failureRedirect: '/login',
    failureFlash: true
}));

/* Render Registration Page */
router.get('/register', function (req, res, next) {
    if (!req.user) {
        res.render('register', {
            title: 'Register',
            messages: req.flash('registerMessage'),
            displayName: req.user ? req.user.displayName : ''
        });
    }
    else {
        return res.redirect('/');
    }
});

/* Process register request */
router.post('/register', function(req, res, next){
    console.log(req.body)
    next()
}, passport.authenticate('local-registration', {
    //Success go to Users Page / Fail go to Signup page
    successRedirect: '/users',
    failureRedirect: '/register',
    failureFlash: true
}));


/* Process Logout Request */
router.get('/logout', function (req, res){
  req.logout();
  res.redirect('/');
});

module.exports = router;
