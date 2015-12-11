//var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

// Import the User Model
var User = require('../models/user');

module.exports = function (passport) {

  // serialize user
  passport.serializeUser(function (user, done) {
    done(null, user);
  });

  // deserialize user
  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });

  passport.use('local-login', new LocalStrategy({
    passReqToCallback: true
  },

    function (req, email, password, done) {

      // asynchronous process
      process.nextTick(function () {
        User.findOne({
          'username': email,
        }, function (err, user) {
          if (err) {
            return done(err);
          }

          // no valid user found
          if (!user) {
            // third parameter is a flash warning message
            return done(null, false, req.flash('loginMessage', 'Incorrect email'));
          }

          // no valid password entered
          if (!user.validPassword(password)) {
            return done(null, false, req.flash('loginMessage', 'Incorrect password'));
          }

          // everything ok - proceed with login
          return done(null, user);
        });
      });
    }));

    // Configure registration local strategy
    passport.use('local-registration', new LocalStrategy({
        passReqToCallback : true
    },
    function(req, email, password, done) {
        console.log("Registering via passports local strategy...");
        // asynchronous process
        process.nextTick(function() {
            // if the user is not already logged in:
            if (!req.user) {
                User.findOne({ 'username' : email },
                function(err, user) {
                    // if errors
                    if (err) {
                      return done(err);
                      }
                    // check email
                    if (user) {
                        return done(null, false, req.flash('registerMessage',
                        'The email is already taken.'));
                    }
                    else {
                        var parsed = {};
                        
                        parsed['firstName'] = req.body.firstName;
                        parsed['lastName'] = req.body.lastName;
                        parsed['username'] = req.body.username;
                        parsed['password'] = req.body.password;
                        
                        // create the user
                        var newUser = new User(parsed);
                        newUser.displayName = req.body.firstName;
                        newUser.password = newUser.generateHash(password);
                        newUser.provider = 'local';
                        newUser.created = Date.now();
                        newUser.updated = Date.now();
                        newUser.save(function(err) {
                            if (err) {
                              throw err;
                              }
                            return done(null, newUser);
                        });
                    }
                });
            } else {
                // everything ok, register user
                return done(null, req.user);
            }
        });
    }));
}
