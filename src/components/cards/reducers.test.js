'use strict';
import chai from 'chai';
import * as CardsActions from './CardsActions';
import * as cardsReducer from './CardsReducer';
import {seedCards} from '../testutils/seeddata';
import {normalize,arrayOf} from 'normalizr';
import {cardsSchema} from '../board-schema';
const should = chai.should();
describe('cards reducer', () => {
  let cards, items;
  before(() => {
    cards = seedCards(5);
    items = (normalize({cards: cards}, {
      cards: arrayOf(cardsSchema)
    })).entities;
  });
  after(() => {
    cards = {};
    items = {};
  });
  describe('reducer for FIND_BOARDS_SUCCESS', () => {
    let state;
    before(() => {
      state = cardsReducer.trelloReducer(undefined, {type: 'FIND_BOARDS_SUCCESS', items});
    });
    it('should exist', () => {
      should.exist(state.cards);
    });
    it('should have properties', () => {
      let keys = Object.keys(state.cards);
      state.cards.should.have.property(keys[0]);
      state.cards[keys[0]].should.have.property('_id');
      state.cards[keys[0]].should.have.property('text');
    });
    it('should deserialize the order', () => {
      let keys = Object.keys(state.cards);
      state.cards[keys[0]]._id.should.equal(cards[0]._id);
      state.cards[keys[1]].text.should.equal(cards[1].text);
    });
  });
  describe('CREATE_BOARD_SUCCESS', () => {
    let state, test;
    before(() => {
      test = seedCards(0, 'grocery list');
      state = cardsReducer.trelloReducer(undefined, {type: 'FIND_BOARDS_SUCCESS', items});
      state = cardsReducer.trelloReducer(state, CardsActions.createCardsSuccess({'cards': test}));
    });
    it('should exist', () => {
      should.exist(state.cards);
    });
    it('should have properties', () => {
      let keys = Object.keys(state.cards);
      state.cards.should.have.property(keys[0]);
      state.cards[keys[0]].should.have.property('_id');
      state.cards[keys[0]].should.have.property('text');
    });
    it('should deserialize the order', () => {
      state.cards[test._id]._id.should.equal(test._id);
      state.cards[test._id].text.should.equal('grocery list');
    });
  });
  describe('DELETE_CARDS_SUCCESS', () => {
    let state;
    before(() => {
      state = cardsReducer.trelloReducer(undefined, {type: 'FIND_BOARDS_SUCCESS', items});
      state = cardsReducer.trelloReducer(state, CardsActions.deleteCardsSuccess(cards[1]._id));
    });
    it('should exist', () => {
      should.exist(state.cards);
    });
    it('should not have properties', () => {
      state.cards.should.not.have.property(cards[1]._id);
    });
  });
  describe('UPDATE_CARDS_SUCCESS', () => {
    let state, test;
    before(() => {
      test = seedCards(0, 'super mario', cards[2]._id);
      state = cardsReducer.trelloReducer(undefined, {type: 'FIND_BOARDS_SUCCESS', items});
      state = cardsReducer.trelloReducer(state, CardsActions.updateCardsSuccess(cards[2]._id,
      {'cards': test}));
    });
    it('should exist', () => {
      should.exist(state.cards);
    });
    it('should have properties', () => {
      state.cards[test._id].should.have.property('_id');
      state.cards[test._id].should.have.property('text');
    });
    it('should deserialize the order', () => {
      state.cards[test._id]._id.should.equal(test._id);
      state.cards[test._id].text.should.equal('super mario');
    });
  });
});
