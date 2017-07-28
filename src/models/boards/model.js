'use strict';
import mongoose from 'mongoose';
import {Cardslist} from '../cardslist';

var options = {
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
  return {
    title: this.title,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
    cardslists: this.cardslists
  };
};
// populate all cardslist
boardSchema.virtual('cardslists', {
  ref: 'cardslist',
  localField: '_id',
  foreignField: 'boardId'
});

const Board = mongoose.model('board', boardSchema);

module.exports = Board;
