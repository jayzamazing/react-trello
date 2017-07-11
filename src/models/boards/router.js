'use strict';

import express from 'express';
import bodyParser from 'body-parser';
const Router = express.Router();
Router.use(bodyParser.json());

Router.post('/', (req, res) => {
  //ensure there is a session
  if (req.isAuthenticated()) {
    
  //otherwise
  } else {
    res.redirect('/');
  }
});


module.exports = Router;
