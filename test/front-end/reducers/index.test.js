var chai = require('chai');
import reducer from '../../../public/js/reducers.js';
import actions from '../../../public/js/actions.js';
import store from '../../../public/js/store.js';

//use should
var should = chai.should();

const boards =
    [{
        "_id": 1,
        "title": "blah",
        "cardsList": [{
            "_id": 1,
            "title": "something",
            "cards": [{
                "_id": 1,
                "text": "ummmm"
            }, {
                "_id": 2,
                "text": "food"
            }]
        }, {
            "_id": 2,
            "title": "hungry",
            "cards": [{
                "_id": 3,
                "text": "special"
            }, {
                "_id": 4,
                "text": "taco"
            }]
        }]
    }, {
        "_id": 2,
        "title": "shopping list",
        "cardsList": [{
            "_id": 3,
            "title": "groceries",
            "cards": [{
                "_id": 5,
                "text": "apple"
            }, {
                "_id": 6,
                "text": "pie"
            }]
        }, {
            "_id": 4,
            "title": "clothes",
            "cards": [{
                "_id": 7,
                "text": "pants"
            }, {
                "_id": 8,
                "text": "shirt"
            }]
        }]
    }];
describe('trelloReducer', () => {
    describe('BOARD_DESERIALIZATION', () => {
        let state;
        before(() => {
            state = reducer.trelloReducer(undefined, actions.boardDeserialization(boards));
        });
        it('should exist', () => {
          should.exist(state.boards);
        });
        it('should have properties', () => {
          state.boards.should.have.property('1');
          state.boards['2'].should.have.property('title');
          state.boards['2'].should.have.property('cardsList');
        });
        it('should deserialize the order', () => {
          state.boards['1'].should.have.property('_id');
          state.boards['1']._id.should.equal(1);
          state.boards['2'].title.should.equal('shopping list');
          state.boards['2'].cardsList.should.be.an('array')
            .to.include.members([3, 4]);
        });
    });

});
