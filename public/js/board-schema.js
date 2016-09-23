/*
* Schema representing Boards
*/
import { Schema, arrayOf } from 'normalizr';
// [{
//     "id": 1,
//     "title": "blah",
//     "cardsList": [{
//         "id": 1,
//         "title": "something",
//         "cards": [{
//             "id": 1,
//             "text": "ummmm"
//         }, {
//             "id": 2,
//             "text": "food"
//         }]
//     }, {
//         "id": 2,
//         "title": "hungry",
//         "cards": [{
//             "id": 3,
//             "text": "special"
//         }, {
//             "id": 4,
//             "text": "taco"
//         }]
//     }]
// }, {
//     "id": 2,
//     "title": "shopping list",
//     "cardsList": [{
//         "id": 3,
//         "title": "groceries",
//         "cards": [{
//             "id": 5,
//             "text": "apple"
//         }, {
//             "id": 6,
//             "text": "pie"
//         }]
//     }, {
//         "id": 4,
//         "title": "clothes",
//         "cards": [{
//             "id": 7,
//             "text": "pants"
//         }, {
//             "id": 8,
//             "text": "shirt"
//         }]
//     }]
// }]
//define schema items
const boardsSchema = new Schema('boards');
const cardsListSchema = new Schema('cardsList');
const cardsSchema = new Schema('cards');

//A board has an array of card list
boardsSchema.define({
  cardsList: arrayOf(cardsListSchema)
});
//Each cardslist has an array of cards
cardsListSchema.define({
  cards: arrayOf(cardsSchema)
});

export {boardsSchema, cardsListSchema, cardsSchema};
