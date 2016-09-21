require('isomorphic-fetch');
/*
* Should be able to add a board to list of boards
*/
var ADD_BOARD = 'ADD_BOARD';
var addBoard= function(name) {
  return {
    type: ADD_BOARD,
    board: name
  };
};

exports.ADD_BOARD = ADD_BOARD;
exports.addBoard = addBoard;
