var chai = require('chai');
import actions from '../../../public/js/actions.js';
import store from '../../../public/js/store.js';
import thunk from 'redux-thunk';
import nock from 'nock';
import configureMockStore from 'redux-mock-store';
//use should
var should = chai.should();

const middlewares = [ thunk ];
const mockStore = configureMockStore(middlewares);

describe('createBoard', () => {
  beforeEach(() => {
    //create a mock server response
    nock('http://localhost:3030/')
    //request to create a board
    .put('/boards')
    //send back reply to request
    .reply((uri, requestBody) => {
      //create json obj out of the request
      var jsonObj = JSON.parse(requestBody);
      //add _id field to json
      jsonObj['_id'] = ('1');
      //return response
      return [
        200, {body: jsonObj}
      ];
    });
  });
  afterEach(() => {
    nock.cleanAll();
  });
  it('should send data as Json body', (done) => {
    //set up a mockstore
    const store = mockStore({title: {}, _id: {}});
    //call createboard passing a title of the new board
    return store.dispatch(actions.createBoard('blah'))
    .then(() => {
      //check response against expected values
      var response = store.getActions()[0];
      response.should.have.property('type');
      response.type.should.equal('CREATE_BOARD_SUCCESS');
      response.should.have.property('title');
      response.title.should.equal('blah');
      response.should.have.property('_id');
      response._id.should.equal('1');
      done();
    });
  });
});
