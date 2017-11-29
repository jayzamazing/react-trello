'use strict';
const mongoose = require('mongoose');

const options = {
  toObject: {getters: true},
  toJSON: {getters: true}
};
//schema representing a board
const boardSchema = new mongoose.Schema({
  title: { type: String, required: true },
  createdAt: { type: Date, 'default': Date.now },
  updatedAt: { type: Date, 'default': Date.now },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'user' }
}, options);
//format and return data
boardSchema.methods.apiRepr = function() {
  let cardslist;
  //if there is a cardslist the format it, otherwise make it null
  cardslist = this.cardslist ? this.cardslist.map(cardslist => cardslist.apiRepr()) : null;
  return {
    _id: this._id,
    title: this.title,
    cardslist: cardslist
  };
};
// populate all cardslist
boardSchema.virtual('cardslist', {
  ref: 'cardslist',
  localField: '_id',
  foreignField: 'boardId'
});

const Board = mongoose.model('board', boardSchema);

module.exports = {Board};
