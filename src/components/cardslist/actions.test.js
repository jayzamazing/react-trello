import chai from 'chai';
import * as CardsListActions from './CardsListActions';
import thunk from 'redux-thunk';
import nock from 'nock';
import configureMockStore from 'redux-mock-store';
import {seedCardslists} from '../testutils/seeddata';
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
.post('/cardslist')
//send back reply to request
.reply(200, (uri, requestBody) => {
//return response
  cdl = seedCardslists(0, JSON.parse(requestBody).title);
  return {cardslist: cdl};
})
.delete('/cardslist/1')
.reply(204)
//update a cardslist
.put('/cardslist/2')
.reply(204);
  });
  after(() => {
    nock.cleanAll();
  });
  beforeEach(() => {
    cdl = seedCardslists();
  });
  it('should create a cardslist', () => {
//set up a mockstore
    const store = mockStore({
      cardslist: {}
    });
    return store.dispatch(CardsListActions.createCardslist({title: 'fun'}))
.then(() => {
//check response against expected values
  var response = store.getActions()[0];
  response.should.have.property('type');
  response.type.should.equal(CardsListActions.CREATE_CARDSLIST_SUCCESS);
  response.items.should.have.property('cardslist');
  let keys = Object.keys(response.items.cardslist);
  response.items.cardslist[keys[0]].should.have.property('title');
  response.items.cardslist[keys[0]].title.should.equal('fun');
});
  });
  it('should delete a cardslist', () => {
  //set up a mockstore
    const store = mockStore({
      cardslist: {}
    });
    return store.dispatch(CardsListActions.deleteCardslist(1))
    .then(() => {
      //check response against expected values
      var response = store.getActions()[0];
      response.should.have.property('type');
      response.type.should.equal(CardsListActions.DELETE_CARDSLIST_SUCCESS);
      response.should.have.property('cardslistId');
      response.cardslistId.should.equal(1);
    });
  });
  it('should update a cardslist', () => {
  //set up a mockstore
    const store = mockStore({
      cardslist: {}
    });
    let temp = seedCardslists(0, 'supah man');
  //call to update a cardslist
    return store.dispatch(CardsListActions.updateCardslist(2, {cardslist: temp}))
    .then(() => {
      //check response against expected values
      var response = store.getActions()[0];
      response.should.have.property('type');
      response.type.should.equal(CardsListActions.UPDATE_CARDSLIST_SUCCESS);
      let keys = Object.keys(response.items.cardslist);
      response.items.cardslist[keys[0]].should.have.property('title');
      response.items.cardslist[keys[0]].title.should.equal('supah man');
      response.should.have.property('cardslistId');
      response.cardslistId.should.equal(2);
    });
  });
});
