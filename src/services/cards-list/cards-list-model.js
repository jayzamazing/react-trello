'use strict';

// cards-list-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const cards-listSchema = new Schema({
  id: { type: Number, required: true },
  title: { type: String, required: true },
  cards: [{ type: Number, ref: 'card' }],
  createdAt: { type: Date, 'default': Date.now },
  updatedAt: { type: Date, 'default': Date.now }
});

const cards-listModel = mongoose.model('cards-list', cards-listSchema);

module.exports = cards-listModel;
