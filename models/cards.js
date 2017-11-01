'use strict';
const mongoose = require('mongoose');

const options = {
  toObject: {getters: true},
  toJSON: {getters: true}
};
//schema representing a card
const cardSchema = new mongoose.Schema({
  title: { type: String, required: true },
  text: { type: String },
  createdAt: { type: Date, 'default': Date.now },
  cardslistId: { type: mongoose.Schema.Types.ObjectId, ref: 'cardslist' },
  updatedAt: { type: Date, 'default': Date.now },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'user' }
}, options);
//format and return data
cardSchema.methods.apiRepr = function() {
  return {
    title: this.title,
    text: this.text,
    _id: this._id
  };
};
const Card = mongoose.model('card', cardSchema);

module.exports = {Card};
