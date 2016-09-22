var React = require('react');
var connect = require('react-redux').connect;
var router = require('react-router');
var Router = router.Router;
var Route = router.Route;
var hashHistory = router.hashHistory;
var IndexRoute = router.IndexRoute;
var Link = router.Link;
var Board = require('./board');

var BoardsListName = React.createClass({
  showBoard: function(boardName) {
    hashHistory.push('/:' + boardName);
  },
  render: function() {
    var context = this;
    var list = Object.keys(this.props.boards).map(function(item, index) {
      return (<input key={index} type="button" onClick={context.showBoard.bind(null, {item})} value={item}/>);
    });
    return (
      <div>
        {list}
      </div>
    );
  }
});

var mapStateToProps = function(state, props) {
  return {
    boards: state.boards
  };
};
var Container = connect(mapStateToProps)(BoardsListName)
module.exports = Container;
