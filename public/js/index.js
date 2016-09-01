var React = require('react');
var ReactDOM = require('react-dom');
//function to render text
var Card = function() {
  var text = "This is a card";
  return (
      <div className="card">
        <div className="card-text">
          {text}
        </div>
      </div>
  );
};
//function to render multiple cards
var List = function() {
  var cards = [];
  for (var i = 0; i < 3; i++) {
    cards.push(<Card />);
  }
  return (
    <div className="list">
      {cards}
    </div>
  );
};
//function to render multiple lists of cards
var Board = function() {
  var cardsList = [];
  for (var i = 0; i < 3; i++) {
    cardsList.push(<List />);
  }
  return (
      <div className="board">
        {cardsList}
      </div>
  );
};
//render the data onto div with id app
document.addEventListener('DOMContentLoaded', function() {
    ReactDOM.render(<Board />, document.getElementById('app'));
});
