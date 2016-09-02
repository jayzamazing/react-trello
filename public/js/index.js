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
  for (var i = 0; i < 3; i++) {
    props.cards.push(<Card />);
  }
  return (
    <div className="list">
      <div className="list-name">
        {props.title}
      </div>
      <div className="list-cards">
        {props.cards}
      </div>
    </div>
  );
};
//function to render multiple lists of cards
var Board = function(props) {
  for (var i = 0; i < 3; i++) {
    props.cardsList.push(<List />);
  }
  return (
      <div className="board">
        <div className="board-name">
          {{props.title}}
        </div>
        <div className="board-list">
          {props.cardsList}
        </div>
      </div>
  );
};
//render the data onto div with id app
document.addEventListener('DOMContentLoaded', function() {
    ReactDOM.render(<Board />, document.getElementById('app'));
});
