'use strict';
import mongoose from 'mongoose';

//schema representing a cardslist
const cardslistSchema = mongoose.Schema({
  title: { type: String, required: true },
  cards: [{ type: Schema.Types.ObjectId, ref: 'card' }],
  createdAt: { type: Date, 'default': Date.now },
  updatedAt: { type: Date, 'default': Date.now }
});

const cardslistModel = mongoose.model('cardslist', cardslistSchema);

module.exports = cardslistModel;
