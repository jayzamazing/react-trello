'use strict';
const {Board} = require('../models/boards');
const {User} = require('../models/users');
const {Card} = require('../models/cards');
const {Cardslist} = require('../models/cardslist');
const data = require('./generatedData');
//create multiple boards
const createBoards = userId => {
const seedData = [];
//create and store random titles
for (let index = 0; index < data.boards.length; index++) {
  seedData.push(data.boards[index]);
  seedData[index].owner = userId;
}
//wait for all actions to complete before continuing
return Promise.all(seedData)
.then(seed => {
  return Board.insertMany(seed);
});
};
//create multiple cardslist
const createCardslist = (userId, boards) => {
const seedData = [];
//create and store random titles
for (let index = 0; index < data.cardslist.length; index++) {
  seedData.push(data.cardslist[index]);
  seedData[index].owner = userId;
  seedData[index].boardId = boards[0]._id;
}
//wait for all actions to complete before continuing
return Promise.all(seedData)
.then(seed => {
  return Cardslist.insertMany(seed);
});
};
//create multiple cards
const createCards = (userId, cardslist) => {
const seedData = [];
//create and store random text
cardslist.forEach((cardslistItem, index) => {
  data.cards[index].forEach(item => {
    seedData.push({cardslistId: cardslistItem._id, owner: userId, title: item.title, text: item.text});
  });
});

//wait for all actions to complete before continuing
return Promise.all(seedData)
.then(seed => {
  return Card.insertMany(seed);
});
};
module.exports = {createBoards, createCardslist, createCards};
