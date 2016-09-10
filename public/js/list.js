var React = require('react');
//function to render text
var Card = function(props) {
    return (
        <List>
            <ListItem>
                {props.text}
            </ListItem>
        </List>
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
var Form = function(props) {
  return <form className={props.className} onSubmit={props.onSubmit}>{props.children}</form>
};
var List = function(props) {
  return <ul>{props.children}</ul>
};
var ListItem = function(props) {
  return <li>{props.children}</li>
};
//function to render multiple cards
var Lists = function(props) {
    var handleSubmit = function(e) {
      e.preventDefault();
    };
    var cards = props.cards.map((elem, index) => {
        return (<Card key={index} text={elem.text}/>)
    });
    return (
      <List>
          <ListItem>
            <h3>{props.title}</h3>
              {cards}
            <Form className="list-form" onSubmit={handleSubmit}>
              <Input onChange={props.onChange} />
              <Submit onClick={props.onClick} />
            </Form>
          </ListItem>
      </List>
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
      <Lists title={this.props.title} cards={this.state.cards} onClick={this.onAddSubmit} onChange={this.onAddInputChanged}/>
    );
  }
});
module.exports = ListContainer;
