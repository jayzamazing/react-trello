var chai = require('chai');
import actions from '../../../public/js/actions';
import thunk from 'redux-thunk';
import nock from 'nock';
import configureMockStore from 'redux-mock-store';
//use should
chai.should();

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
var board = function(board, cardsList, cards) {
  var temp = {
    'title': null,
    '_id': null,
    'cardsList': [{
      'title': null,
      '_id': null,
      'cards': [{
        'text': null,
        '_id': null,
      }]
    }]
  };
  if (board) {
    temp.title = board.title;
    temp._id = board._id;
  }
  if (cardsList) {
    temp.cardsList[0].title = cardsList.title;
    temp.cardsList[0]._id = cardsList._id;
  }
  if (cards) {
    temp.cardsList[0].cards[0].text = cards.text;
    temp.cardsList[0].cards[0]._id = cards._id;
  }
  return temp;
};
describe('trello actions', () => {
  before(() => {
    //create a mock server response
    nock('http://localhost:3030')
      //request to create a board
      .post('/boards')
      //send back reply to request
      .reply((uri, requestBody) => {
        //return response
        return [
          200,
          board({'title': JSON.parse(requestBody).title, '_id': 7})
        ];
      })
      //request to get a board
      .get('/boards/1')
      .query(true)
      //send back reply to request
      .reply(() => {
        //return response
        return [
          200,
          board({'title': 'bleh', '_id': 1}, {'title': 'bleh', '_id': 1}, {'_id': 1, 'text': 'superman'})
        ];
      })
      .patch('/boards/1')
      //send back reply to request
      .reply((uri, requestBody) => {
        //return response
        return [
          200,
          board({'_id': 1,'title': 'blah'}, {'_id': JSON.parse(requestBody).$push.cardsList, 'title': 'fun'},
          {'_id': 1, 'text': 'ummmm'})
        ];
      })
      .delete('/boards/1')
      .reply(() => {
        //return response
        return [
          200,
          board({'title': 'blah', _id: 7})
        ];
      })
      //update a board
      .put('/boards/1')
      .reply(() => {
        return [
          200,
          board({'title': 'bleh', _id: 1})
        ];
      })
      //request to create cardsList
      .post('/cardslists')
      //send back reply to request
      .reply((uri, requestBody) => {
        //return response
        return [
          200,
          board({'title': 'bleh', '_id': 1}, {'_id': 1, 'title': JSON.parse(requestBody).title})
        ];
      })
      .patch('/cardslists/1')
      //send back reply to request
      .reply((uri, requestBody) => {
        //create json obj out of the request
        var temp = JSON.parse(requestBody);
        var jsonObj = temp.$push;
        //add _id field to json
        jsonObj['_id'] = (1);
        //return response
        return [
          200,
          board({'title': 'bleh', '_id': 1}, {'title': 'bleh', '_id': 1}, {'_id': 1, 'text': 'superman'})
        ];
      })
      .delete('/cardslists/1')
      .reply(() => {
        //return response
        return [
          200,
          board({'title': 'bleh', '_id': 1}, {'title': 'hello', _id: 5})
        ];
      })
      //update a cardslist
      .put('/cardslists/2')
      .reply(() => {
        return [
          200,
          board({'title': 'bleh', '_id': 1}, {'title': 'supah man', _id: 2})
        ];
      })
      .post('/cards')
      //send back reply to request
      .reply((uri, requestBody) => {
        //return response
        return [
          200,
          board({'title': 'blah', '_id': 1}, {'title': 'bleh', '_id': 1}, {'_id': 1, 'text': JSON.parse(requestBody).title})
        ];
      }).delete('/cards/1')
      .reply(() => {
        //return response
        return [
          200,
          board(null, null, {'text': 'hello', _id: 9})
        ];
      })
      //update a card
      .put('/cards/2')
      .reply((uri, requestBody) => {
        return [
          200,
          board({'title': 'blah', '_id': 1}, {'title': 'bleh', '_id': 1}, {'text': JSON.parse(requestBody).title, _id: 2})
        ];
      });
  });
  after(() => {
    nock.cleanAll();
  });
  it('should create a board', () => {
    //set up a mockstore
    const store = mockStore({
      boards: {}
    });
    //call createboard passing a title of the new board
    return store.dispatch(actions.queries('boards', 'POST', {
      title: 'blah'
    }, 'create board'))
      .then(() => {
        //check response against expected values
        var response = store.getActions()[0];
        response.should.have.property('type');
        response.type.should.equal('CREATE_BOARD_SUCCESS');
        response.boards.should.have.property('title');
        response.boards.title.should.equal('blah');
        response.boards.should.have.property('_id');
        response.boards._id.should.equal(7);
      });
  });
  it('should delete a board', () => {
    //set up a mockstore
    const store = mockStore({
      boards: {}
    });
    //call createboard passing a title of the new board
    return store.dispatch(actions.queries('boards', 'DELETE', 1, 'delete board'))
      .then(() => {
        //check response against expected values
        var response = store.getActions()[0];
        response.should.have.property('type');
        response.type.should.equal('DELETE_BOARD_SUCCESS');
        response.boards.should.have.property('title');
        response.boards.title.should.equal('blah');
        response.boards.should.have.property('_id');
        response.boards._id.should.equal(7);
      });
  });
  it('should update a board', () => {
    //set up a mockstore
    const store = mockStore({
      boards: {}
    });
    //call to update a board
    return store.dispatch(actions.queries('boards', 'PUT', {
      title: 'bleh'
    }, 'update board', 1))
      .then(() => {
        //check response against expected values
        var response = store.getActions()[0];
        response.should.have.property('type');
        response.type.should.equal('UPDATE_BOARD_SUCCESS');
        response.boards.should.have.property('title');
        response.boards.title.should.equal('bleh');
        response.boards.should.have.property('_id');
        response.boards._id.should.equal(1);
      });
  });
  it('should create a cardslist', () => {
    //set up a mockstore
    const store = mockStore({
      boards: {},
      cardsList: {}
    });
    return store.dispatch(actions.queries('cardslists', 'POST', {
      title: 'fun'
    },
        'create cardslist', 1))
      .then(() => {
        //check response against expected values
        var response = store.getActions()[0];
        response.should.have.property('type');
        response.type.should.equal('CREATE_CARDLIST_SUCCESS');
        response.boards.should.have.property('cardsList');
        response.boards.cardsList[0].should.have.property('_id');
        response.boards.cardsList[0]._id.should.equal(1);
        response.boards.cardsList[0].should.have.property('title');
        response.boards.cardsList[0].title.should.equal('fun');
      });
  });
  it('should delete a cardslist', () => {
    //set up a mockstore
    const store = mockStore({
      boards: {},
      cardsList: {}
    });
    return store.dispatch(actions.queries('cardslists', 'DELETE', 1,
        'delete cardslist'))
      .then(() => {
        //check response against expected values
        var response = store.getActions()[0];
        response.should.have.property('type');
        response.type.should.equal('DELETE_CARDSLIST_SUCCESS');
        response.boards.cardsList[0].should.have.property('title');
        response.boards.cardsList[0].title.should.equal('hello');
        response.boards.cardsList[0].should.have.property('_id');
        response.boards.cardsList[0]._id.should.equal(5);
      });
  });
  it('should update a cardslist', () => {
    //set up a mockstore
    const store = mockStore({
      boards: {},
      cardsList: {}
    });
    //call to update a cardslist
    return store.dispatch(actions.queries('cardslists', 'PUT', {
      title: 'supah man'
    }, 'update cardslist', 2))
      .then(() => {
        //check response against expected values
        var response = store.getActions()[0];
        response.should.have.property('type');
        response.type.should.equal('UPDATE_CARDSLIST_SUCCESS');
        response.boards.cardsList[0].should.have.property('title');
        response.boards.cardsList[0].title.should.equal('supah man');
        response.boards.cardsList[0].should.have.property('_id');
        response.boards.cardsList[0]._id.should.equal(2);
      });
  });
  it('should create a card', () => {
    //set up a mockstore
    const store = mockStore({
      boards: {},
      cardsList: {},
      cards: {}
    });
    return store.dispatch(actions.queries('cards', 'POST', {
      text: 'superman'
    },
    'create cards', 1, 1))
    .then(() => {
      //check response against expected values
      var response = store.getActions()[0];
      response.should.have.property('type');
      response.type.should.equal('CREATE_CARD_SUCCESS');
      response.boards.cardsList[0].cards[0].should.have.property('text');
      response.boards.cardsList[0].cards[0].text.should.equal('superman');
      response.boards.cardsList[0].cards[0].should.have.property('_id');
      response.boards.cardsList[0].cards[0]._id.should.equal(1);
    });
  });
  it('should delete a card', () => {
    //set up a mockstore
    const store = mockStore({
      boards: {},
      cardsList: {},
      cards:{}
    });
    return store.dispatch(actions.queries('cards', 'DELETE', 1,
        'delete cards'))
      .then(() => {
        //check response against expected values
        var response = store.getActions()[0];
        response.should.have.property('type');
        response.type.should.equal('DELETE_CARDS_SUCCESS');
        response.boards.cardsList[0].cards[0].should.have.property('text');
        response.boards.cardsList[0].cards[0].text.should.equal('hello');
        response.boards.cardsList[0].cards[0].should.have.property('_id');
        response.boards.cardsList[0].cards[0]._id.should.equal(9);
      });
  });
  it('should update a card', () => {
    //set up a mockstore
    const store = mockStore({
      boards: {},
      cardsList: {},
      cards:{}
    });
    //call to update a cardslist
    return store.dispatch(actions.queries('cards', 'PUT', {
      title: 'supah man'
    }, 'update cards', 2))
      .then(() => {
        //check response against expected values
        var response = store.getActions()[0];
        response.should.have.property('type');
        response.type.should.equal('UPDATE_CARDS_SUCCESS');
        response.boards.cardsList[0].cards[0].should.have.property('text');
        response.boards.cardsList[0].cards[0].text.should.equal('supah man');
        response.boards.cardsList[0].cards[0].should.have.property('_id');
        response.boards.cardsList[0].cards[0]._id.should.equal(2);
      });
  });
});
