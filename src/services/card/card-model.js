'use strict';

// card-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const cardSchema = new Schema({
  _id: { type: Number, required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, 'default': Date.now },
  updatedAt: { type: Date, 'default': Date.now }
});

const cardModel = mongoose.model('card', cardSchema);

module.exports = cardModel;
