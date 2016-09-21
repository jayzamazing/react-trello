var React = require('react');
var ReactDOM = require('react-dom');
var router = require('react-router');
var Router = router.Router;
var Route = router.Route;
var hashHistory = router.hashHistory;
var IndexRoute = router.IndexRoute;
var Link = router.Link;
var List = require('./list.js')
//function to render multiple lists of cards
var Board = function(props) {
    var list = props[props.boardName].cardsList.map((elem, index) => {
        return (<List.ListContainer title={elem.title} cards={elem.cards} key={index}/>)
    });
    return (
        <div className="board">
            <div className="board-name">
                <h1>{props.board}</h1>
            </div>
            <div className="board-list">
                {list}
            </div>
        </div>
    );
};
var BoardsListName = React.createClass({
  showBoard: function(board) {
    hashHistory.push('/:' + board);
  },
  render: function() {
    var list = Object.keys(this.props.boards).map(function(item) {
      return (<Button onClick={showBoard({item})} value={item}/>);
    });
    return (
      {list}
    );
  }
});
var Button = function(props) {
  return <input type="button" onClick={props.buttonHandler} value={props.value}/>
}
var NavBarContainer = React.createClass({
  showBoards: function() {
    hashHistory.push('/');
  },
  render: function() {
    return (
      <nav className="navBar">
        <Button onClick={this.showBoards()} value="Boards"/>
      </nav>
    );
  }
});
var App = React.createClass({
  defaultProps: {
    boardName: 'blah',
    boards: {
      blah: {
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
    }
    }
  },
  render: function() {
    return (
      <section>
        <NavBarContainer boards={this.defaultProps.boards}/>
        {this.props.children}
      </section>
    );
  }
});
var routes = (
  <Router history={hashHistory}>
    <Route path='/' component={App}>
      <IndexRoute component={BoardsListName} />
    </Route>
  </Router>
);
module.exports = App;
