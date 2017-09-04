'use strict';
import request from 'superagent';
import {normalize} from 'normalizr';
import {cardsSchema} from '../board-schema';

/*
* action to tell store that a cards has been created
* @params data - data to be sent to store
* @returns action type and data
*/
export const CREATE_CARDS_SUCCESS = 'CREATE_CARDS_SUCCESS';
export const createCardsSuccess = cards => {
  const items = (normalize(cards, {
    cards: cardsSchema
  })).entities;
  return {
    type: CREATE_CARDS_SUCCESS,
    items
  };
};
/*
* function to create a cards
* @params postData - data to update on the cards
* @params createCardsSuccess or passed in action
* @dispatch createCardsSuccess or passed in action
*/
export const createCards = (postData, action = createCardsSuccess) => dispatch => {
  return request.post('/cards')
  .send(postData)
  .set('Accept', 'application/json')
    .then(res => {
      if (!res.ok) return Promise.reject(res.statusText);
      return dispatch(action(res.body));
    });
};
/*
* action to tell store that a cards has been created
* @params data - data to be sent to store
* @returns action type and data
*/
export const DELETE_CARDS_SUCCESS = 'DELETE_CARDS_SUCCESS';
export const deleteCardsSuccess = id => {
  return {
    type: DELETE_CARDS_SUCCESS,
    cardsId: id
  };
};
/*
* function to delete a cards
* @params id - id of the cards to delete
* @params deleteCardsSuccess or passed in action
* @dispatch deleteCardsSuccess or passed in action
*/
export const deleteCards = (id, action = deleteCardsSuccess) => dispatch => {
  return request.delete(`/cards/${id}`)
    .then((res) => {
      if (!res.ok) return Promise.reject(res.statusText);
      dispatch(action(id));
    });
};
/*
* action to tell store that a cards has been updated
* @params cards - cards to be sent to store
* @params id - id of the cards to update in the store
* @returns action type and cards
*/
export const UPDATE_CARDS_SUCCESS = 'UPDATE_CARDS_SUCCESS';
export const updateCardsSuccess = function(id, cards) {
  const items = (normalize(cards, {
    cards: cardsSchema
  })).entities;
  return {
    type: UPDATE_CARDS_SUCCESS,
    items,
    cardsId: id
  };
};
/*
* function to update the cards
* @params id - id of the cards to update
* @params postData - cards to update on the board
* @params updateCardsSuccess or passed in action
* @dispatch updateCardsSuccess or passed in action
*/
export const updateCards = (id, postData, action = updateCardsSuccess) => dispatch => {
  return request.put(`/cards/${id}`)
  .send(postData)
    .then((res) => {
      if (!res.ok) return Promise.reject(res.statusText);
      dispatch(action(id, postData));
    });
};
