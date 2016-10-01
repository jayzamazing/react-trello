'use strict';

// board-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const boardSchema = new Schema({
  // _id: { type: Number, required: true },
  title: { type: String, required: true },
  cardsList: [{ type: String, ref: 'cardslist' }],
  createdAt: { type: Date, 'default': Date.now },
  updatedAt: { type: Date, 'default': Date.now }
});

const boardModel = mongoose.model('board', boardSchema);

module.exports = boardModel;
