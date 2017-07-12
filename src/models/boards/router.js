'use strict';

import express from 'express';
import Board from './model'  ;
import bodyParser from 'body-parser';
const Router = express.Router();
Router.use(bodyParser.json());
// Router.use(bodyParser.urlencoded({ extended: false }));
Router.post('/', (req, res) => {
  //ensure there is a session
  if (req.isAuthenticated()) {
    if(!req.body) {
      return res.status(400).json({message: 'No request body'});
    }
    if (!('title' in req.body)) {
      return res.status(422).json({message: 'Missing field: title'});
    }
    let {title} = req.body;
    if (typeof title !== 'string') {
      return res.status(422).json({message: 'Invalid field type: title'});
    }
    title = title.trim();
    if (title === '') {
      return res.status(422).json({message: 'Incorrect field length: title'});
    }
    return Board.
    create({title: title})
    .then(board => {
      return res.status(201).json(board.apiRepr());
    })
    .catch(err => {
      return res.status(500).json({message: err});
    });
  //otherwise
  } else {
    return res.redirect('/');
  }
});


module.exports = Router;
