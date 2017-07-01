'use strict';
import mongoose from 'mongoose';

//schema representing a board
const boardSchema = mongoose.Schema({
  title: { type: String, required: true },
  cardsList: [{ type: Schema.Types.ObjectId, ref: 'cardslist' }],
  createdAt: { type: Date, 'default': Date.now },
  updatedAt: { type: Date, 'default': Date.now },
  owner: { type: Schema.Types.ObjectId, ref: 'user' }
});

const boardModel = mongoose.model('board', boardSchema);

module.exports = boardModel;
