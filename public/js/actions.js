'use strict';
//get dependencies
require('isomorphic-fetch');
/*
* Should be able to add a board to list of boards
*/
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
  var boards = {};
  boards[boards] = data;
  return {
    type: 'CREATE_BOARD_SUCCESS',
    boards: data
  }
}
/*
* Function to create a single board
* @params method - either PUT, GET, DELETE, or FIND
* @return dispatch function based on type of query
*/
var queryBoards = function(method, params, type) {
      return function(dispatch) {
        var url, baseUrl = 'http://localhost:3030/boards/';
        //switch to deal with method mappings in feathersjs
        switch(method) {
          case 'PUT':
          case 'GET':
          case 'DELETE':
            url = baseUrl + '1';
            break;
          case 'FIND':
            method = 'GET';
          default:
            url = baseUrl;
            break;
        }
        return fetch(url,
        {
          method: method,
          body: JSON.stringify(params)
        }).then((res) => {
          if (res.status < 200 || res.status >= 300) {
            var error = new Error(response.statusText);
            error.response = res;
            throw error;
          }
          return res.json();
        })
          .then(json => {
            switch(type) {
              case 'create board':
                dispatch(createBoardSuccess(json.body));
                break;
              case 'create cardslist':
                dispatch(queryBoards())
              case 'create cardslist2':
                dispatch(createCardSuccess(json.body));
                break;
            }
          })
      };
};
exports.ADD_BOARD_CARDLIST_ITEM = ADD_BOARD_CARDLIST_ITEM;
exports.addBoardCardListItem = addBoardCardListItem;
exports.BOARD_DESERIALIZATION = BOARD_DESERIALIZATION;
exports.boardDeserialization = boardDeserialization;
exports.queryBoards = queryBoards;
exports.CREATE_BOARD_SUCCESS = CREATE_BOARD_SUCCESS;
exports.createBoardSuccess = createBoardSuccess;
