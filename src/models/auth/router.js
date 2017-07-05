'use strict';

import express from 'express';
import bodyParser from 'body-parser';
import passport from 'passport';
import strategy from '../auth/strategy';
const Router = express.Router();
Router.use(bodyParser.json());

passport.use(strategy);
Router.use(passport.initialize());

//deal with authentication and setting up session
Router.get('/login',
  passport.authenticate('basic', {session: false}),
  (req, res) => res.json({user: req.user.apiRepr()})
);

module.exports = Router;
