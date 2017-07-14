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
    //store board title along with the owner of the board
    return Board.
    create({title: title, owner: req.user._id})
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
Router.get('/', (req, res) => {
  //ensure there is a session
  if (req.isAuthenticated()) {
    //get all the boards that belong to this user
    return Board
    .find({owner: req.user._id})
    .then(board => {
      return res.json({
        board: board.map(
          (board) => board.apiRepr()
        )
      });
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
