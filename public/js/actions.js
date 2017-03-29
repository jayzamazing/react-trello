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
var BOARD_DESERIALIZATION = 'BOARD_DESERIALIZATION';
var boardDeserialization = function(data) {
  return {
    type: 'BOARD_DESERIALIZATION',
    boards: data
  };
};
var CREATE_BOARD_SUCCESS = 'CREATE_BOARD_SUCCESS';
var createBoardSuccess = function(data) {
  // var boards = {};
  // boards.boards = data;
  return {
    type: 'CREATE_BOARD_SUCCESS',
    boards: data
  };
};
var DELETE_BOARD_SUCCESS = 'DELETE_BOARD_SUCCESS';
var deleteBoardSuccess = function(data) {
  // var boards = {};
  // boards.boards = data;
  return {
    type: 'DELETE_BOARD_SUCCESS',
    boards: data
  };
};
var UPDATE_BOARD_SUCCESS = 'UPDATE_BOARD_SUCCESS';
var updateBoardSuccess = function(data) {
  // var boards = {};
  // boards.boards = data;
  return {
    type: 'UPDATE_BOARD_SUCCESS',
    boards: data
  };
};
var CREATE_CARDLIST_SUCCESS = 'CREATE_CARDLIST_SUCCESS';
var createCardListSuccess = function(data) {
  // var boards = {};
  // boards.boards = data;
  return {
    type: 'CREATE_CARDLIST_SUCCESS',
    boards: data
  };
};
var DELETE_CARDSLIST_SUCCESS = 'DELETE_CARDSLIST_SUCCESS';
var deleteCardslistSuccess = function(data) {
  // var boards = {};
  // boards.boards = data;
  return {
    type: 'DELETE_CARDSLIST_SUCCESS',
    boards: data
  };
};
var UPDATE_CARDSLIST_SUCCESS = 'UPDATE_CARDSLIST_SUCCESS';
var updateCardsListSuccess = function(data) {
  // var boards = {};
  // boards.boards = data;
  return {
    type: 'UPDATE_CARDSLIST_SUCCESS',
    boards: data
  };
}
var CREATE_CARD_SUCCESS = 'CREATE_CARD_SUCCESS';
var createCardSuccess = function(data) {
  // var boards = {};
  // boards.boards = data;
  return {
    type: 'CREATE_CARD_SUCCESS',
    boards: data
  };
};
var DELETE_CARDS_SUCCESS = 'DELETE_CARDS_SUCCESS';
var deleteCardsSuccess = function(data) {
  // var boards = {};
  // boards.boards = data;
  return {
    type: 'DELETE_CARDS_SUCCESS',
    boards: data
  };
};
var UPDATE_CARDS_SUCCESS = 'UPDATE_CARDS_SUCCESS';
var updateCardsSuccess = function(data) {
  // var boards = {};
  // boards.boards = data;
  return {
    type: 'UPDATE_CARDS_SUCCESS',
    boards: data
  };
}
  /*
   * Function to deal with queries to mongo and calling actions
   * @params method - either PUT, GET, DELETE, FIND, POST, PATCH
   * @params method - method of query to use
   * @params postData - data to send in the query
   * @params type - type of request
   * @params updateItem - id of specific item to update
   * @return promise dispatch function based on type of query
   */
var queries = function(service, method, postData, type, updateItem, updateItem2) {
 return function(dispatch) {
   switch(service) {
     case 'boards':
       return queryBoards(method, postData, type, updateItem)
       .then(res =>
         {
           dispatch(types(type, res, dispatch));
         });
       break;
      case 'cardslists':
        return queryCardsLists(method, postData, type, updateItem)
        .then(res => {
          dispatch(types(type, res, dispatch));
        });
        break;
      case 'cards':
        return queryCards(method, postData, type, updateItem, updateItem2)
        .then(res => {
          dispatch(types(type, res, dispatch));
        });
        break;
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
};
var queryCardsLists = function(method, postData, type, updateBoard) {
  return new Promise((resolve, reject) => {
    //call services to make rest call
    services('cardslists', method, postData, updateBoard)
    //get the data
    .then(res => {
      if (method === 'POST') {
        services('boards', 'PATCH', { '$push': { 'cardsList': res._id } }, updateBoard)
        .then(res2 => {
          resolve(res2);
        });
      } else if (method === 'DELETE' || method === 'PUT') {
        resolve(res.data || res);
      }
    });
  });
}
var queryCards = function(method, postData, type, updateCardslists, updateBoard) {
  return new Promise((resolve, reject) => {
    //call services to make rest call
    services('cards', method, postData, updateCardslists)
    //get the data
    .then(res => {
      if (method === 'POST') {
        services('cardslists', 'PATCH', { '$push': {'cards': res._id } }, updateCardslists)
        .then(res2 => {
          services('boards', 'GET', updateBoard)
          .then(res3 => {
            resolve(res3.data || res3);
          });
        });
      } else if (method === 'DELETE' || method === 'PUT') {
        resolve(res.data || res);
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
  case 'delete board':
    return deleteBoardSuccess(json);
  case 'update board':
    return updateBoardSuccess(json);
  case 'create cardslist':
    return createCardListSuccess(json);
  case 'delete cardslist':
    return deleteCardslistSuccess(json);
  case 'update cardslist':
    return updateCardsListSuccess(json);
  case 'find boards':
    return findBoardsSuccess(json);
  case 'create cards':
    return createCardSuccess(json);
  case 'delete cards':
    return deleteCardsSuccess(json);
  case 'update cards':
    return updateCardsSuccess(json);
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
    return app.service(service).remove(postData);
  case 'FIND':
    return app.service(service).find();
  case 'POST':
    return app.service(service).create(postData);
  case 'PATCH':
    return app.service(service).patch(updateItem, postData);
  }
};
exports.BOARD_DESERIALIZATION = BOARD_DESERIALIZATION;
exports.boardDeserialization = boardDeserialization;
exports.queries = queries;
exports.CREATE_BOARD_SUCCESS = CREATE_BOARD_SUCCESS;
exports.createBoardSuccess = createBoardSuccess;
exports.DELETE_BOARD_SUCCESS = DELETE_BOARD_SUCCESS;
exports.deleteBoardSuccess = deleteBoardSuccess;
exports.UPDATE_BOARD_SUCCESS = UPDATE_BOARD_SUCCESS;
exports.updateBoardSuccess = updateBoardSuccess;
exports.CREATE_CARDLIST_SUCCESS = CREATE_CARDLIST_SUCCESS;
exports.createCardListSuccess = createCardListSuccess;
exports.DELETE_CARDSLIST_SUCCESS = DELETE_CARDSLIST_SUCCESS;
exports.deleteCardslistSuccess = deleteCardslistSuccess;
exports.UPDATE_CARDSLIST_SUCCESS = UPDATE_CARDSLIST_SUCCESS;
exports.updateCardsListSuccess = updateCardsListSuccess;
exports.CREATE_CARD_SUCCESS = CREATE_CARD_SUCCESS;
exports.createCardSuccess = createCardSuccess;
exports.DELETE_CARDS_SUCCESS = DELETE_CARDS_SUCCESS;
exports.deleteCardsSuccess = deleteCardsSuccess;
exports.UPDATE_CARDS_SUCCESS = UPDATE_CARDS_SUCCESS;
exports.updateCardsSuccess = updateCardsSuccess;
exports.FIND_BOARDS_SUCCESS = FIND_BOARDS_SUCCESS;
exports.findBoardsSuccess = findBoardsSuccess;
