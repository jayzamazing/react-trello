'use strict';
import mongoose from 'mongoose';

const options = {
  toObject: {getters: true},
  toJSON: {getters: true}
};
//schema representing a cardslist
const cardslistSchema = new mongoose.Schema({
  title: { type: String, required: true },
  boardId: { type: mongoose.Schema.Types.ObjectId, ref: 'board' },
  createdAt: { type: Date, 'default': Date.now },
  updatedAt: { type: Date, 'default': Date.now },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'user' }
}, options);
//format and return data
cardslistSchema.methods.apiRepr = function() {
  let cards;
  //if there is a cards the format it, otherwise make it null
  cards = this.cards ? this.cards.map(cards => cards.apiRepr()) : null;
  return {
    title: this.title,
    _id: this._id,
    cards: cards
  };
};
// populate all cards
cardslistSchema.virtual('cards', {
  ref: 'card',
  localField: '_id',
  foreignField: 'cardslistId'
});

const Cardslist = mongoose.model('cardslist', cardslistSchema);

module.exports = Cardslist;
