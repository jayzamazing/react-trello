'use strict';
import request from 'superagent';

/*
* action to tell store that a cardslist has been created
* @params data - data to be sent to store
* @returns action type and data
*/
export const CREATE_CARDSLIST_SUCCESS = 'CREATE_CARDSLIST_SUCCESS';
export const createCardsListSuccess = function(cardslist) {
  return {
    type: CREATE_CARDSLIST_SUCCESS,
    cardslist
  };
};
/*
* function to create a board
* @params postData - data to update on the board
* @params createBoardSuccess or passed in action
* @dispatch createBoardSuccess or passed in action
*/
export const createCardsList = (id, postData, action = createCardsListSuccess) => dispatch => {
  return request.post('/cardslist')
  .send(postData)
  .set('Accept', 'application/json')
    .then(res => {
      if (!res.ok) return Promise.reject(res.statusText);
      return dispatch(action(res.body));
    });
};
// const DELETE_CARDSLIST_SUCCESS = 'DELETE_CARDSLIST_SUCCESS';
// var deleteCardslistSuccess = function(data) {
//   return {
//     type: 'DELETE_CARDSLIST_SUCCESS',
//     boards: data
//   };
// };
// const UPDATE_CARDSLIST_SUCCESS = 'UPDATE_CARDSLIST_SUCCESS';
// var updateCardsListSuccess = function(data) {
//   return {
//     type: 'UPDATE_CARDSLIST_SUCCESS',
//     boards: data
//   };
// }
