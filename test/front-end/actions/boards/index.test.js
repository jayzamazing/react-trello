import chai from 'chai';
import {getBoards,FIND_BOARDS_SUCCESS,createBoards,CREATE_BOARD_SUCCESS,deleteBoards,DELETE_BOARD_SUCCESS,UPDATE_BOARD_SUCCESS,updateBoards} from '../../../../src/actions/BoardActions';
import thunk from 'redux-thunk';
import nock from 'nock';
import configureMockStore from 'redux-mock-store';
import {boards} from '../utils/seeddata';
//use should
chai.should();

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
let bds;
describe('trello actions', () => {
  before(() => {
//create a mock server response
    nock('http://localhost')
//request to create a board
.post('/boards')
//send back reply to request
.reply(201, (uri, requestBody) => {
  bds = boards(JSON.parse(requestBody).title);
//return response
  return bds;
})
//request to get a board
.get('/boards')
.query(true)
//send back reply to request
.reply(200, () => {
//return response
  return bds;
})
.delete('/boards/1')
.reply(204)
//update a board
.put('/boards/1')
.reply(204);
  });
  after(() => {
    nock.cleanAll();
  });
  beforeEach(() => {
    bds = boards();
  });
  it('should get boards', () => {
//set up a mockstore
    const store = mockStore({
      boards: {}
    });
//call createboard passing a title of the new board
    return store.dispatch(getBoards())
.then(() => {
//check response against expected values
  var response = store.getActions()[0];
  response.should.have.property('type');
  response.type.should.equal(FIND_BOARDS_SUCCESS);
  response.boards.should.have.property('title');
  response.boards.title.should.equal(bds.title);
  response.boards.should.have.property('_id');
  response.boards._id.should.equal(bds._id);
});
  });
  it('should create a board', () => {
//set up a mockstore
    const store = mockStore({
      boards: {}
    });
//call createboard passing a title of the new board
    return store.dispatch(createBoards({
      title: 'blah'
    }))
.then(() => {
//check response against expected values
  var response = store.getActions()[0];
  response.should.have.property('type');
  response.type.should.equal(CREATE_BOARD_SUCCESS);
  response.boards.should.have.property('title');
  response.boards.title.should.equal('blah');
  response.boards.should.have.property('_id');
  response.boards._id.should.equal(bds._id);
});
  });
  it('should delete a board', () => {
//set up a mockstore
    const store = mockStore({
      boards: {}
    });
//call createboard passing a title of the new board
    return store.dispatch(deleteBoards(1))
.then(() => {
//check response against expected values
  var response = store.getActions()[0];
  response.type.should.equal(DELETE_BOARD_SUCCESS);
  response.should.have.property('boardId');
  response.boardId.should.equal(1);
});
  });
  it('should update a board', () => {
//set up a mockstore
    const store = mockStore({
      boards: {}
    });
//call to update a board
    return store.dispatch(updateBoards(1, {title: 'bleh'}))
.then(() => {
//check response against expected values
  var response = store.getActions()[0];
  response.should.have.property('type');
  response.type.should.equal(UPDATE_BOARD_SUCCESS);
  response.boards.should.have.property('title');
  response.boards.title.should.equal('bleh');
  response.should.have.property('boardId');
  response.boardId.should.equal(1);
});
  });
});
