// var actions = require('./actions');//TODO
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
  if (normalizedBoard.entities.boards) {
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
  if (normalizedBoard.entities.boards && action.type == 'DELETE_BOARD_SUCCESS') {
//remove it from state and store in newstate
    newState.boards = Immutable.without(state.boards,
Object.keys(normalizedBoard.entities.boards));
  } else {
    newState.boards = state.boards;
  }
//if there is a cardsList
  if (normalizedBoard.entities.cardsList && action.type == 'DELETE_CARDSLIST_SUCCESS') {
//remove it from state and store in newstate
    newState.cardsList = Immutable.without(state.cardsList,
Object.keys(normalizedBoard.entities.cardsList));
  } else {
    newState.cardsList = state.cardsList;
  }
//if there is a card
  if (normalizedBoard.entities.cards && action.type == 'DELETE_CARDS_SUCCESS') {
//remove it from state and store in newstate
    newState.cards = Immutable.without(state.cards,
Object.keys(normalizedBoard.entities.cards));
  } else {
    newState.cards = state.cards;
  }
  return state = Immutable({
    boards: newState.boards || {},
    cardsList: newState.cardsList || {},
    cards: newState.cards || {}
  });
}

function updateBoard(state, action) {
//normalize boards
  const normalizedBoard = normalize(action, {
    boards: boardsSchema
  });
//create empty object
  var newState = {};
//if there is a board
  if (normalizedBoard.entities.boards && action.type == 'UPDATE_BOARD_SUCCESS') {
//remove it from state and store in newstate
    newState.boards = Immutable.update(state.boards,
Object.keys(normalizedBoard.entities.boards),
function() {
  return normalizedBoard.entities.boards[Object.keys(normalizedBoard.entities.boards)];
});
  } else {
    newState.boards = state.boards;
  }
//if there is a cardsList
  if (normalizedBoard.entities.cardsList && action.type == 'UPDATE_CARDSLIST_SUCCESS') {
//remove it from state and store in newstate
    newState.cardsList = Immutable.update(state.cardsList,
Object.keys(normalizedBoard.entities.cardsList),
function() {
  return normalizedBoard.entities.cardsList[Object.keys(normalizedBoard.entities.cardsList)];
});
  } else {
    newState.cardsList = state.cardsList;
  }
//if there is a card
  if (normalizedBoard.entities.cards && action.type == 'UPDATE_CARDS_SUCCESS') {
//remove it from state and store in newstate
    newState.cards = Immutable.update(state.cards,
Object.keys(normalizedBoard.entities.cards),
function() {
  return normalizedBoard.entities.cards[Object.keys(normalizedBoard.entities.cards)];
});
  } else {
    newState.cards = state.cards;
  }
  return state = Immutable({
    boards: newState.boards || {},
    cardsList: newState.cardsList || {},
    cards: newState.cards || {}
  });
}

function trelloReducer(state, action) {
  state = state || initialRepositoryState;
  switch (action.type) {
  case 'FIND_BOARDS_SUCCESS':
    return deserialize(state, action);
  case 'CREATE_BOARD_SUCCESS':
  case 'CREATE_CARDLIST_SUCCESS':
  case 'CREATE_CARD_SUCCESS':
    return createBoard(state, action);
  case 'DELETE_BOARD_SUCCESS':
  case 'DELETE_CARDSLIST_SUCCESS':
  case 'DELETE_CARDS_SUCCESS':
    return deleteBoard(state, action);
  case 'UPDATE_BOARD_SUCCESS':
  case 'UPDATE_CARDSLIST_SUCCESS':
  case 'UPDATE_CARDS_SUCCESS':
    return updateBoard(state, action);
  default:
    return state;
  }
}
exports.trelloReducer = trelloReducer;
