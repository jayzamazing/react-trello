'use strict';

// cardslist-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cardslistSchema = new Schema({
  _id: { type: Number, required: true },
  title: { type: String, required: true },
  cards: [{ type: Number, ref: 'card' }],
  createdAt: { type: Date, 'default': Date.now },
  updatedAt: { type: Date, 'default': Date.now }
});

const cardslistModel = mongoose.model('cardslist', cardslistSchema);

module.exports = cardslistModel;
