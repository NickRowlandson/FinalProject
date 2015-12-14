var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

// additions for authentication
var mongoose = require('mongoose');
var flash = require('connect-flash');
var passport = require('passport');

// DB Setup
var DB = require('./server/config/db.js');
mongoose.connect(DB.url);
mongoose.connection.on('error', function () {
  console.error('MongoDB Connection Error');
});

var app = express();

// passport configuration
require('./server/config/passport')(passport);

// view engine setup
app.set('views', path.join(__dirname, './server/views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'someSecret',
  saveUninitialized: true,
  resave: true
})
);

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// Routes Setup
var routes = require('./server/routes/index')(app);
var users = require('./server/routes/users')(app);
var survey = require('./server/routes/survey')(app);

module.exports = app;