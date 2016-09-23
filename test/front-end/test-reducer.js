import reducer from '../../../public/js/reducers.js';
import actions from '../../../public/js/actions.js';
const boards =
    [{
        "id": 1,
        "title": "blah",
        "cardsList": [{
            "id": 1,
            "title": "something",
            "cards": [{
                "id": 1,
                "text": "ummmm"
            }, {
                "id": 2,
                "text": "food"
            }]
        }, {
            "id": 2,
            "title": "hungry",
            "cards": [{
                "id": 3,
                "text": "special"
            }, {
                "id": 4,
                "text": "taco"
            }]
        }]
    }, {
        "id": 2,
        "title": "shopping list",
        "cardsList": [{
            "id": 3,
            "title": "groceries",
            "cards": [{
                "id": 5,
                "text": "apple"
            }, {
                "id": 6,
                "text": "pie"
            }]
        }, {
            "id": 4,
            "title": "clothes",
            "cards": [{
                "id": 7,
                "text": "pants"
            }, {
                "id": 8,
                "text": "shirt"
            }]
        }]
    }];


describe('trelloReducer', () => {
    describe('BOARD_DESERIALIZATION', () => {
        let state;
        beforeEach(() => {
            state = reducer.trelloReducer(undefined, actions.boardDeserialization(boards[0]));
        });
        it('should deserialize the order', () => {
            console.log(state);
        });
    })
});
