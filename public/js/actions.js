'use strict';
//get dependencies
require('isomorphic-fetch');
import feathers from 'feathers/client';
import hooks from 'feathers-hooks';
import rest from 'feathers-rest/client';
const superagent = require('superagent');
var host, app;
host = 'http://localhost:3030';
//set up feathers client side
app = feathers()
.configure(rest(host).superagent(superagent))
.configure(hooks());
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
var CREATE_CARD_SUCCESS = 'CREATE_CARD_SUCCESS';
var createCardSuccess = function(data) {
  return function(dispatch) {return {
    type: 'CREATE_CARD_SUCCESS',
    boards: data
  }}
}
/*
* Function to create a single board
* @params method - either PUT, GET, DELETE, or FIND
* @return dispatch function based on type of query
*/
var queryBoards = function(service, method, postData, type, updateItem) {
  return function(dispatch) {
    return services(service, method, postData, updateItem)
    .then((res) => res.body)
      .then(json => dispatch(types(type, json, dispatch)));

  };
}
var types = function(type, json, dispatch) {
  switch(type) {
    case 'create board':
      return dispatch(createBoardSuccess(json));
    case 'create cardslist':
      //create a wrapper adding board id to update
      var boards = {};
      boards['boards'] = json.body;
      boards['_id'] = boardId;
      return dispatch(queryBoards('PUT', json, 'create cardslist2'));
    case 'create cardslist2':
      return dispatch(createCardSuccess(json));

  };
}
var services = function(service, method, postData, updateItem) {
  switch (method) {
    case 'PUT':
      return app.service(service).update(updateItem, postData);
    case 'GET':
      return app.service(service).get(postData);
    case 'DELETE':
      return app.service(service).remove(updateItem, postData);
    case 'FIND':
      return app.service(service).find();
    case 'POST':
      return app.service(service).create(postData);
    case 'PATCH':
      return app.service(service).patch(updateItem, postData);
  }
}
exports.ADD_BOARD_CARDLIST_ITEM = ADD_BOARD_CARDLIST_ITEM;
exports.addBoardCardListItem = addBoardCardListItem;
exports.BOARD_DESERIALIZATION = BOARD_DESERIALIZATION;
exports.boardDeserialization = boardDeserialization;
exports.queryBoards = queryBoards;
exports.CREATE_BOARD_SUCCESS = CREATE_BOARD_SUCCESS;
exports.createBoardSuccess = createBoardSuccess;
