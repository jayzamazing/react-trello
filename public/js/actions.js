require('isomorphic-fetch');
/*
* Should return list of boards
*/
var BOARDSLIST = 'BOARDSLIST';
var boardsList = function() {
  return {
    type: BOARDSLIST
  };
};

exports.BOARDSLIST = BOARDSLIST;
exports.boardsList = boardsList;
