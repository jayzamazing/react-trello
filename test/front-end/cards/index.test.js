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
var Cards = require('../../../public/js/cards');
var CreateItems = require('../../../public/js/create-items');

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
          cards: [1]
        }
      },
      cards: {
        '1': {
          _id: 1,
          text: 'ummmm'
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
    result.type.should.equal('div');
    var resultListItem = result.props.children;
    resultListItem[0].type.should.equal('ul');
    var cards = resultListItem[0].props.children;
    // console.log(result);
    cards[0].props.children[0].props.value.should.equal(cardItems.cards[1].text);
  });
  //test for performing click event on add cards
  it('should simulate a click event on add Cards input', () => {
    //set up a mockstore
    const store = mockStore({
      cardsList: cardItems.cardsList,
      cards: cardItems.cards
    });
    //create instance of render and pass store to it
    let renderer = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <Cards.Container boardId={cardItems.boardId} cardsListId={cardItems.cardsListId}/>
      </Provider>
    );
    //get the input for cards
    let inputs = TestUtils.scryRenderedDOMComponentsWithTag(renderer, 'input');
    inputs.length.should.equal(4);
    inputs[0].value = 'happy';
    TestUtils.Simulate.change(inputs[0]);
    //simulate button click
    TestUtils.Simulate.click(inputs[1]);
    //get all buttons on the page after button press
    let inputs2 = TestUtils.scryRenderedDOMComponentsWithTag(renderer, 'input');
    //check that previous input is there plus two inputs from create-items
    inputs2.length.should.equal(4);
  });
  //test for deleting a card
  it('should simulate a click event on delete cardslist input', () => {
    //set up a mockstore
    const store = mockStore({
      cardsList: cardItems.cardsList,
      cards: cardItems.cards
    });
    //create instance of render and pass store to it
    let renderer = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <Cards.Container boardId={cardItems.boardId} cardsListId={cardItems.cardsListId}/>
      </Provider>
    );
    //get the input for boards
    let inputs = TestUtils.scryRenderedDOMComponentsWithTag(renderer, 'input');
    inputs.length.should.equal(4);
    //simulate button click
    TestUtils.Simulate.click(inputs[1]);
  });
});
