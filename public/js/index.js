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
    var cards = props.cards.map((elem, index) => {
        return (<Card key={index} text={elem.text}/>)
    });
    return (
      <div className="list">
          <div className="list-name">
              <h3>{props.title}</h3>
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
      cards: this.props.cards//anti-pattern, remove later
    }
  },
  onAddInputChanged: function(event) {
    this.setState({text: event.target.value});
  },
  onAddSubmit: function() {
    var temp = this.state.cards;
    temp.push({text: this.state.text});
    this.setState({cards: temp});
  },
  render: function() {
    return (
      <List title={this.props.title} cards={this.state.cards} onClick={this.onAddSubmit} onChange={this.onAddInputChanged}/>
    );
  }
});
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
//render the data onto div with id app
document.addEventListener('DOMContentLoaded', function() {
    ReactDOM.render(
        <Board />, document.getElementById('app'));
});
