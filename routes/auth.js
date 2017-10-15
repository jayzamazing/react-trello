'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
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

module.exports = {Router};
