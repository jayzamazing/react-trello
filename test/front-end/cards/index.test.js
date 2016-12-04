var React = require('react');
var TestUtils = require('react-addons-test-utils');
var chai = require('chai');
chai.use(require('chai-shallow-deep-equal'));
chai.should();

var Cards = require('../../../public/js/cards');

describe('Cards component', function() {
  var cardItems = {};
  before(() => {
    cardItems = {
      cardsListId: 1,
      boardId: 1,
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
  });
  after(() => {
    cardItems = {};
  });
  it('Renders the Cards item', function() {

    //create instance of render
    var renderer = TestUtils.createRenderer();
    //render an image component
    renderer.render(<Cards.CardsContainer cards={cardItems.cards} boardId={cardItems.boardId}
      cardsList={cardItems.cardsList} cardsListId={cardItems.cardsListId}/>);
    //get the rendered react component to test against
    var result = renderer.getRenderOutput();
    //test props for various values
    result.type.should.equal('ul');
    //get cards prop
    var resultListItem = result.props;
    //check cards match
    resultListItem.children[0][0].props.children.should.equal(cardItems.cards[1].text);
    resultListItem.children[0][1].props.children.should.equal(cardItems.cards[2].text);
  });
});
