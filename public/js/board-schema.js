/*
* Schema representing Boards
*/
import {Schema, arrayOf} from 'normalizr';
// boards: {
//     blah: {
//         cardsList: [{
//             title: 'something',
//             cards: [{
//                 text: 'ummmm'
//             }, {
//                 text: 'food'
//             }]
//         }, {
//             title: 'hungry',
//             cards: [{
//                 text: 'special'
//             }, {
//                 text: 'taco'
//             }]
//         }]
//     },
//     'shopping list': {
//         cardsList: [{
//             title: 'groceries',
//             cards: [{
//                 text: 'apple'
//             }, {
//                 text: 'pie'
//             }]
//         }, {
//             title: 'clothes',
//             cards: [{
//                 text: 'pants'
//             }, {
//                 text: 'shirt'
//             }]
//         }]
//     }
// }
//define schema items
const boardsSchema = Schema('boards');
const cardsListSchema = Schema('cardsList');
const cardsSchema = Schema('cards');

//A board has an array of card list
boardsSchema.define({
  cardsList: arrayOf(cardsListSchema)
});
//Each cardslist has an array of cards
cardsSchema.define({
  cards: arrayOf(cardsSchema)
});

export {boardsSchema, cardsListSchema, cardsSchema};
