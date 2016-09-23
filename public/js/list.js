var React = require('react');
var connect = require('react-redux').connect;
var actions = require('./actions');
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
              <Submit onClick={props.onClick.bind(null, props.board, props.id )} />
            </Form>
          </ListItem>
      </List>
    );
  };
//component to store list of cards and text
var ListContainer = React.createClass({
  onAddInputChanged: function(event) {
    this.setState({text: event.target.value});
  },
  onAddSubmit: function(title, id) {
    this.props.dispatch(actions.addBoardCardListItem(title, id, this.state.text));
  },
  render: function() {
    return (
      <Lists title={this.props.title} cards={this.props.cards}
        onClick={this.onAddSubmit} onChange={this.onAddInputChanged} id={this.props.id} board={this.props.board}/>
    );
  }
});
var Container = connect()(ListContainer);
module.exports = {
  Container,
  Lists
};
