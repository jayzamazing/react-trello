'use strict';
import mongoose from 'mongoose';

//schema representing a board
const cardslistSchema = new mongoose.Schema({
  title: { type: String, required: true },
  cards: [{ type: mongoose.Schema.Types.ObjectId, ref: 'card' }],
  createdAt: { type: Date, 'default': Date.now },
  updatedAt: { type: Date, 'default': Date.now }
});

const Cardslist = mongoose.model('cardslist', cardslistSchema);

module.exports = Cardslist;
