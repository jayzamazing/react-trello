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
    },
  'shopping list': {
    cardsList: [
      {
          title: 'groceries',
          cards: [
              {
                  text: 'apple'
              }, {
                  text: 'pie'
              }
          ]
      },
      {
          title: 'clothes',
          cards: [
              {
                  text: 'pants'
              }, {
                  text: 'shirt'
              }
          ]
      }
  ]
  }
}
};
function trelloReducer(state, action) {
  state = state || initialRepositoryState;
  if(action.type === actions.ADD_BOARD) {
    return Object.assign(
      {}, state, state.boards.concat(action.board));
  }
  return state;
}
exports.trelloReducer = trelloReducer;
