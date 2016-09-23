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
var boardDeserialization = function(board) {
  return {
    type: 'BOARD_DESERIALIZATION',
    board:
  }
}

exports.ADD_BOARD = ADD_BOARD;
exports.addBoard = addBoard;
exports.ADD_BOARD_CARDLIST_ITEM = ADD_BOARD_CARDLIST_ITEM;
exports.addBoardCardListItem = addBoardCardListItem;
exports.BOARD_DESERIALIZATION = BOARD_DESERIALIZATION;
exports.boardDeserialization = boardDeserialization;
