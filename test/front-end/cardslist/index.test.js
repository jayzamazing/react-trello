'use strict';
var React = require('react');
var TestUtils = require('react-addons-test-utils');
var chai = require('chai');
chai.use(require('chai-shallow-deep-equal'));
chai.should();

var Cardslist = require('../../../public/js/cardslist');
var Cards = require('../../../public/js/cards');
describe('Board component', function() {
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
    // console.log(result);
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
  });
});
