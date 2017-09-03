import Immutable from 'seamless-immutable';
import * as BoardActions from './BoardActions';
const initialRepositoryState = Immutable({
  boards: {}
});

/*
* Function called when FIND_BOARDS_SUCCESS or CREATE_BOARD_SUCCESS is called to update boards with a new board
* params state- old state before merge
* params action- action with data to update state
*/
export const createBoard = (state, action) => state.merge({boards: action.items.boards});

/*
* Function to deal with deleting a board and removing it from state
* params state- old state before merge
* params action- action with data to update state
*/
const deleteBoard = (state, action) => Immutable({boards: Immutable.without(state.boards, action.boardId)});

/*
* Function to deal with using various reducer functions
* params state- old state before merge
* params action- action with data to modify state
*/
export const trelloReducer = (state, action) => {
  state = state || initialRepositoryState;
  // console.log(state.boards);
  switch (action.type) {
  case BoardActions.FIND_BOARDS_SUCCESS:
  case BoardActions.CREATE_BOARD_SUCCESS:
    return createBoard(state, action);
  case BoardActions.DELETE_BOARD_SUCCESS:
    return deleteBoard(state, action);
  }
};
