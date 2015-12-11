var express = require('express');
var passport = require('passport');
var router = express.Router();

var Survey = require('../models/survey');

console.log("INCLUDE SURVEY ROUTES");

/* Utility functin to check if user is authenticatd */
function requireAuth(req, res, next){

  // check if the user is logged in
  if(!req.isAuthenticated()){
    return res.redirect('/login');
  }
  next();
}

/* process the submission of a new survey */
router.post('/create', requireAuth, function (req, res, next) {
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
            res.redirect('/survey/view');
        }
    });
});

/* Render create survey page. */
router.get('/create', requireAuth, function (req, res, next) {
    res.render('surveys/createSurvey', {
        title: 'Create Survey',
        displayName: req.user ? req.user.displayName : ''
    });
});

/* Render view survey page. */
router.get('/view', requireAuth, function (req, res, next) {
    Survey.find(function (err, surveys) {
        res.render('surveys/viewSurvey', {
            title: 'View Survey',
            surveys: surveys,
            displayName: req.user ? req.user.displayName : ''
        });
    });
});

/* run delete on the selected user */
router.get('/delete/:id', requireAuth, function (req, res, next) {
    var id = req.params.id;
    Survey.remove({ _id: id }, function (err) {
        if (err) {
            console.log(err);
            res.end(err);
        }
        else {
            res.redirect('/survey/view');
        }
    });
});

/* Render the Survey Edit Page */
router.get('/:id', requireAuth, function (req, res, next) {
    // create an id variable
    var id = req.params.id;
    // use mongoose and our model to find the right user
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
        // Yes, it's a valid ObjectId, proceed with `findById` call.
        Survey.findById(id, function (err, surveys) {
            if (err) {
                console.log(err);
                res.end(err);
            }
            else {
                //show the edit view
                res.render('surveys/editSurvey', {
                    title: 'Edit Survey',
                    surveys: surveys,
                    displayName: req.user ? req.user.displayName : ''
                });
            }
        });
    } else {
        res.redirect('/survey/view');
    }
});

/* process the edit form submission */
router.post('/:id', requireAuth, function (req, res, next) {
    var id = req.params.id;
    var survey = new Survey(req.body);
    survey._id = id;
    survey.updated = Date.now();
    
    // use mongoose to do the update
    Survey.update({ _id: id }, survey, function (err) {
        if (err) {
            console.log(err);
            res.end(err);
        }
        else {
            res.redirect('/survey/view');
        }
    });
});
module.exports = router;
