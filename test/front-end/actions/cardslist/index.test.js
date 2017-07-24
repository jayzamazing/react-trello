import chai from 'chai';
import {createCardsList,CREATE_CARDSLIST_SUCCESS} from '../../../../src/actions/CardsListActions';
import thunk from 'redux-thunk';
import nock from 'nock';
import configureMockStore from 'redux-mock-store';
//use should
chai.should();

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
var cardsList = function(cardsList, cards) {
  var temp = {
    'title': null,
    '_id': null,
    'cards': [{
      'text': null,
      '_id': null,
    }]
  };
  if (cardsList) {
    temp.title = cardsList.title;
    temp._id = cardsList._id;
  }
  if (cards) {
    temp.cards[0].text = cards.text;
    temp.cards[0]._id = cards._id;
  }
  return temp;
};
describe('trello actions', () => {
  before(() => {
//create a mock server response
    nock('http://localhost')
.patch('/boards/1')
.reply(204, (uri, requestBody) => {
//return response
  return cardsList({
    '_id': 1,
    'title': JSON.parse(requestBody).title
  });
})
//request to create cardsList
.post('/cardslist')
//send back reply to request
.reply(200, (uri, requestBody) => {
//return response
  return cardsList({
    '_id': 1,
    'title': JSON.parse(requestBody).title
  });
})
.delete('/cardslist/1')
.reply(204)
//update a cardslist
.put('/cardslist/2')
.reply(204, () => {
  return cardsList({
    'title': 'supah man',
    _id: 2
  });
});
  });
  after(() => {
    nock.cleanAll();
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
  response.should.have.property('data');
  response.data.should.have.property('title');
  response.data.title.should.equal('fun');
  response.should.have.property('boardId');
  response.boardId.should.equal(1);
});
  });
// it('should delete a cardslist', () => {
//   //set up a mockstore
//   const store = mockStore({
//     boards: {},
//     cardsList: {}
//   });
//   return store.dispatch(actions.queries('cardslists', 'DELETE', 1, 'delete cardslist'))
//     .then(() => {
//       //check response against expected values
//       var response = store.getActions()[0];
//       response.should.have.property('type');
//       response.type.should.equal('DELETE_CARDSLIST_SUCCESS');
//       response.boards.cardsList[0].should.have.property('title');
//       response.boards.cardsList[0].title.should.equal('hello');
//       response.boards.cardsList[0].should.have.property('_id');
//       response.boards.cardsList[0]._id.should.equal(5);
//     });
// });
// it('should update a cardslist', () => {
//   //set up a mockstore
//   const store = mockStore({
//     boards: {},
//     cardsList: {}
//   });
//   //call to update a cardslist
//   return store.dispatch(actions.queries('cardslists', 'PUT', {
//     title: 'supah man'
//   }, 'update cardslist', 2))
//     .then(() => {
//       //check response against expected values
//       var response = store.getActions()[0];
//       response.should.have.property('type');
//       response.type.should.equal('UPDATE_CARDSLIST_SUCCESS');
//       response.boards.cardsList[0].should.have.property('title');
//       response.boards.cardsList[0].title.should.equal('supah man');
//       response.boards.cardsList[0].should.have.property('_id');
//       response.boards.cardsList[0]._id.should.equal(2);
//     });
// });
});
