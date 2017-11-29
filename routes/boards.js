'use strict';
const express = require('express');
const {Board} = require('../models/boards');
const {Cardslist} = require('../models/cardslist');
const {Card} = require('../models/cards');
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
  //store board title along with the owner of the board
  Board.
  create({title: title, owner: req.user._id})
  .then(board => {
    res.setHeader('Content-Type', 'application/json');
    res.status(201).json(board.apiRepr());
  })
  .catch(err => {
    res.status(500).json({message: err});
  });
});
Router.get('/', authenticatedJWT, (req, res) => {
  //get all the boards that belong to this user
  Board
  .find({owner: req.user._id})
  .populate({
    path: 'cardslist',
    populate: {
      path: 'cards'
    }
  })
  .exec()
  .then(board => {
    var count = board.length;
    if (count >= 1) {
      res.setHeader('Content-Type', 'application/json');
      res.json(
        board.map(
          (board) => board.apiRepr()
        )
      );
    } else {
      return Promise.reject({
          code: 204,
          reason: 'NoData',
          message: 'No Data found for user'
      });
    }

  })
  .catch(err => {
    if (err.reason === 'NoData') {
      return res.status(err.code).json(err);
    }
    res.status(500).json({message: err});
  });
});

Router.put('/:id', authenticatedJWT, (req, res) => {
  if (!req.params.id) {
    res.status(400).json({message: 'id field missing'});
  }
  const board = req.body;
  board.updatedAt = Date.now();
  //update a board that belongs to this user
  Board
  .findByIdAndUpdate(req.params.id, {$set: board}, {new: true})
  .populate({
    path: 'cardslist'
  })
  .exec()
  .then((board) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(201).json(board.apiRepr());
  })
  .catch(err => {
    res.status(500).json({message: err});
  });
});

Router.delete('/:id', authenticatedJWT, (req, res) => {
  Board
  .findByIdAndRemove(req.params.id)
  .exec()
  .then(() => Cardslist.find({boardId: req.params.id}).exec())
  .then(cardslists => {
    let removedCardslists = [];
    cardslists.forEach(cardslist => {
      removedCardslists.push(cardslist._id);
      cardslist.remove();
    });
    return removedCardslists;
  })
  .then(cardslistIds => Card.find({cardslistId: {$in: cardslistIds}}).exec())
  .then(cards => cards.forEach(card => card.remove()))
  .then(() => res.status(204).end())
  .catch((err) => res.status(500).json({message: err}));
});

module.exports = {Router};
