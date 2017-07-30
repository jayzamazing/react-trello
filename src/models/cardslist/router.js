'use strict';

import express from 'express';
import Cardslist from './model';
import bodyParser from 'body-parser';
import {authenticated} from '../auth';
const Router = express.Router();
Router.use(bodyParser.json());


Router.post('/', authenticated, (req, res) => {
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
  //store Cardslist title along with the owner of the Cardslist
  Cardslist.
  create({title: title, owner: req.user._id})
  .then(cardslist => {
    res.status(201).json(cardslist.apiRepr());
  })
  .catch(err => {
    res.status(500).json({message: err});
  });
});
Router.get('/', authenticated, (req, res) => {
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

Router.put('/:id', authenticated, (req, res) => {
  if (!req.params.id) {
    res.status(400).json({message: 'id field missing'});
  }
  //update a Cardslist that belongs to this user
  Cardslist
  .findByIdAndUpdate(req.params.id, {$set: {title: req.body.title, updatedAt: Date.now()}})
  .exec()
  .then(() => {
    res.status(204).end();
  })
  .catch(err => {
    res.status(500).json({message: err});
  });
});

Router.delete('/:id', authenticated, (req, res) => {
  Cardslist.findByIdAndRemove(req.params.id)
  .exec()
  .then(() => res.status(204).end())
  .catch((err) => res.status(500).json({message: err}));
});
module.exports = Router;
