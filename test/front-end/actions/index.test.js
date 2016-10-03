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
      });
  });
  afterEach(() => {
    nock.cleanAll();
  });
  describe('board queries', () => {
    it('should create a board', () => {
      //set up a mockstore
      const store = mockStore({
        boards: []
      });
      //call createboard passing a title of the new board
      return store.dispatch(actions.queryBoards('boards', 'POST', {
        title: 'blah'
      }, 'create board'))
        .then(() => {
          //check response against expected values
          var response = store.getActions()[0];
          response.should.have.property('type');
          response.type.should.equal('CREATE_BOARD_SUCCESS');
          response.boards.should.have.property('title');
          response.boards.title.should.equal('blah');
          response.boards.should.have.property('_id');
          response.boards._id.should.equal('1');
        });
    });
    it('should create a cardslist', () => {

    });
  });
});
