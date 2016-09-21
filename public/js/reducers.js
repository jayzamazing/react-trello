var actions = require('./actions');
var initialRepositoryState = {
  boards: {
    blah: {
    cardsList: [
        {
            title: 'something',
            cards: [
                {
                    text: 'ummmm'
                }, {
                    text: 'food'
                }
            ]
        },
        {
            title: 'hungry',
            cards: [
                {
                    text: 'special'
                }, {
                    text: 'taco'
                }
            ]
        }
    ]
  }
  }
};
function trelloReducer(state, action) {
  if(action.type === ADD_BOARD) {
    return Object.assign(
      {}, state, state.boards.concat(action.board));
  }
  return state;
}
exports.trelloReducer = trelloReducer;
