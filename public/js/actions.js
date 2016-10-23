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

var FIND_BOARDS_SUCCESS = 'FIND_BOARDS_SUCCESS';
var findBoardsSuccess = function(data) {
  return {
    type: FIND_BOARDS_SUCCESS,
    boards: data
  };
};
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
var boardDeserialization = function(data) {
  return {
    type: 'BOARD_DESERIALIZATION',
    boards: data
  };
};
var CREATE_BOARD_SUCCESS = 'CREATE_BOARD_SUCCESS';
var createBoardSuccess = function(data) {
  var boards = {};
  boards.boards = data;
  return {
    type: 'CREATE_BOARD_SUCCESS',
    boards: boards
  };
};
var CREATE_CARDLIST_SUCCESS = 'CREATE_CARDLIST_SUCCESS';
var createCardListSuccess = function(data) {
  var boards = {};
  boards.boards = data;
  return {
    type: 'CREATE_CARDLIST_SUCCESS',
    boards: boards
  };
};
  /*
   * Function to deal with queries to mongo and calling actions
   * @params method - either PUT, GET, DELETE, FIND, POST, PATCH
   * @params method - method of query to use
   * @params postData - data to send in the query
   * @params type - type of request
   * @params updateItem - id of specific item to update
   * @return promise dispatch function based on type of query
   */
var queries = function(service, method, postData, type, updateItem) {
 return function(dispatch) {
   if (service === 'boards') {
     return queryBoards(method, postData, type, updateItem)
     .then(res =>
       {
         dispatch(types(type, res, dispatch));
       });
     } else if (service === 'cardslists') {
       return queryCardsLists(method, postData, type, updateItem)
       .then(res => {
         dispatch(types(type, res, dispatch));
       });
   }
 }
}
var queryBoards = function(method, postData, type, updateItem) {
  return new Promise((resolve, reject) => {
    services('boards', method, postData, updateItem)
    .then(res => {
      resolve(res.data || res);
    });
  });
  // return function(dispatch) {
  //   //call services to make services rest call
  //   return services('boards', method, postData, updateItem)
  //       //get the data
  //       .then(res =>
  //         {
  //           var data = res || res.data;
  //           dispatch(types(type, data, dispatch));
  //         }
  //     );
  // };
};
var queryCardsLists = function(method, postData, type, updateItem) {
  return new Promise((resolve, reject) => {
    //call services to make services rest call
    services('cardslists', method, postData, updateItem)
    //get the data
    .then(res => {
      if (method === 'POST') {
        services('boards', 'PATCH', { '$push': { 'cardsList': res._id } }, updateItem)
        .then(res2 => {
          resolve(res2);
        });
      }
    });
  });
}
  /*
   * Function to determine which action to dispatch next based on type
   * @params type - type of request
   * @params json - data passed in to pass to dispatch
   * @params dispatch - action to dispatch
   * @return action to dispatch
   */
var types = function(type, json) {
  switch (type) {
  case 'create board':
    return createBoardSuccess(json);
  case 'create cardslist':
    return createCardListSuccess(json);
  case 'find boards':
    return findBoardsSuccess(json);
  }
};
  /*
   * Function to determine which feathers rest service to run
   * @params service - name of mongodb document to query
   * @params method - method of query to use
   * @params postData - data to send in the query
   * @params updateItem - id of specific item to update
   * @return promise from feathers rest
   */
var services = function(service, method, postData, updateItem) {
  //switch based on method
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
};
exports.ADD_BOARD_CARDLIST_ITEM = ADD_BOARD_CARDLIST_ITEM;
exports.addBoardCardListItem = addBoardCardListItem;
exports.BOARD_DESERIALIZATION = BOARD_DESERIALIZATION;
exports.boardDeserialization = boardDeserialization;
exports.queries = queries;
exports.CREATE_BOARD_SUCCESS = CREATE_BOARD_SUCCESS;
exports.createBoardSuccess = createBoardSuccess;
exports.CREATE_CARDLIST_SUCCESS = CREATE_CARDLIST_SUCCESS;
exports.createCardListSuccess = createCardListSuccess;
exports.FIND_BOARDS_SUCCESS = FIND_BOARDS_SUCCESS;
exports.findBoardsSuccess = findBoardsSuccess;
