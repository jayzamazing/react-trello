'use strict';

const express = require('express');
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
  if (!('cardslistId' in req.body)) {
    res.status(422).json({message: 'Missing field: cardslistId'});
  }
  let {cardslistId} = req.body;
  if (typeof cardslistId !== 'string') {
    res.status(422).json({message: 'Invalid field type: cardslistId'});
  }
  cardslistId = cardslistId.trim();
  if (cardslistId === '') {
    res.status(422).json({message: 'Incorrect field length: cardslistId'});
  }
  //store Card title along with the owner of the Card
  Card.
  create({title: title, owner: req.user._id, cardslistId: cardslistId})
  .then(card => {
    res.setHeader('Content-Type', 'application/json');
    res.status(201).json(card.apiRepr());
  })
  .catch(err => {
    res.status(500).json({message: err});
  });
});
Router.get('/', authenticatedJWT, (req, res) => {
  //get all the Cards that belong to this user
  Card
  .find({owner: req.user._id})
  .exec()
  .then(card => {
    res.setHeader('Content-Type', 'application/json');
    res.json({
      card: card.map(
        (card) => card.apiRepr()
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
  //update a Card that belongs to this user
  Card
  .findByIdAndUpdate(req.params.id, {$set: {title: req.body.title, updatedAt: Date.now()}})
  .exec()
  .then(card => {
    res.setHeader('Content-Type', 'application/json');
    res.status(201).json(card.apiRepr());
  })
  .catch(err => {
    res.status(500).json({message: err});
  });
});

Router.delete('/:id', authenticatedJWT, (req, res) => {
  Card.findByIdAndRemove(req.params.id)
  .exec()
  .then(() => res.status(204).end())
  .catch((err) => res.status(500).json({message: err}));
});
exports.Router = Router;
