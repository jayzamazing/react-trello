'use strict';
const cardslist = require('./cardslist');
const card = require('./card');
const board = require('./board');
const authentication = require('./authentication');
const user = require('./user');
const mongoose = require('mongoose');
module.exports = function() {
  const app = this;

  mongoose.connect(app.get('mongodb'));
  mongoose.Promise = global.Promise;

  app.configure(authentication);
  app.configure(user);
  app.configure(board);
  app.configure(card);
  app.configure(cardslist);
};
