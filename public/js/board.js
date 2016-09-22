var React = require('react');
var List = require('./list')
var connect = require('react-redux').connect;
var router = require('react-router');
var Router = router.Router;
var Route = router.Route;
var hashHistory = router.hashHistory;
var IndexRoute = router.IndexRoute;
//function to render multiple lists of cards
var Board = function(props) {
    var list = props.boards[props.params.board_name.replace(':', '')].cardsList.map((elem, index) => {
        return (<List.ListContainer title={elem.title} cards={elem.cards} key={index}/>)
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
var mapStateToProps = function(state, props) {
  return {
    boards: state.boards
  };
};
var Container = connect(mapStateToProps)(Board);
module.exports = Container;
