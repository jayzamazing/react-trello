'use strict';

import express from 'express';
import bodyParser from 'body-parser';
import passport from 'passport';
// import strategy from '../config/strategy';
const Router = express.Router();
Router.use(bodyParser.json());

//deal with authentication and setting up session
Router.post('/login',
  passport.authenticate('basic'),
  (req, res) => res.json({user: req.user.apiRepr()})
);
Router.post('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = Router;
