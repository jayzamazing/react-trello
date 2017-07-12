'use strict';
import path from 'path';
import Express from 'express';
import morgan from 'morgan';
import passport from 'passport';
import strategy from './models/config/strategy';
import { Router as userRouter, User } from './models/users';
import { Router as authRouter } from './models/auth';
import { Router as boardRouter } from './models/boards';
import bodyParser from 'body-parser';
const app = Express();
app.use(morgan('common'));
app.use(Express.static(path.join(__dirname, '../build/static')));
//used for form submissions
app.use(bodyParser.urlencoded({ extended: false }));
//used for json submissions
app.use(bodyParser.json());
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
passport.use(strategy);
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

export default app;
