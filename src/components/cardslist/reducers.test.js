'use strict';
import chai from 'chai';
import * as CardsListActions from './CardsListActions';
import * as cardslistReducer from './CardslistReducer';
import {seedCardslists} from '../testutils/seeddata';
import {normalize,arrayOf} from 'normalizr';
import {cardsListSchema} from '../board-schema';
const should = chai.should();
describe('cardslist reducer', () => {
  let cardslist, items;
  before(() => {
    cardslist = seedCardslists(5);
    items = (normalize({cardslist: cardslist}, {
      cardslist: arrayOf(cardsListSchema)
    })).entities;
  });
  after(() => {
    cardslist = {};
    items = {};
  });
  describe('reducer for FIND_BOARDS_SUCCESS', () => {
    let state;
    before(() => {
      state = cardslistReducer.trelloReducer(undefined, {type: 'FIND_BOARDS_SUCCESS', items});
    });
    it('should exist', () => {
      should.exist(state.cardslist);
    });
    it('should have properties', () => {
      let keys = Object.keys(state.cardslist);
      state.cardslist.should.have.property(keys[0]);
      state.cardslist[keys[0]].should.have.property('_id');
      state.cardslist[keys[0]].should.have.property('title');
      state.cardslist[keys[0]].should.have.property('cards');
      state.cardslist[keys[0]].cards.should.be.an('array');
    });
    it('should deserialize the order', () => {
      let keys = Object.keys(state.cardslist);
      state.cardslist[keys[0]]._id.should.equal(cardslist[0]._id);
      state.cardslist[keys[1]].title.should.equal(cardslist[1].title);
    });
  });
  describe('CREATE_BOARD_SUCCESS', () => {
    let state, test;
    before(() => {
      test = seedCardslists(0, 'grocery list');
      state = cardslistReducer.trelloReducer(undefined, {type: 'FIND_BOARDS_SUCCESS', items});
      state = cardslistReducer.trelloReducer(state, CardsListActions.createCardslistSuccess({'cardslist': test}));
    });
    it('should exist', () => {
      should.exist(state.cardslist);
    });
    it('should have properties', () => {
      let keys = Object.keys(state.cardslist);
      state.cardslist.should.have.property(keys[0]);
      state.cardslist[keys[0]].should.have.property('_id');
      state.cardslist[keys[0]].should.have.property('title');
      state.cardslist[keys[0]].should.have.property('cards');
      should.equal(state.cardslist[keys[0]].cards, null);
    });
    it('should deserialize the order', () => {
      state.cardslist[test._id]._id.should.equal(test._id);
      state.cardslist[test._id].title.should.equal('grocery list');
    });
  });
  describe('DELETE_CARDSLIST_SUCCESS', () => {
    let state;
    before(() => {
      state = cardslistReducer.trelloReducer(undefined, {type: 'FIND_BOARDS_SUCCESS', items});
      state = cardslistReducer.trelloReducer(state, CardsListActions.deleteCardslistSuccess(cardslist[1]._id));
    });
    it('should exist', () => {
      should.exist(state.cardslist);
    });
    it('should not have properties', () => {
      state.cardslist.should.not.have.property(cardslist[1]._id);
    });
  });
  describe('UPDATE_CARDSLIST_SUCCESS', () => {
    let state, test;
    before(() => {
      test = seedCardslists(0, 'super mario', cardslist[2]._id);
      state = cardslistReducer.trelloReducer(undefined, {type: 'FIND_BOARDS_SUCCESS', items});
      state = cardslistReducer.trelloReducer(state, CardsListActions.updateCardslistSuccess(cardslist[2]._id,
      {'cardslist': test}));
    });
    it('should exist', () => {
      should.exist(state.cardslist);
    });
    it('should have properties', () => {
      state.cardslist[test._id].should.have.property('_id');
      state.cardslist[test._id].should.have.property('title');
    });
    it('should deserialize the order', () => {
      state.cardslist[test._id]._id.should.equal(test._id);
      state.cardslist[test._id].title.should.equal('super mario');
    });
  });
});
