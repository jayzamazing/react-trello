'use strict';
import mongoose from 'mongoose';
// mongoose.set('debug', true);

//schema representing a card
const cardSchema = new mongoose.Schema({
  text: { type: String, required: true },
  createdAt: { type: Date, 'default': Date.now },
  cardslistId: { type: mongoose.Schema.Types.ObjectId, ref: 'cardslist' },
  updatedAt: { type: Date, 'default': Date.now },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'user' }
});
//format and return data
cardSchema.methods.apiRepr = function() {
  return {
    text: this.text,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};
const Card = mongoose.model('card', cardSchema);

module.exports = Card;
