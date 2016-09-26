var chai = require('chai');
import reducer from '../../../public/js/reducers.js';
import actions from '../../../public/js/actions.js';
import store from '../../../public/js/store.js';
import thunk from 'redux-thunk';
import nock from 'nock';
import configureMockStore from 'redux-mock-store'
//use should
var should = chai.should();
const middlewares = [ thunk ]
const mockStore = configureMockStore(middlewares)

const boards =
    [{
        "_id": 1,
        "title": "blah",
        "cardsList": [{
            "_id": 1,
            "title": "something",
            "cards": [{
                "_id": 1,
                "text": "ummmm"
            }, {
                "_id": 2,
                "text": "food"
            }]
        }, {
            "_id": 2,
            "title": "hungry",
            "cards": [{
                "_id": 3,
                "text": "special"
            }, {
                "_id": 4,
                "text": "taco"
            }]
        }]
    }, {
        "_id": 2,
        "title": "shopping list",
        "cardsList": [{
            "_id": 3,
            "title": "groceries",
            "cards": [{
                "_id": 5,
                "text": "apple"
            }, {
                "_id": 6,
                "text": "pie"
            }]
        }, {
            "_id": 4,
            "title": "clothes",
            "cards": [{
                "_id": 7,
                "text": "pants"
            }, {
                "_id": 8,
                "text": "shirt"
            }]
        }]
    }];
describe('trelloReducer', () => {
    describe('BOARD_DESERIALIZATION', () => {
        let state;
        beforeEach(() => {
            state = reducer.trelloReducer(undefined, actions.boardDeserialization(boards));
        });
        it('should deserialize the order', () => {
          state.boards.should.have.property('1');
          state.boards['1'].should.have.property('_id');
          state.boards['1']._id.should.equal(1);
          state.boards['2'].should.have.property('title');
          state.boards['2'].title.should.equal('shopping list');
          state.boards['2'].should.have.property('cardsList');
          state.boards['2'].cardsList.should.be.an('array')
            .to.include.members([3, 4]);
        });
    });
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
});
