var React = require('react');
var connect = require('react-redux').connect;
var router = require('react-router');
var hashHistory = router.hashHistory;
var CreateItems = require('./create-items');
var actions = require('./actions');

var BoardsListName = React.createClass({
  getInitialState: function() {
    return {showCreateBoard: false};
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
    this.setState({showCreateBoard: false});
  },
  componentDidMount() {
    this.props.dispatch(
      //dispatch query boards
      actions.queryBoards('boards', 'FIND', {}, 'find boards')
    );
  },
  showCreateBoard: function() {
    this.setState({showCreateBoard: true});
  },
  showBoard: function(boardId, boardName) {
    hashHistory.push('/:' + boardId + '/:' + boardName);
  },
  render: function() {
    var context = this;
    //only execute if there is data
    if (this.props.boards) {
      var list = Object.keys(this.props.boards).map(function(item, index) {
        var temp = context.props.boards[item];
        return (<input key={index} type="button"
        onClick={context.showBoard.bind(null, temp._id, temp.title)} id={temp._id} value={temp.title}/>);
      });
    }
    return (
      <div>
        {list}
        <input type="button" value="Add Board" onClick={this.showCreateBoard}/>
        {this.state.showCreateBoard ? <CreateItems.Container
          onAddInputChanged={this.onAddInputChanged} addItems={this.addBoard}/> : null}
      </div>
    );
  }
});

var mapStateToProps = function(state) {
  return {
    boards: state.boards
  };
};
var Container = connect(mapStateToProps)(BoardsListName);
module.exports = {
  Container,
  BoardsListName
};
