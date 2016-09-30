'use strict';
var React = require('react');
var TestUtils = require('react-addons-test-utils');
var chai = require('chai');
chai.use(require('chai-shallow-deep-equal'));
var should = chai.should();

var Board = require('../../../public/js/board');
var List = require('../../../public/js/list');
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
    }
  });
  afterEach(() => {
    boardsList = {};
    params = {};
  });
  it('Renders the board item', function() {
    //create instance of render
    var renderer = TestUtils.createRenderer();
    //render an image component
    renderer.render(<Board.Board params={params} boards={boardsList.boards}
      cardsList={boardsList.cardsList} cards={boardsList.cards}/>);
    // //get the rendered react component to test against
    // var board = renderer.getRenderOutput();
    // // console.log(result);
    // board.type.should.equal('div');
    // board.props.className.should.equal('board');
    // var board_name = board.props.children[0];
    // board_name.type.should.equal('div');
    // board_name.props.className.should.equal('board-name');
    // var h1_0 = board_name.props.children;
    // h1_0.type.should.equal('h1');
    // h1_0.props.children.should.equal('blah');
    // var board_list = board.props.children[1];
    // board_list.type.should.equal('div');
    // board_list.props.className.should.equal('board-list')
    // var listContainer = board_list.props.children[0];
    // listContainer.type.should.shallowDeepEqual(List.ListContainer);
    // listContainer.props.title.should.equal('everything');
    // listContainer.props.cards[0].text.should.equal('is');
  });
});
