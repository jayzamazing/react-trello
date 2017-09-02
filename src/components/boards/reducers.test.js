'use strict';
import chai from 'chai';
import * as BoardActions from './BoardActions';
import * as boardReducer from './BoardReducer';
import {seedBoards} from '../testutils/seeddata';
const should = chai.should();
describe('board reducer', () => {
  let boards;
  before(() => {
    boards = seedBoards(5);
  });
  after(() => {
    boards = {};
  });
  describe('reducer for FIND_BOARDS_SUCCESS', () => {
    let state;
    before(() => {
      state = boardReducer.trelloReducer(undefined, BoardActions.findBoardsSuccess(boards));
    });
    it('should exist', () => {
      should.exist(state.boards);
    });
    it('should have properties', () => {
      let keys = Object.keys(state.boards);
      state.boards.should.have.property(keys[0]);
      state.boards[keys[0]].should.have.property('_id');
      state.boards[keys[0]].should.have.property('title');
      state.boards[keys[0]].should.have.property('cardsList');
      state.boards[keys[0]].cardsList.should.be.an('array');
    });
    it('should deserialize the order', () => {
      let keys = Object.keys(state.boards);
      state.boards[keys[0]]._id.should.equal(boards.boards[0]._id);
      state.boards[keys[1]].title.should.equal(boards.boards[1].title);
    });
  });
});
