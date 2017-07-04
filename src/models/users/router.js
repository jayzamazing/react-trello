'use strict';
import {BasicStrategy} from 'passport-http';
import express from 'express';
import bodyParser from 'body-parser';
import passport from 'passport';
import User from './model';

const Router = express.Router();
Router.use(bodyParser.json());
//strategy to verify the user against
const strategy = new BasicStrategy(
  (username, password, cb) => {
    User.findOne({username})
    .exec()
    .then(user => {
      //if the user does not exist
      if (!user) {
        return cb(null, false, {
          message: 'Incorrect credentials'
        })
      }
      //otherwise try and validate the password
      return user.validatePassword(password);
    })
    .then(isValid => {
      //if the password is incorrect
      if (!isValid) {
        return cb(null, false, {
          message: 'Incorrect credentials'
        })
      } else {
        return cb(null, user);
      }
    })
    .catch(err => cb(err));
  }
);

passport.use(strategy);
Router.use(passport.initialize());

//check that the email is valid
function validateEmail(email) {
    let regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(email);
}

Router.post('/', (req, res) => {
  if(!req.body) {
    return res.status(400).json({message: 'No request body'});
  }
  if (!('email' in req.body)) {
    return res.status(422).json({message: 'Missing field: email'});
  }
  let {email, password} = req.body;
  if (typeof email !== 'string') {
    return res.status(422).json({message: 'Invalid field type: email'});
  }
  email = email.trim();
  if (email === '') {
    return res.status(422).json({message: 'Incorrect field length: email'});
  }
  if (!validateEmail(email)) {
    return res.status(422).json({message: 'Invalid field type: email'});
  }
  if (!(password)) {
    return res.status(422).json({message: 'Missing field: password'});
  }
  if (typeof password !== 'string') {
    return res.status(422).json({message: 'Incorrect field type: password'});
  }
  password = password.trim();

  if (password === '') {
    return res.status(422).json({message: 'Incorrect field length: password'});
  }
  // check for existing user
  return User
    .find({email})
    .count()
    .exec()
    .then(count => {
      if (count > 0) {
        return res.status(422).json({message: 'username already taken'});
      }
      // if no existing user, hash password
      return User.hashPassword(password)
    })
    .then(hash => {
      return User
        .create({
          email: email,
          password: password
        })
    })
    .then(user => {
      return res.status(201).json(user.apiRepr());
    })
    .catch(err => {
      return res.status(500).json({message: err})
    });
});
//deal with authentication and setting up session
Router.get('/me',
  passport.authenticate('basic', {session: true}),
  (req, res) => res.json({user: req.user.apiRepr()})
);

module.exports = Router;
