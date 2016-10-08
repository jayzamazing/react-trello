var React = require('react');
var connect = require('react-redux').connect;
var actions = require('./actions');

var CreateBoard = React.createClass({
  //ignore form submit and use button
  handleSubmit: function(event) {
    event.preventDefault();
  },
  //keep track of text
  onAddInputChanged: function(event) {
    this.setState({board: event.target.value});
  },
  //function to add a new board by dispatching post request
  addBoard: function() {
    this.props.dispatch(
      //dispatch query boards
      actions.queryBoards('boards', 'POST', {title: this.state.board}, 'create board')
    );
  },
  render: function() {
    return (
      <form className="list-form" onSubmit={this.handleSubmit}>
        <input type="text" onChange={this.onAddInputChanged}/>
        <input type="button" value="Submit" onClick={this.addBoard}/>
      </form>
    );
  }
});
var Container = connect()(CreateBoard);
module.exports = {
  Container,
  CreateBoard
};
