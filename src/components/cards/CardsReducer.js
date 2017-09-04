import Immutable from 'seamless-immutable';
import * as CardsActions from './CardsActions';
const initialRepositoryState = Immutable({
  cards: {}
});

/*
* Function called when FIND_BOARDS_SUCCESS or CREATE_CARDS_SUCCESS is called to update cards with a new cards
* params state- old state before merge
* params action.items.cards- cards to add to the state
*/
export const createCards= (state, action) => state.merge({cards: action.items.cards});

/*
* Function called when DELETE_CARDS_SUCCESS is called to deal with deleting a Cards and removing it from state
* params state- old state before merge
* params action.cardsid- Cards to delete
*/
export const deleteCards= (state, action) => Immutable({cards: Immutable.without(state.cards, action.cardsId)});

/*
* Function called when UPDATE_CARDS_SUCCESS is called to update cardslsit with a new cards
* params state- old state before merge
* params action.items.cardslsit- cards to update
*/
export const updateCards= (state, action) => Immutable({cards: Immutable.update(state.cards,
Object.keys(action.items.cards), () => action.items.cards[Object.keys(action.items.cards)])});

/*
* Function to deal with using various reducer functions
* params state- old state before merge
* params action- action with data to modify state
*/
export const trelloReducer = (state, action) => {
  state = state || initialRepositoryState;
  switch (action.type) {
  case 'FIND_BOARDS_SUCCESS':
  case CardsActions.CREATE_CARDS_SUCCESS:
    return createCards(state, action);
  case CardsActions.DELETE_CARDS_SUCCESS:
    return deleteCards(state, action);
  case CardsActions.UPDATE_CARDS_SUCCESS:
    return updateCards(state, action);
  }
};
