import Immutable from 'seamless-immutable';

const initialRepositoryState = Immutable({
  boards: {}
});

/*
* Function called when FIND_BOARDS_SUCCESS or CREATE_BOARD_SUCCESS is called to update boards with a new board
* params state- old state before merge
* params action- action with data to update state
*/
export const createBoard = (state, action) => state.merge(action.items.boards);

/*
* Function to deal with deleting a board and removing it from state
* params state- old state before merge
* params action- action with data to update state
*/
// const deleteBoard = (state, action) => state

/*
* Function to deal with using various reducer functions
* params state- old state before merge
* params action- action with data to modify state
*/
export const boardReducer = (state, action) => {
  state = initialRepositoryState || state;
  switch (action.type) {
  case 'FIND_BOARDS_SUCCESS':
  case 'CREATE_BOARD_SUCCESS':
    return createBoard(state, action);
  }
};
