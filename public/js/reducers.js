var actions = require('./actions');
import {
  normalize,
  arrayOf
} from 'normalizr';
import {
  boardsSchema
} from './board-schema';
import Immutable from 'seamless-immutable';

const initialRepositoryState = Immutable({
  boards: {},
  cardsList: {},
  cards: {}
});

function deserialize(state, action) {
  const normalizedBoard = normalize(action, {
    boards: arrayOf(boardsSchema)
  });
  //merge new entities into state
  return state.merge(normalizedBoard.entities);
}
/*
* Function to deal with creating a board, cardslist, or card and
* adding it to state
* params state- old state before merge
* params action- action with data to update state
*/
function createBoard(state, action) {
  //normalize boards
  const normalizedBoard = normalize(action, {
    boards: boardsSchema
  });
  //create empty object
  var newState = {};
  //if there is a board
  if (normalizedBoard.entities.boards){
    //merge and store in newstate
    newState.boards = state.boards.merge(normalizedBoard.entities.boards);
  }
  //if there is a cardsList
  if (normalizedBoard.entities.cardsList) {
    //merge and store in newstate
    newState.cardsList = state.cardsList.merge(normalizedBoard.entities.cardsList);
  }
  //if there is a card
  if (normalizedBoard.entities.cards) {
    //merge and store in newstate
    newState.cards = state.cards.merge(normalizedBoard.entities.cards);
  }
  return state.merge(newState);
}
/*
* Function to deal with deleting a board, cardslist or card
* and removing it from state
* params state- old state before merge
* params action- action with data to update state
*/
function deleteBoard(state, action) {
  //normalize boards
  const normalizedBoard = normalize(action, {
    boards: boardsSchema
  });
  //create empty object
  var newState = {};
  //if there is a board
  if (normalizedBoard.entities.boards){
    //remove it from state and store in newstate
    newState.boards = Immutable.without(state.boards,
        Object.keys(normalizedBoard.entities.boards));
  }
  //if there is a cardsList
  if (normalizedBoard.entities.cardsList) {
    //remove it from state and store in newstate
    newState.cardsList = Immutable.without(state.cardsList,
       Object.keys(normalizedBoard.entities.boards));
  }
  //if there is a card
  if (normalizedBoard.entities.cards) {
    //remove it from state and store in newstate
    newState.cards = Immutable.without(state.cards,
       Object.keys(normalizedBoard.entities.cards));
  }
  return state = Immutable({
    boards: newState.boards || {},
    cardsList: newState.cardsList || {},
    cards: newState.cards || {}
  });
}

function trelloReducer(state, action) {
  state = state || initialRepositoryState;
  //reducer for adding a board
  if (action.type === actions.BOARD_DESERIALIZATION ||
    action.type === actions.FIND_BOARDS_SUCCESS) {
    return deserialize(state, action);
    //reducer for adding a b
  } else if (action.type === actions.CREATE_BOARD_SUCCESS ||
    action.type === actions.CREATE_CARDLIST_SUCCESS ||
    action.type === actions.CREATE_CARD_SUCCESS) {
    return createBoard(state, action);
  } else if (action.type === actions.DELETE_BOARD_SUCCESS ||
    action.type === actions.DELETE_CARDSLIST_SUCCESS ||
    action.type === action.type === actions.DELETE_CARDS_SUCCESS) {
    return deleteBoard(state, action);
  } else {
    return state;
  }
}
exports.trelloReducer = trelloReducer;
