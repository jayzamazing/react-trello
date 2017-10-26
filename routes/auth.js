'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const config = require('../config/serverConfig');
const jwt = require('jsonwebtoken');
const {authenticated, authenticatedJWT} = require('../middlewares/authcheck');
const Router = express.Router();
const createAuthToken = user => {
  return jwt.sign({user}, config.JWT_SECRET, {
    subject: user.email,
    expiresIn: config.JWT_EXPIRY,
    algorithm: 'HS256'
  });
};
const deleteAuthToken = user => {
  console.log(user);
  return jwt.sign({user}, config.JWT_SECRET, {
    subject: user.email,
    expiresIn: 'Thu, 01 Jan 1970 00:00:01 GMT',
    algorithm: 'HS256'
  });
}
Router.use(bodyParser.json());
//deal with authentication and setting up session
Router.post('/login', passport.authenticate('basic', {session: false}), (req, res) => {
    const authToken = createAuthToken(req.user.apiRepr());
    res.json({authToken});
  }
);
//deal with refreshing the token when it has expired
Router.post('/refresh', authenticatedJWT, (req, res) => {
    const authToken = createAuthToken(req.user);
    res.json({authToken});
  }
);
//deal with redirecting the user back to the start page on logout
Router.post('/logout', authenticatedJWT, (req, res) => {
  const authToken = deleteAuthToken(req.user);
  req.logout();
  res.redirect('/', {authToken});
});
module.exports = {Router};
