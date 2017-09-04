import Immutable from 'seamless-immutable';
import * as CardsListActions from './CardsListActions';
const initialRepositoryState = Immutable({
  cardslist: {}
});

/*
* Function called when FIND_BOARDS_SUCCESS or CREATE_CARDSLIST_SUCCESS is called to update cardslist with a new cardslist
* params state- old state before merge
* params action.items.cardslist- cardslist to add to the state
*/
export const createCardslist= (state, action) => state.merge({cardslist: action.items.cardslist});

/*
* Function called when DELETE_CARDSLIST_SUCCESS is called to deal with deleting a Cardslist and removing it from state
* params state- old state before merge
* params action.cardslistid- Cardslist to delete
*/
export const deleteCardslist= (state, action) => Immutable({cardslist: Immutable.without(state.cardslist, action.cardslistId)});

/*
* Function called when UPDATE_CARDSLIST_SUCCESS is called to update cardslsit with a new cardslist
* params state- old state before merge
* params action.items.cardslsit- cardslist to update
*/
export const updateCardslist= (state, action) => Immutable({cardslist: Immutable.update(state.cardslist,
Object.keys(action.items.cardslist), () => action.items.cardslist[Object.keys(action.items.cardslist)])});

/*
* Function to deal with using various reducer functions
* params state- old state before merge
* params action- action with data to modify state
*/
export const trelloReducer = (state, action) => {
  state = state || initialRepositoryState;
  switch (action.type) {
  case 'FIND_BOARDS_SUCCESS':
  case CardsListActions.CREATE_CARDSLIST_SUCCESS:
    return createCardslist(state, action);
  case CardsListActions.DELETE_CARDSLIST_SUCCESS:
    return deleteCardslist(state, action);
  case CardsListActions.UPDATE_CARDSLIST_SUCCESS:
    return updateCardslist(state, action);
  }
};
