'use strict';
//get dependencies
require('isomorphic-fetch');
/*
* Should be able to add a board to list of boards
*/
var ADD_BOARD = 'ADD_BOARD';
var addBoard = function(boardName) {
  return {
    type: ADD_BOARD,
    board: boardName
  };
};
var ADD_BOARD_CARDLIST_ITEM = 'ADD_BOARD_CARDLIST_ITEM';
var addBoardCardListItem = function(boardName, id, itemName) {
  return {
    type: ADD_BOARD_CARDLIST_ITEM,
    board: boardName,
    id: id,
    item: itemName
  };
};
var BOARD_DESERIALIZATION = 'BOARD_DESERIALIZATION';
var boardDeserialization = function(boards) {
  return {
    type: 'BOARD_DESERIALIZATION',
    boards: boards
  };
};
var CREATE_BOARD_SUCCESS = 'CREATE_BOARD_SUCCESS';
var createBoardSuccess = function(data) {
  return {
    type: 'CREATE_BOARD_SUCCESS',
    title: data.title,
    _id: data._id
  }
}
/*
* Function to create a single board
* @return dispatch function
*/
var createBoard = function(name) {
      return function(dispatch) {
        return fetch('http://localhost:3030/boards',
        {
          method: 'PUT',
          body: JSON.stringify({
            title: name
          })
        }).then((res) => {
          if (res.status < 200 || res.status >= 300) {
            var error = new Error(response.statusText);
            error.response = res;
            throw error;
          }
          return res.json();
        })
          .then(json => dispatch(createBoardSuccess(json.body)))
      };
};


exports.ADD_BOARD = ADD_BOARD;
exports.addBoard = addBoard;
exports.ADD_BOARD_CARDLIST_ITEM = ADD_BOARD_CARDLIST_ITEM;
exports.addBoardCardListItem = addBoardCardListItem;
exports.BOARD_DESERIALIZATION = BOARD_DESERIALIZATION;
exports.boardDeserialization = boardDeserialization;
exports.createBoard = createBoard;
exports.CREATE_BOARD_SUCCESS = CREATE_BOARD_SUCCESS;
exports.createBoardSuccess = createBoardSuccess;
