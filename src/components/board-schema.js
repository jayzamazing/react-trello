/*
* Schema representing Boards
*/
import { Schema, arrayOf } from 'normalizr';

//define schema items
const boardsSchema = new Schema('boards', { idAttribute: '_id' });
const cardsListSchema = new Schema('cardslist', { idAttribute: '_id' });
const cardsSchema = new Schema('cards', { idAttribute: '_id' });

//A board has an array of card list
boardsSchema.define({
  cardsList: arrayOf(cardsListSchema)
});
//Each cardslist has an array of cards
cardsListSchema.define({
  cards: arrayOf(cardsSchema)
});

export {boardsSchema, cardsListSchema, cardsSchema};
