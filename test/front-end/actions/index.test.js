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
        jsonObj['_id'] = ('1');
        //return response
        return [
          200, {
            body: jsonObj
          }
        ];
      })
      .patch('/boards/1')
      //send back reply to request
      .reply((uri, requestBody) => {
        //create json obj out of the request
        var jsonObj = JSON.parse(requestBody);
        //add _id field to json
        jsonObj['_id'] = ('1');
        //return response
        return [
          200, {
            body: jsonObj
          }
        ];
      })
      //request to create cardsList
      .post('/cardslists')
      //send back reply to request
      .reply((uri, requestBody) => {
        console.log('hereeeee');
        //create json obj out of the request
        var jsonObj = JSON.parse(requestBody);
        //add _id field to json
        jsonObj['_id'] = ('1');
        //return response
        return [
          200, {
            body: jsonObj
          }
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
          response.boards.boards.body.should.have.property('title');
          response.boards.boards.body.title.should.equal('blah');
          response.boards.boards.body.should.have.property('_id');
          response.boards.boards.body._id.should.equal('1');
        });
    });
    it('should create a cardslist', () => {
      //set up a mockstore
      const store = mockStore({
        boards: {},
        cardsList: {}
      });
      return store.dispatch(actions.queries('cardslists', 'POST', {title: 'fun'},
      'create cardslist', 1))
      .then(() => {
        //check response against expected values
        var response = store.getActions()[0];
        console.log(response);
      });
    });
  });
