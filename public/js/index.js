var React = require('react');
var ReactDOM = require('react-dom');
//function to render text
var Card = function(props) {
    return (
        <div className="card">
            <div className="card-text">
                {props.text}
            </div>
        </div>
    );
};
//function to render multiple cards
var List = function(props) {
    var cards = props.card.map((elem, index) => {
        return (<Card key={elem.key} text={elem.text}/>)
    });
    return (
        <div className="list">
            <div className="list-name">
                <h3>{props.title}</h3>
            </div>
            <div className="list-cards">
                {cards}
            </div>
        </div>
    );
};
//function to render multiple lists of cards
var Board = function(props) {
    var list = props.cardsList.map((elem) => {
        return (<List title={elem.title} card={elem.cards} key={elem.key}/>)
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
var data = {
    title: 'blah',
    cardsList: [
        {
            key: 1,
            title: 'something',
            cards: [
                {
                    key: 1,
                    text: 'ummmm'
                }, {
                    key: 2,
                    text: 'food'
                }
            ]
        },
        {
            key: 2,
            title: 'hungry',
            cards: [
                {
                    key: 1,
                    text: 'special'
                }, {
                    key: 2,
                    text: 'taco'
                }
            ]
        }
    ]
};
//render the data onto div with id app
document.addEventListener('DOMContentLoaded', function() {
    ReactDOM.render(
        <Board title={data.title} cardsList={data.cardsList}/>, document.getElementById('app'));
});
