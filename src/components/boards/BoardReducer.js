import Immutable from 'seamless-immutable';
import * as BoardActions from './BoardActions';
const initialRepositoryState = Immutable({
  boards: {}
});

/*
* Function called when FIND_BOARDS_SUCCESS or CREATE_BOARD_SUCCESS is called to update boards with a new board
* params state- old state before merge
* params action.items.boards- boards to add to the state
*/
export const createBoard = (state, action) => state.merge({boards: action.items.boards});

/*
* Function called when DELETE_BOARD_SUCCESS is called to deal with deleting a board and removing it from state
* params state- old state before merge
* params action.boardid- board to delete
*/
export const deleteBoard = (state, action) => Immutable({boards: Immutable.without(state.boards, action.boardId)});

/*
* Function called when FIND_BOARDS_SUCCESS or CREATE_BOARD_SUCCESS is called to update boards with a new board
* params state- old state before merge
* params action.items.boards- boards to update
*/
export const updateBoard = (state, action) => Immutable({boards: Immutable.update(state.boards,
Object.keys(action.items.boards), () => action.items.boards[Object.keys(action.items.boards)])});

/*
* Function to deal with using various reducer functions
* params state- old state before merge
* params action- action with data to modify state
*/
export const trelloReducer = (state, action) => {
  state = state || initialRepositoryState;
  switch (action.type) {
  case BoardActions.FIND_BOARDS_SUCCESS:
  case BoardActions.CREATE_BOARD_SUCCESS:
    return createBoard(state, action);
  case BoardActions.DELETE_BOARD_SUCCESS:
    return deleteBoard(state, action);
  case BoardActions.UPDATE_BOARD_SUCCESS:
    return updateBoard(state, action);
  }
};
