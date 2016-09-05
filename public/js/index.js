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
//function to create an input component
var Input = function(props) {
  return <input type="text" onChange={props.onChange} placeholder={props.placeholder} name={props.name}></input>;
};
//function to create submit input component
var Submit = function(props) {
  return <input type="submit" onClick={props.onClick}></input>;
};
//function to render multiple cards
var List = function(props) {
    var handleSubmit = function(e) {
      e.preventDefault();
    };
    var cards = props.card.map((elem, index) => {
        return (<Card key={elem.key} text={elem.text}/>)
    });
    return (
      <div className="list">
          <div className="list-name">
              <h3>{this.props.title}</h3>
          </div>
          <div className="list-cards">
              {cards}
          </div>
          <div className="list-form-section">
            <form className="list-form" onSubmit={handleSubmit}>
              <Input onChange={props.onChange} />
              <Submit onClick={props.onClick} />
            </form>
          </div>
      </div>
    );
  };
//component to store list of cards and text
var ListContainer = React.createClass({
  getInitialState: function() {
    return {
      text: '',
      cards: []
    }
  },
  onAddInputChanged: function(event) {
    this.setState({text: event.target.value});
  },
  onAddSubmit: function(event) {
    this.setState(cards.push(event.target.value))
  },
  render: function() {
    return (
      <List cards={this.state.cards} onClick={this.onAddSubmit} onChange={this.onAddInputChanged}/>
    );
  }
});
//function to render multiple lists of cards
var Board = function(props) {
    var list = props.cardsList.map((elem) => {
        return (<ListContainer title={elem.title} card={elem.cards} key={elem.key}/>)
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
Board.defaultProps = {
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
        <Board />, document.getElementById('app'));
});
