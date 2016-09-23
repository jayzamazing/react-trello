var actions = require('./actions');
var Immutable = require('seamless-immutable').Immutable;
const initialRepositoryState = Immutable({
  boards: [],
  cardsList: [],
  cards: []
});
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
  //TODO remove in the future
  state = state || initialRepositoryState;
  //action for adding a board
  if(action.type === actions.ADD_BOARD) {
    //return the previous state with the new board added to it
    return Object.assign(
      {}, state, {boards: state.boards.concat(action.board)}
    );
  //action for adding a b
  } else if(action.type === actions.ADD_BOARD_CARDLIST_ITEM) {
    console.log(state.boards[action.board]);
    console.log(state.boards[action.board].cardsList[action.id]);
    console.log(state.boards[action.board].cardsList[action.id].cards);
    return {
      ...state,
      [state.boards[action.board]]: {
        ...state.boards[action.board],
        cardsList: {
          ...state.boards[action.board].cardsList[action.id],
          cards: {
            ...state.boards[action.board].cardsList[action.id].cards,
            text: action.item
          }
        }
      }
    }

    // Object.assign(
    //   {}, state, {boards: state.boards[action.board].cardsList[action.id].cards.concat([{text: action.item}])}
    // );
  }
  return state;
}
exports.trelloReducer = trelloReducer;
