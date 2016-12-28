var chai = require('chai');
import actions from '../../../public/js/actions';
import thunk from 'redux-thunk';
import nock from 'nock';
import configureMockStore from 'redux-mock-store';
//use should
chai.should();

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('trello actions', () => {
  before(() => {
    //create a mock server response
    nock('http://localhost:3030')
      //request to create a board
      .post('/boards')
      //send back reply to request
      .reply((uri, requestBody) => {
        //create json obj out of the request
        var jsonObj = JSON.parse(requestBody);
        //add _id field to json
        jsonObj['_id'] = ('7');
        //return response
        return [
          200,
          jsonObj
        ];
      })
      //request to create a board
      .get('/boards')
      //send back reply to request
      .reply((uri, requestBody) => {
        var jsonObj;
        if (requestBody) {
          //create json obj out of the request
          jsonObj = JSON.parse(requestBody);
          //add _id field to json
          jsonObj['_id'] = ('1');
        } else {
          jsonObj = {_id: '1'};
        }
        //return response
        return [
          200,
          jsonObj
        ];
      })
      .patch('/boards/1')
      //send back reply to request
      .reply((uri, requestBody) => {
        //create json obj out of the request
        var temp = JSON.parse(requestBody);
        var jsonObj = temp.$push;
        //add _id field to json
        jsonObj['_id'] = ('2');
        //return response
        return [
          200,
          jsonObj
        ];
      })
      //request to create cardsList
      .post('/cardslists')
      //send back reply to request
      .reply((uri, requestBody) => {
        //create json obj out of the request
        var jsonObj = JSON.parse(requestBody);
        //add _id field to json
        jsonObj['_id'] = ('5');
        //return response
        return [
          200,
          jsonObj
        ];
      })
      .patch('/cardslists/1')
      //send back reply to request
      .reply((uri, requestBody) => {
        //create json obj out of the request
        var temp = JSON.parse(requestBody);
        var jsonObj = temp.$push;
        //add _id field to json
        jsonObj['_id'] = ('1');
        //return response
        return [
          200,
          jsonObj
        ];
      })
      .post('/cards')
      //send back reply to request
      .reply((uri, requestBody) => {
        //create json obj out of the request
        var jsonObj = JSON.parse(requestBody);
        //add _id field to json
        jsonObj['_id'] = ('1');
        //return response
        return [
          200,
          jsonObj
        ];
      });
  });
  after(() => {
    nock.cleanAll();
  });
  it('should create a board', () => {
    //set up a mockstore
    const store = mockStore({
      boards: {}
    });
    //call createboard passing a title of the new board
    return store.dispatch(actions.queries('boards', 'POST', {
      title: 'blah'
    }, 'create board'))
      .then(() => {
        //check response against expected values
        var response = store.getActions()[0];
        response.should.have.property('type');
        response.type.should.equal('CREATE_BOARD_SUCCESS');
        response.boards.boards.should.have.property('title');
        response.boards.boards.title.should.equal('blah');
        response.boards.boards.should.have.property('_id');
        response.boards.boards._id.should.equal('7');
      });
  });
  it('should create a cardslist', () => {
    //set up a mockstore
    const store = mockStore({
      boards: {},
      cardsList: {}
    });
    return store.dispatch(actions.queries('cardslists', 'POST', {
      title: 'fun'
    },
        'create cardslist', 1))
      .then(() => {
        //check response against expected values
        var response = store.getActions()[0];
        response.should.have.property('type');
        response.type.should.equal('CREATE_CARDLIST_SUCCESS');
        response.boards.boards.should.have.property('cardsList');
        response.boards.boards.cardsList.should.equal('5');
        response.boards.boards.should.have.property('_id');
        response.boards.boards._id.should.equal('2');
      });
  });
  it('should create a card', () => {
    //set up a mockstore
    const store = mockStore({
      boards: {},
      cardsList: {},
      cards: {}
    });
    return store.dispatch(actions.queries('cards', 'POST', {
      test: 'superman'
    },
    'create cards', 1))
    .then(() => {
      //check response against expected values
      var response = store.getActions()[0];
      response.should.have.property('type');
      response.type.should.equal('CREATE_CARD_SUCCESS');
      response.boards.boards.should.have.property('_id');
      response.boards.boards._id.should.equal('1');
    });
  });
});
