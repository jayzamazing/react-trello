'use strict';

import express from 'express';
import bodyParser from 'body-parser';
// import passport from 'passport';
// import Cardslist from './model';
// import strategy from '../auth/strategy';
const Router = express.Router();
Router.use(bodyParser.json());

// passport.use(strategy);
// Router.use(passport.initialize());



module.exports = Router;