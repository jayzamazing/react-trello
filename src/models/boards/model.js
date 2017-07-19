'use strict';
import mongoose from 'mongoose';

//schema representing a board
const boardSchema = new mongoose.Schema({
  title: { type: String, required: true },
  cardsList: [{ type: mongoose.Schema.Types.ObjectId, ref: 'cardslist' }],
  createdAt: { type: Date, 'default': Date.now },
  updatedAt: { type: Date, 'default': Date.now },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'user' }
});
//format and return data
boardSchema.methods.apiRepr = function() {
  return {
    title: this.title,
    cardsList: this.cardsList,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};

const Board = mongoose.model('board', boardSchema);

module.exports = Board;
