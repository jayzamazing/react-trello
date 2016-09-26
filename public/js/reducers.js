var actions = require('./actions');
import { normalize, arrayOf } from 'normalizr';
import { boardsSchema } from './board-schema';
import Immutable from 'seamless-immutable';

const initialRepositoryState = Immutable({
  boards: [],
  cardsList: [],
  cards: []
});
function deserialize(state, action) {
  //merge new entities into state
  const normalizedBoard = normalize(action, {
    boards: arrayOf(boardsSchema)
  });
  //merge new entities into state
  return state.merge(normalizedBoard.entities);
}

function trelloReducer(state, action) {
  //TODO remove in the future
  state = state || initialRepositoryState;
  //reducer for adding a board
  if (action.type === actions.CREATE_BOARD_SUCCESS) {//TODO concat to state
    return deserialize(state, action);
  //reducer for adding a b
  } else if (action.type === actions.BOARD_DESERIALIZATION) {
    return deserialize(state, action);
  }
  return state;
}
exports.trelloReducer = trelloReducer;
