'use strict';

const express = require('express');
const {Cardslist} = require('../models/cardslist');
const bodyParser = require('body-parser');
const {authenticatedJWT} = require('../middlewares/authcheck');
const Router = express.Router();
Router.use(bodyParser.json());


Router.post('/', authenticatedJWT, (req, res) => {
  if(!req.body) {
    res.status(400).json({message: 'No request body'});
  }
  if (!('title' in req.body)) {
    res.status(422).json({message: 'Missing field: title'});
  }
  let {title} = req.body;
  if (typeof title !== 'string') {
    res.status(422).json({message: 'Invalid field type: title'});
  }
  title = title.trim();
  if (title === '') {
    res.status(422).json({message: 'Incorrect field length: title'});
  }
  if (!('boardId' in req.body)) {
    res.status(422).json({message: 'Missing field: boardId'});
  }
  let {boardId} = req.body;
  if (typeof boardId !== 'string') {
    res.status(422).json({message: 'Invalid field type: boardId'});
  }
  boardId = boardId.trim();
  if (boardId === '') {
    res.status(422).json({message: 'Incorrect field length: boardId'});
  }
  //store Cardslist title along with the owner of the Cardslist
  Cardslist.
  create({title: title, owner: req.user._id, boardId: boardId})
  .then(cardslist => {
    res.status(201).json(cardslist.apiRepr());
  })
  .catch(err => {
    res.status(500).json({message: err});
  });
});
Router.get('/', authenticatedJWT, (req, res) => {
  //get all the Cardslists that belong to this user
  Cardslist
  .find({owner: req.user._id})
  .populate({
    path: 'cards'
  })
  .exec()
  .then(cardslist => {
    res.json({
      cardslist: cardslist.map(
        (cardslist) => cardslist.apiRepr()
      )
    });
  })
  .catch(err => {
    res.status(500).json({message: err});
  });
});

Router.put('/:id', authenticatedJWT, (req, res) => {
  if (!req.params.id) {
    res.status(400).json({message: 'id field missing'});
  }
  //update a Cardslist that belongs to this user
  Cardslist
  .findByIdAndUpdate(req.params.id, {$set: {title: req.body.title, updatedAt: Date.now()}})
  .exec()
  .then(cardslist => {
    res.status(201).json(cardslist.apiRepr());;
  })
  .catch(err => {
    res.status(500).json({message: err});
  });
});

Router.delete('/:id', authenticatedJWT, (req, res) => {
  Cardslist.findByIdAndRemove(req.params.id)
  .exec()
  .then(() => res.status(204).end())
  .catch((err) => res.status(500).json({message: err}));
});

module.exports = {Router};
