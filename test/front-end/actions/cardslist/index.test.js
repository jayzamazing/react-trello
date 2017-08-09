import chai from 'chai';
import {createCardsList,CREATE_CARDSLIST_SUCCESS,deleteCardslist,DELETE_CARDSLIST_SUCCESS,updateCardslist,UPDATE_CARDSLIST_SUCCESS} from '../../../../src/actions/CardsListActions';
import thunk from 'redux-thunk';
import nock from 'nock';
import configureMockStore from 'redux-mock-store';
import {cardslists} from '../utils/seeddata';
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
  cdl = cardslists(JSON.parse(requestBody).title);
  return cdl;
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
    cdl = cardslists();
  });
  it('should create a cardslist', () => {
//set up a mockstore
    const store = mockStore({
      boards: {},
      cardsList: {}
    });
    return store.dispatch(createCardsList(1, {title: 'fun'}))
.then(() => {
//check response against expected values
  var response = store.getActions()[0];
  response.should.have.property('type');
  response.type.should.equal(CREATE_CARDSLIST_SUCCESS);
  response.should.have.property('cardslist');
  response.cardslist.should.have.property('title');
  response.cardslist.title.should.equal('fun');
});
  });
  it('should delete a cardslist', () => {
  //set up a mockstore
    const store = mockStore({
      boards: {},
      cardsList: {}
    });
    return store.dispatch(deleteCardslist(1))
    .then(() => {
      //check response against expected values
      var response = store.getActions()[0];
      response.should.have.property('type');
      response.type.should.equal(DELETE_CARDSLIST_SUCCESS);
      response.should.have.property('cardslistId');
      response.cardslistId.should.equal(1);
    });
  });
  it('should update a cardslist', () => {
  //set up a mockstore
    const store = mockStore({
      boards: {},
      cardsList: {}
    });
  //call to update a cardslist
    return store.dispatch(updateCardslist(2, {title: 'supah man'}))
    .then(() => {
      //check response against expected values
      var response = store.getActions()[0];
      response.should.have.property('type');
      response.type.should.equal(UPDATE_CARDSLIST_SUCCESS);
      response.cardslist.should.have.property('title');
      response.cardslist.title.should.equal('supah man');
      response.should.have.property('cardslistId');
      response.cardslistId.should.equal(2);
    });
  });
});
