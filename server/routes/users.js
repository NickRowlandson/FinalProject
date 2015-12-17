var User = require('../models/user');

/* Utility functin to check if user is authenticatd */
function requireAuth(req, res, next){

  // check if the user is logged in
  if(!req.isAuthenticated()){
    return res.redirect('/login');
  }
  next();
}

module.exports = function(app){
    /* Render Users main page. */
    app.get('/users/', requireAuth, function (req, res, next) {
        User.find(function (err, users) {
            if (err) {
                console.log(err);
                res.end(err);
            }
            else {
                res.render('users/index', {
                    title: 'Users',
                    users: users,
                    displayName: req.user ? req.user.displayName : '', 
                    isAdmin: req.user ? req.user.admin : false
                });
            }
        });
    });
    
    /* Render the Add Users Page */
    app.get('/users/add', requireAuth, function (req, res, next) {
        res.render('users/add', {
            title: 'Users',
            displayName: req.user ? req.user.displayName : '', 
            isAdmin: req.user ? req.user.admin : false
        });
    });
    
    /* process the submission of a new user */
    app.post('/users/add', requireAuth, function (req, res, next) {
        var user = new User(req.body);
        var hashedPassword = user.generateHash(user.password);
        console.log("Processing new user...");
        User.create({      
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            password: hashedPassword,
            username: req.body.username,
            displayName: req.body.firstName,
            provider: 'local',
            created: Date.now(),
            updated: Date.now()
        }, function (err, User) {
            if (err) {
                console.log(err);
                res.end(err);
            }
            else {
                res.redirect('/users');
            }
        });
    });
    
    /* Render the User Edit Page */
    app.get('/users/:id', requireAuth, function (req, res, next) {
        // create an id variable
        var id = req.params.id;
        // use mongoose and our model to find the right user
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
            // Yes, it's a valid ObjectId, proceed with `findById` call.
            User.findById(id, function (err, user) {
                if (err) {
                    console.log(err);
                    res.end(err);
                }
                else {
                    //show the edit view
                    res.render('users/edit', {
                        title: 'Edit User',
                        user: user,
                        displayName: req.user ? req.user.displayName : '', 
                        isAdmin: req.user ? req.user.admin : false
                    });
                }
            });
        } else {
            res.redirect('/users');
        }
    });
    
    /* process the edit form submission */
    app.post('/users/:id', requireAuth, function (req, res, next) {
        var id = req.params.id;
        var user = new User(req.body);
        user.password = user.generateHash(user.password);
        user._id = id;
        user.updated = Date.now();
        
        // use mongoose to do the update
        User.update({ _id: id }, user, function (err) {
            if (err) {
                console.log(err);
                res.end(err);
            }
            else {
                res.redirect('/users');
            }
        });
    });
    
    /* Render the User Edit Page */
    app.get('/profile', requireAuth, function (req, res, next) { 
        //show the edit view
        res.render('users/editProfile', {
            title: 'Edit Profile',
            user: req.user,
            displayName: req.user ? req.user.displayName : '', 
            isAdmin: req.user ? req.user.admin : false
        });
    });
    
    /* process the edit profile form submission */
    app.post('/profile', requireAuth, function (req, res, next) {
        var user = new User(req.body);
        user.password = user.generateHash(user.password);
        user._id = req.user._id;
        user.updated = Date.now();
        
        // use mongoose to do the update
        User.update({ _id: req.user._id }, user, function (err) {
            if (err) {
                console.log(err);
                res.end(err);
            }
            else {
                res.redirect('/');
            }
        });
    });
    
    /* run delete on the selected user */
    app.get('/users/delete/:id', requireAuth, function (req, res, next) {
        var id = req.params.id;
        User.remove({ _id: id }, function (err) {
            if (err) {
                console.log(err);
                res.end(err);
            }
            else {
                res.redirect('/users');
            }
        });
    });
}
