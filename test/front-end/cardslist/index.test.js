'use strict';
var React = require('react');
var TestUtils = require('react-addons-test-utils');
var chai = require('chai');
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
chai.use(require('chai-shallow-deep-equal'));
chai.should();
const middlewares = [ thunk ];
const mockStore = configureMockStore(middlewares);
var Cardslist = require('../../../public/js/cardslist');
var Cards = require('../../../public/js/cards');
describe('Cardslist component', function() {
  var boardsList = {},
    params = {};
  beforeEach(() => {
    boardsList = {
      boards: {
        '1': {
          _id: 1,
          title: 'blah',
          cardsList: [1, 2]
        },
        '2': {
          _id: 2,
          title: 'shopping list',
          cardsList: [3, 4]
        }
      },
      cardsList: {
        '1': {
          _id: 1,
          title: 'something',
          cards: [1, 2]
        },
        '2': {
          _id: 2,
          title: 'hungry',
          cards: [3, 4]
        },
        '3': {
          _id: 3,
          title: 'groceries',
          cards: [5, 6]
        },
        '4': {
          _id: 4,
          title: 'clothes',
          cards: [7, 8]
        }
      },
      cards: {
        '1': {
          _id: 1,
          text: 'ummmm'
        },
        '2': {
          _id: 2,
          text: 'food'
        },
        '3': {
          _id: 3,
          text: 'special'
        },
        '4': {
          _id: 4,
          text: 'taco'
        },
        '5': {
          _id: 5,
          text: 'apple'
        },
        '6': {
          _id: 6,
          text: 'pie'
        },
        '7': {
          _id: 7,
          text: 'pants'
        },
        '8': {
          _id: 8,
          text: 'shirt'
        }
      }
    };
    params = {
      boardName: ':blah',
      boardId: ':1'
    };
  });
  afterEach(() => {
    boardsList = {};
    params = {};
  });
  it('Renders the cardslist item', function() {
    //create instance of render
    var renderer = TestUtils.createRenderer();
    //render an image component
    renderer.render(<Cardslist.CardsListName params={params} boards={boardsList.boards} cardsList={boardsList.cardsList}/>);
    //get the rendered react component to test against
    var board = renderer.getRenderOutput();
    board.type.should.equal('div');
    board.props.className.should.equal('board');
    var board_name = board.props.children[0];
    board_name.type.should.equal('div');
    board_name.props.className.should.equal('board-name');
    var h1_0 = board_name.props.children;
    h1_0.type.should.equal('h1');
    h1_0.props.children.should.equal('blah');
    var cardslist = board.props.children[1];
    cardslist.type.should.equal('div');
    cardslist.props.className.should.equal('board-list');
    var cards = cardslist.props.children[0];
    cards.type.should.equal('ul');
    var cardItem = cards.props.children[0];
    cardItem.type.should.equal('li');
    cardItem.props.children[0].type.should.equal('h3');
    cardItem.props.children[0].props.children.should.equal(boardsList.cardsList[1].title);
    cardItem.props.children[1].type.WrappedComponent.should.shallowDeepEqual(Cards.CardsContainer);
    cardItem.props.children[1].props.cardsListId.should.equal('1');
    cardItem.props.children[1].props.boardId.should.equal('1');
  });
  //test for performing click event on add cardslist
  it('should simulate a click event on add CardsList input', () => {
    //set up a mockstore
    const store = mockStore({
      boards: boardsList.boards,
      cardsList: boardsList.cardsList,
      cards: boardsList.cards
    });
    //create instance of render and pass store to it
    let renderer = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <Cardslist.Container params={params} />
      </Provider>
    );
    //get the input for cards
    let inputs = TestUtils.scryRenderedDOMComponentsWithTag(renderer, 'input');
    inputs.length.should.equal(5);
    //simulate button click
    TestUtils.Simulate.click(inputs[4]);
    //get all buttons on the page after button press
    let inputs2 = TestUtils.scryRenderedDOMComponentsWithTag(renderer, 'input');
    //check that previous input is there plus two inputs from create-items
    inputs2.length.should.equal(7);
  });
});
