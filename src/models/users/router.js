'use strict';

import express from 'express';
import bodyParser from 'body-parser';
import User from './model';
// import strategy from '../config/strategy';
const Router = express.Router();
Router.use(bodyParser.json());

// passport.use(strategy);
// Router.use(passport.initialize());

//check that the email is valid
function validateEmail(email) {
  let regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regex.test(email);
}

Router.post('/', (req, res) => {
  if(!req.body) {
    res.status(400).json({message: 'No request body'});
  }
  if (!('email' in req.body)) {
    res.status(422).json({message: 'Missing field: email'});
  }
  let {email, password} = req.body;
  if (typeof email !== 'string') {
    res.status(422).json({message: 'Invalid field type: email'});
  }
  email = email.trim();
  if (email === '') {
    res.status(422).json({message: 'Incorrect field length: email'});
  }
  if (!validateEmail(email)) {
    res.status(422).json({message: 'Invalid field type: email'});
  }
  if (!(password)) {
    res.status(422).json({message: 'Missing field: password'});
  }
  if (typeof password !== 'string') {
    res.status(422).json({message: 'Incorrect field type: password'});
  }
  password = password.trim();

  if (password === '') {
    res.status(422).json({message: 'Incorrect field length: password'});
  }
// check for existing user
  User
.find({email})
.count()
.exec()
.then(count => {
  if (count > 0) {
    res.status(422).json({message: 'username already taken'});
  }
// if no existing user, hash password
  return User.hashPassword(password);
})
.then(hash => {
  return User
.create({
  email: email,
  password: hash
});
})
.then(user => {
  res.status(201).json(user.apiRepr());
})
.catch(err => {
  res.status(500).json({message: err});
});
});

module.exports = Router;
