import chai from 'chai';
import * as CardsActions from './CardsActions';
import thunk from 'redux-thunk';
import nock from 'nock';
import configureMockStore from 'redux-mock-store';
import {seedCards} from '../testutils/seeddata';
//use should
chai.should();

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
let cdl;
describe('trello actions', () => {
  before(() => {
//create a mock server response
    nock('http://localhost')
//request to create cardsList
.post('/cards')
//send back reply to request
.reply(200, (uri, requestBody) => {
//return response
  cdl = seedCards(0, JSON.parse(requestBody).text);
  return {cards: cdl};
})
.delete('/cards/1')
.reply(204)
//update a cards
.put('/cards/2')
.reply(204);
  });
  after(() => {
    nock.cleanAll();
  });
  beforeEach(() => {
    cdl = seedCards();
  });
  it('should create a cards', () => {
//set up a mockstore
    const store = mockStore({
      cards: {}
    });
    return store.dispatch(CardsActions.createCards({text: 'fun'}))
.then(() => {
//check response against expected values
  var response = store.getActions()[0];
  response.should.have.property('type');
  response.type.should.equal(CardsActions.CREATE_CARDS_SUCCESS);
  response.items.should.have.property('cards');
  let keys = Object.keys(response.items.cards);
  response.items.cards[keys[0]].should.have.property('text');
  response.items.cards[keys[0]].text.should.equal('fun');
});
  });
  it('should delete a cards', () => {
  //set up a mockstore
    const store = mockStore({
      cards: {}
    });
    return store.dispatch(CardsActions.deleteCards(1))
    .then(() => {
      //check response against expected values
      var response = store.getActions()[0];
      response.should.have.property('type');
      response.type.should.equal(CardsActions.DELETE_CARDS_SUCCESS);
      response.should.have.property('cardsId');
      response.cardsId.should.equal(1);
    });
  });
  it('should update a cards', () => {
  //set up a mockstore
    const store = mockStore({
      cards: {}
    });
    let temp = seedCards(0, 'supah man');
  //call to update a cards
    return store.dispatch(CardsActions.updateCards(2, {cards: temp}))
    .then(() => {
      //check response against expected values
      var response = store.getActions()[0];
      response.should.have.property('type');
      response.type.should.equal(CardsActions.UPDATE_CARDS_SUCCESS);
      let keys = Object.keys(response.items.cards);
      response.items.cards[keys[0]].should.have.property('text');
      response.items.cards[keys[0]].text.should.equal('supah man');
      response.should.have.property('cardsId');
      response.cardsId.should.equal(2);
    });
  });
});
