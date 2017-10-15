'use strict';
const path = require('path');
const Express = require('express');
const morgan = require('morgan');
const passport = require('passport');
const {basicStrategy} = require('./helpers/strategy');
const {User} = require('./models/users');
const { Router : userRouter } = require('./routes/users');
const { Router : authRouter } = require('./routes/auth');
const { Router : boardRouter } = require('./routes/boards');
const { Router : cardslistRouter } = require('./routes/cardslist');
const { Router : cardsRouter } = require('./routes/cards');
const { STATIC } = require('./config/config');
const bodyParser = require('body-parser');
const {logger} = require('./helpers/logger');
const app = Express();
app.use(morgan('common', {stream: logger.stream}));
app.use(Express.static(path.join(__dirname, STATIC)));
//used for form submissions
app.use(bodyParser.urlencoded({ extended: false }));
//used for json submissions
app.use(bodyParser.json());
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
passport.use(basicStrategy);
app.use(passport.initialize());
app.use(passport.session());
//save user for session
passport.serializeUser(function(user, done) {
  done(null, user.id);
});
//create user object from session
passport.deserializeUser(function(id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

app.use('/auth/', authRouter);
app.use('/users/', userRouter);
app.use('/boards/', boardRouter);
app.use('/cardslist/', cardslistRouter);
app.use('/cards/', cardsRouter);
app.use('*', (req, res) => {
  res.status(200).sendFile(path.join(__dirname + STATIC + '/index.html'));
});


exports.app = app;
