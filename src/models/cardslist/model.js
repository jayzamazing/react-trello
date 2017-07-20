'use strict';
import mongoose from 'mongoose';

//schema representing a cardslist
const cardslistSchema = new mongoose.Schema({
  title: { type: String, required: true },
  cards: [{ type: mongoose.Schema.Types.ObjectId, ref: 'card' }],
  createdAt: { type: Date, 'default': Date.now },
  updatedAt: { type: Date, 'default': Date.now },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'user' }
});
//format and return data
cardslistSchema.methods.apiRepr = function() {
  return {
    title: this.title,
    cards: this.cards,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};
const Cardslist = mongoose.model('cardslist', cardslistSchema);

module.exports = Cardslist;
