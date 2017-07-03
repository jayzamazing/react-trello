'use strict';
import path from 'path';
import Express from 'express';
import userModel from './models/users.js';
import boardModel from './models/boards.js';
import cardModel from './models/cards.js';
import cardslistModel from './models/cardslist';
import bodyParser from 'body-parser';
const app = Express();
app.use(Express.static(path.join(__dirname, '../static')));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.get('*', (req, res) => {
  if (req.url.includes('.css')) {
    res.sendFile(path.resolve(__dirname, '../static/css' + req.url));
  } else if(req.url.includes('.js')) {
    res.sendFile(path.resolve(__dirname, '../static/js' + req.url));
  } else {
    res.sendFile(path.join(__dirname, '../static/index.html'));
  }
});
app.post('/users', (req, res) => {
  userModel.create(req.body)
  .then(users => res.status(201).json(users.apiRepr()))
  .catch(err => console.error(err));
});
export default app;
