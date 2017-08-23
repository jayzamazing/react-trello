'use strict';
import faker from 'faker';

export const seedBoards = function(count, title = faker.random.words()) {
  if (count != 0) {
    let boards = [];
    for (var i = 0; i < count; i++) {
      boards.push({
        _id: faker.random.alphaNumeric(20),
        title: faker.random.words(),
        cardsList: seedCardslists(count)
      });
    }
    return {
      boards
    };
  } else {
    let _id = faker.random.alphaNumeric(20);
    return {
      title: title,
      _id: _id
    };
  }
};
export const seedCardslists = function(count, title = faker.random.words()) {
  let _id = faker.random.alphaNumeric(20);
  if (count != 0) {
    let cardslist = [];
    for (var i = 0; i < count; i++) {
      cardslist.push({
        _id: faker.random.alphaNumeric(20),
        title: faker.random.words(),
        cards: seedCards(count)
      });
    }
    return cardslist;
  } else {
    return {
      title: title,
      _id: _id
    };
  }
};
export const seedCards = function(count, text = faker.random.words()) {
  let _id = faker.random.alphaNumeric(20);
  if (count != 0) {
    let cards = [];
    for (var i = 0; i < count; i++) {
      cards.push({
        _id: faker.random.alphaNumeric(20),
        text: faker.random.words()
      });
    }
    return cards;
  } else {
    return {
      text: text,
      _id: _id
    };
  }
};
