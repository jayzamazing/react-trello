var actions = require('./actions');
import { normalize, arrayOf } from 'normalizr';
import { boardsSchema } from './board-schema';
import Immutable from 'seamless-immutable';

const initialRepositoryState = Immutable({
  boards: [],
  cardsList: [],
  cards: []
});
function trelloReducer(state, action) {
  //TODO remove in the future
  state = state || initialRepositoryState;
  //reducer for adding a board
  if(action.type === actions.ADD_BOARD) {
    //return the previous state with the new board added to it
    return Object.assign(
      {}, state, {boards: state.boards.concat(action.board)}
    );
  //reducer for adding a b
  } else if(action.type === actions.ADD_BOARD_CARDLIST_ITEM) {
    console.log(state.boards[action.board]);
    console.log(state.boards[action.board].cardsList[action.id]);
    console.log(state.boards[action.board].cardsList[action.id].cards);
    return {
      ...state,
      [state.boards[action.board]]: {
        ...state.boards[action.board],
        cardsList: {
          ...state.boards[action.board].cardsList[action.id],
          cards: {
            ...state.boards[action.board].cardsList[action.id].cards,
            text: action.item
          }
        }
      }
    }
  //reducer for flattening nested board based on schema
  } else if (action.type === actions.BOARD_DESERIALIZATION) {
    //merge new entities into state
    const normalizedBoard = normalize(action, {
      boards: arrayOf(boardsSchema)
    });
    //merge new entities into state
    return state.merge(normalizedBoard.entities);
  }
  return state;
}
exports.trelloReducer = trelloReducer;
