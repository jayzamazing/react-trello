'use strict';
import mongoose from 'mongoose';

//schema representing a card
const cardSchema = new mongoose.Schema({
  text: { type: String, required: true },
  createdAt: { type: Date, 'default': Date.now },
  updatedAt: { type: Date, 'default': Date.now }
});

const Card = mongoose.model('card', cardSchema);

module.exports = Card;
