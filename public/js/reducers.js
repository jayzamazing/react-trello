var actions = require('./actions');
import { normalize, arrayOf } from 'normalizr';
import { boardsSchema } from './board-schema';
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
function mergeOld(state, action) {
  const normalizedBoard = normalize(action, {
    boards: arrayOf(boardsSchema)
  });
  var temp = initialRepositoryState.merge(normalizedBoard.entities);
  var newState = {};
  newState.boards = state.boards.merge(temp.boards);
  newState.cardsList = state.cardsList.merge(temp.cardsList);
  newState.cards = state.cards.merge(temp.cards);
  return state.merge(newState);
}
function trelloReducer(state, action) {
  state = state || initialRepositoryState;
  //reducer for adding a board
  if (action.type === actions.BOARD_DESERIALIZATION ||
    action.type === actions.FIND_BOARDS_SUCCESS) {
    return deserialize(state, action);
  //reducer for adding a b
} else if (action.type === actions.CREATE_BOARD_SUCCESS) {//TODO getting called twice, check action
    return mergeOld(state, action);
  } else {
    return state;
  }
}
exports.trelloReducer = trelloReducer;
