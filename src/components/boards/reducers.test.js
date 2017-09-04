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
      state.boards[keys[0]]._id.should.equal(boards[0]._id);
      state.boards[keys[1]].title.should.equal(boards[1].title);
    });
  });
  describe('CREATE_BOARD_SUCCESS', () => {
    let state, test;
    before(() => {
      test = seedBoards(0, 'grocery list');
      state = boardReducer.trelloReducer(undefined, BoardActions.findBoardsSuccess(boards));
      state = boardReducer.trelloReducer(state, BoardActions.createBoardSuccess({'boards': test}));
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
      should.equal(state.boards[keys[0]].cardsList, null);
    });
    it('should deserialize the order', () => {
      state.boards[test._id]._id.should.equal(test._id);
      state.boards[test._id].title.should.equal('grocery list');
    });
  });
  describe('DELETE_BOARD_SUCCESS', () => {
    let state;
    before(() => {
      state = boardReducer.trelloReducer(undefined, BoardActions.findBoardsSuccess(boards));
      state = boardReducer.trelloReducer(state, BoardActions.deleteBoardSuccess(boards[1]._id));
    });
    it('should exist', () => {
      should.exist(state.boards);
    });
    it('should not have properties', () => {
      state.boards.should.not.have.property(boards[1]._id);
    });
  });
  describe('UPDATE_BOARD_SUCCESS', () => {
    let state, test;
    before(() => {
      test = seedBoards(0, 'super mario', boards[2]._id);
      state = boardReducer.trelloReducer(undefined, BoardActions.findBoardsSuccess(boards));
      state = boardReducer.trelloReducer(state, BoardActions.updateBoardSuccess(boards[2]._id,
      {'boards': test}));
    });
    it('should exist', () => {
      should.exist(state.boards);
    });
    it('should have properties', () => {
      state.boards[test._id].should.have.property('_id');
      state.boards[test._id].should.have.property('title');
    });
    it('should deserialize the order', () => {
      state.boards[test._id]._id.should.equal(test._id);
      state.boards[test._id].title.should.equal('super mario');
    });
  });
});
