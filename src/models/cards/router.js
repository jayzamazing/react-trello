'use strict';

import express from 'express';
import Card from './model';
import bodyParser from 'body-parser';
import {authenticated} from '../auth';
const Router = express.Router();
Router.use(bodyParser.json());


Router.post('/', authenticated, (req, res) => {
  if(!req.body) {
    res.status(400).json({message: 'No request body'});
  }
  if (!('text' in req.body)) {
    res.status(422).json({message: 'Missing field: text'});
  }
  let {text} = req.body;
  if (typeof text !== 'string') {
    res.status(422).json({message: 'Invalid field type: text'});
  }
  text = text.trim();
  if (text === '') {
    res.status(422).json({message: 'Incorrect field length: text'});
  }
  //store Card text along with the owner of the Card
  Card.
  create({text: text, owner: req.user._id})
  .then(card => {
    res.status(201).json(card.apiRepr());
  })
  .catch(err => {
    res.status(500).json({message: err});
  });
});
Router.get('/', authenticated, (req, res) => {
  //get all the Cards that belong to this user
  Card
  .find({owner: req.user._id})
  .exec()
  .then(card => {
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

Router.put('/:id', authenticated, (req, res) => {
  if (!req.params.id) {
    res.status(400).json({message: 'id field missing'});
  }
  //update a Card that belongs to this user
  Card
  .findByIdAndUpdate(req.params.id, {$set: {text: req.body.text, updatedAt: Date.now()}})
  .exec()
  .then(() => {
    res.status(204).end();
  })
  .catch(err => {
    res.status(500).json({message: err});
  });
});

Router.delete('/:id', authenticated, (req, res) => {
  Card.findByIdAndRemove(req.params.id)
  .exec()
  .then(() => res.status(204).end())
  .catch((err) => res.status(500).json({message: err}));
});
module.exports = Router;
