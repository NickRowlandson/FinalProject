var passport = require('passport');

var User = require('../models/user');
var Survey = require("../models/survey");
var Response = require("../models/response");

/* Utility functin to check if user is authenticated */
function requireAuth(req, res, next){

  // check if the user is logged in
  if(!req.isAuthenticated()){
    return res.redirect('/login');
  }
  next();
}

module.exports = function(app){
    
    /* Render home page. */
    app.get('/', function (req, res, next) {
        Survey.find(function (err, surveys) {
            res.render('index', {
                surveys: surveys,
                title: 'Home',
                displayName: req.user ? req.user.displayName : ''
            });
        });
    });   
    
     /* Render take survey page. */
    app.get('/takeSurvey/:id', function (req, res, next) {
        var id = req.params.id;
        Survey.find({ _id: id })
        .populate("questions")
        .populate("questions.options")
        .exec( function (err, survey) {
            res.render('takeSurvey', {
                survey: survey,
                title: 'Take Survey',
                displayName: req.user ? req.user.displayName : ''
            });
        });
    });   
    
    /* process the submission of a survey */
    app.post('/takeSurvey/:id', function (req, res, next) {
        for(var i = 0; i < req.body.answer.length; i++){
            Response.create({
                answer: req.body.answer[i], 
                }, function(err, answer){
                    console.log("Created response: ", answer._id);
                    if(err){
                        throw err;
                    }else{

                    }
                }
            )
        }
        
    });
    
    /* Render Login page. */
    app.get('/login', function (req, res, next) {
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
    app.post('/login', passport.authenticate('local-login', {
        //Success go to Users Page / Fail go to Login page
        successRedirect: '/survey/view',
        failureRedirect: '/login',
        failureFlash: true
    }));
    
    /* Render Registration Page */
    app.get('/register', function (req, res, next) {
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
    app.post('/register', function(req, res, next){
        console.log(req.body)
        next()
    }, passport.authenticate('local-registration', {
        //Success go to Users Page / Fail go to Signup page
        successRedirect: '/users',
        failureRedirect: '/register',
        failureFlash: true
    }));
    
    
    /* Process Logout Request */
    app.get('/logout', function (req, res){
    req.logout();
    res.redirect('/');
    });
}