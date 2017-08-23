'use strict';
import request from 'superagent';
import {
normalize,
arrayOf
} from 'normalizr';
import {
boardsSchema
} from './board-schema';

/*
* action to tell store that all boards has been retrieved
* @params boards - boards to be sent to store
* @returns action type and boards
*/
export const FIND_BOARDS_SUCCESS = 'FIND_BOARDS_SUCCESS';
export const findBoardsSuccess = boards => {
  //grab all boards array with cards and cardslist and normalize it
  const items = (normalize(boards, {
    boards: arrayOf(boardsSchema)
  })).entities;
  return {
    type: FIND_BOARDS_SUCCESS,
    items
  };
};
/*
* function to get all boards
* @params findBoardsSuccess or passed in action
* @dispatch findBoardsSuccess or passed in action
*/
export const getBoards = (action = findBoardsSuccess) => dispatch => {
  return request.get('/boards')
  .set('Accept', 'application/json')
    .then((res) => {
      if (!res.ok) return Promise.reject(res.statusText);
      dispatch(action(res.body));
    });
};
/*
* action to tell store that a board has been created
* @params boards - boards to be sent to store
* @returns action type and boards
*/
export const CREATE_BOARD_SUCCESS = 'CREATE_BOARD_SUCCESS';
export const createBoardSuccess = boards => {
  return {
    type: CREATE_BOARD_SUCCESS,
    boards
  };
};
/*
* function to create a board
* @params postData - boards to update on the board
* @params createBoardSuccess or passed in action
* @dispatch createBoardSuccess or passed in action
*/
export const createBoards = (postData, action = createBoardSuccess) => dispatch => {
  return request.post('/boards')
  .send(postData)
  .set('Accept', 'application/json')
    .then((res) => {
      if (!res.ok) return Promise.reject(res.statusText);
      dispatch(action(res.body));
    });
};
/*
* action to tell store that a board has been deleted
* @params id - id of the board to delete in the store
* @returns action type and boards
*/
export const DELETE_BOARD_SUCCESS = 'DELETE_BOARD_SUCCESS';
export const deleteBoardSuccess = id => {
  return {
    type: DELETE_BOARD_SUCCESS,
    boardId: id
  };
};
/*
* function to delete a board
* @params id - id of the board to delete
* @params deleteBoardSuccess or passed in action
* @dispatch deleteBoardSuccess or passed in action
*/
export const deleteBoards = (id, action = deleteBoardSuccess) => dispatch => {
  return request.delete(`/boards/${id}`)
    .then((res) => {
      if (!res.ok) return Promise.reject(res.statusText);
      dispatch(action(id));
    });
};
/*
* action to tell store that a board has been updated
* @params boards - boards to be sent to store
* @params id - id of the board to update in the store
* @returns action type and boards
*/
export const UPDATE_BOARD_SUCCESS = 'UPDATE_BOARD_SUCCESS';
export const updateBoardSuccess = function(id, boards) {
  return {
    type: UPDATE_BOARD_SUCCESS,
    boards,
    boardId: id
  };
};
/*
* function to update the board
* @params id - id of the board to update
* @params postData - boards to update on the board
* @params updateBoardSuccess or passed in action
* @dispatch updateBoardSuccess or passed in action
*/
export const updateBoards = (id, postData, action = updateBoardSuccess) => dispatch => {
  return request.put(`/boards/${id}`)
  .send(postData)
    .then((res) => {
      if (!res.ok) return Promise.reject(res.statusText);
      dispatch(action(id, postData));
    });
};
