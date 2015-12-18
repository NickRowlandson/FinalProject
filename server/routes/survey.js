var Survey = require('../models/survey');
var Question = require('../models/question');
var Options = require('../models/option');

/* Utility function to check if user is authenticatd */
function requireAuth(req, res, next){

  // check if the user is logged in
  if(!req.isAuthenticated()){
    return res.redirect('/login');
  }
  next();
}

module.exports = function(app){
    /* process the submission of a new survey */
    app.post('/survey/create', requireAuth, function (req, res, next) {
        //if only one question, put it into array
        if(typeof req.body.questions != "object"){
            var q = req.body.questions;
            req.body.questions = [q];
        }
        if(req.body.options){
            var options = [];
            for(var a = 0; a < req.body.options.length; a++){
                Options.create({
                    text: req.body.options[a]
                }, function(err, multipleOption){
                    console.log("Created Option: ", multipleOption._id);
                    if(err){
                        throw err;
                    }else{
                        options.push(multipleOption._id);
                        if(options.length == req.body.options.length){
                            var questions = [];
                            for(var i = 0; i < req.body.questions.length; i++){
                                Question.create({
                                    text: req.body.questions[i],
                                    options: options
                                    }, function(err, question){
                                        console.log("Created question: ", question._id);
                                        
                                        if(err){
                                            throw err;
                                        }else{
                                            questions.push(question._id);
                                            if(questions.length == req.body.questions.length){
                                                console.log(questions);
                                                Survey.create({
                                                    name: req.body.name,
                                                    description: req.body.description,
                                                    type: req.body.type,
                                                    creator: req.user._id,
                                                    created: Date.now(),
                                                    updated: Date.now(),
                                                    questions: questions
                                                }, function (err, Survey) {
                                                    console.log("question options: ", questions.options);
                                                    if (err) {
                                                        console.log(err);
                                                        res.end(err);
                                                    }
                                                    else {
                                                        res.redirect('/survey/view');
                                                    }
                                                });
                                            }
                                        }
                                    }
                                )
                            } 
                        }      
                    }   
                });
            }
        }
        else 
        {
            var questions = [];
            for(var i = 0; i < req.body.questions.length; i++){
                Question.create({
                    text: req.body.questions[i]
                    }, function(err, question){
                        console.log("Created question: ", question._id);
                        if(err){
                            throw err;
                        }else{
                            questions.push(question._id);
                            if(questions.length == req.body.questions.length){
                                console.log(questions);
                                Survey.create({
                                    name: req.body.name,
                                    description: req.body.description,
                                    type: req.body.type,
                                    creator: req.user._id,
                                    created: Date.now(),
                                    updated: Date.now(),
                                    questions: questions
                                }, function (err, Survey) {
                                    if (err) {
                                        console.log(err);
                                        res.end(err);
                                    }
                                    else {
                                        res.redirect('/survey/view');
                                    }
                                });
                            }
                        }
                    }
                )
            }
        }
        
    });
    
    /* Render create survey page. */
    app.get('/survey/create', requireAuth, function (req, res, next) {
        res.render('surveys/createSurvey', {
            title: 'Create Survey',
            displayName: req.user ? req.user.displayName : '', 
            isAdmin: req.user ? req.user.admin : false
        });
    });
    
    /* Render view survey page. */
    app.get('/survey/view', requireAuth, function (req, res, next) {
        Survey.find({creator: req.user._id})
        .populate("questions")
        .exec(function (err, surveys) {
            res.render('surveys/viewSurvey', {
                title: 'My Surveys',
                surveys: surveys,
                displayName: req.user ? req.user.displayName : '', 
                isAdmin: req.user ? req.user.admin : false
            });
        });
    });
    
    /* run delete on the selected survey */
    app.get('/survey/delete/:id', requireAuth, function (req, res, next) {
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
    app.get('/survey/:id', requireAuth, function (req, res, next) {
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
                        displayName: req.user ? req.user.displayName : '', 
                        isAdmin: req.user ? req.user.admin : false
                    });
                }
            });
        } else {
            res.redirect('/survey/view');
        }
    });
    
    /* process the edit survey submission */
    app.post('/survey/:id', requireAuth, function (req, res, next) {
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
}
