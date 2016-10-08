var React = require('react');
var connect = require('react-redux').connect;
var router = require('react-router');
var hashHistory = router.hashHistory;
var CreateBoard = require('./create-board');

var BoardsListName = React.createClass({
  getInitialState: function() {
    return {showCreateBoard: false};
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
        {this.state.showCreateBoard ? <CreateBoard.Container /> : null}
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
