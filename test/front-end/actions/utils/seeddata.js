'use strict';
import faker from 'faker';

export const seedBoards = function(title = faker.random.words(), _id = faker.random.alphaNumeric(20),
cltitle, cl_id, ctitle, c_id) {
  let cardslists = cltitle ? cardslists(cltitle, cl_id, ctitle, c_id) : null;
  return {
    title: title,
    _id: _id,
    cardslists: [cardslists]
  };
};
export const seedCardslists = function(title = faker.random.words(), _id = faker.random.alphaNumeric(20),
ctitle, c_id) {
  let cards = ctitle ? cards(ctitle, c_id) : null;
  return {
    title: title,
    _id: _id,
    cards: []
  };
};
export const seedCards = function(text = faker.random.words(), _id = faker.random.alphaNumeric(20)) {
  return {
    text: text,
    _id: _id
  };
};
