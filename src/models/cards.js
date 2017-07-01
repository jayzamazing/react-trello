'use strict';
import mongoose from 'mongoose';

//schema representing a card
const cardSchema = mongoose.Schema({
  text: { type: String, required: true },
  createdAt: { type: Date, 'default': Date.now },
  updatedAt: { type: Date, 'default': Date.now }
});

const cardModel = mongoose.model('card', cardSchema);

module.exports = cardModel;
