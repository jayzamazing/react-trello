var React = require('react');
var ListContainer = require('./list.js')
//function to render multiple lists of cards
var Board = function(props) {
    var list = props.cardsList.map((elem, index) => {
        return (<ListContainer title={elem.title} cards={elem.cards} key={index}/>)
    });
    return (
        <div className="board">
            <div className="board-name">
                <h1>{props.title}</h1>
            </div>
            <div className="board-list">
                {list}
            </div>
        </div>
    );
};
//drop some default data into board
Board.defaultProps = {
    title: 'blah',
    cardsList: [
        {
            title: 'something',
            cards: [
                {
                    text: 'ummmm'
                }, {
                    text: 'food'
                }
            ]
        },
        {
            title: 'hungry',
            cards: [
                {
                    text: 'special'
                }, {
                    text: 'taco'
                }
            ]
        }
    ]
};
module.exports = Board;
