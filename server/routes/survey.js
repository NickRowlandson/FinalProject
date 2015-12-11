var express = require('express');
var router = express.Router();

var Survey = require('../models/survey');

console.log("INCLUDE SURVEY ROUTES");
/* process the submission of a new survey */
router.post('/create', function (req, res, next) {
   if(!req.isAuthenticated()){
    return res.redirect('/login');
  } 
    Survey.create({
        name: req.body.name,
        description: req.body.description,
        creator: req.user._id,
        created: Date.now(),
        updated: Date.now()
    }, function (err, User) {
        if (err) {
            console.log(err);
            res.end(err);
        }
        else {
            res.redirect('/survey/create');
        }
    });
});

/* Render create survey page. */
router.get('/create', function (req, res, next) {
    if(!req.isAuthenticated()){
    return res.redirect('/login');
  }
    
    res.render('surveys/createSurvey', {
        title: 'Create Survey',
        displayName: req.user ? req.user.displayName : ''
    });
});

/* Render view survey page. */
router.get('/view', function (req, res, next) {
    if(!req.isAuthenticated()){
        return res.redirect('/login');
    }
    res.render('surveys/viewSurvey', {
        title: 'View Survey',
        displayName: req.user ? req.user.displayName : ''
    });
});

module.exports = router;
