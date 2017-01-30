var React = require('react');
var Cards = require('./cards');
var connect = require('react-redux').connect;
var actions = require('./actions');
var CreateItems = require('./create-items');
//function to render multiple lists of cards
var CardsListName = React.createClass({
  getInitialState: function() {
    return {showCreateCardsList: false};
  },
  //keep track of text
  onAddInputChanged: function(event) {
    this.setState({cardsList: event.target.value});
  },
  showCreateCardsList: function() {
    this.setState({showCreateCardsList: true});
  },
  //function to add a new board by dispatching post request
  addCardsList: function() {
    this.props.dispatch(
      //dispatch query boards
      actions.queries('cardslists', 'POST', {title: this.state.cardsList},
      'create cardslist', this.props.params.boardId.replace(':', ''))
    );
    this.setState({showCreateCardsList: false});
  },
  render: function() {
      //remove : from variable due to routing
      var boardName = this.props.params.boardName.replace(':', '');
      var boardId = this.props.params.boardId.replace(':', '');
      //iterate over props.boards and get the item that matches the boardid
      var board = this.props.boards[Object.keys(this.props.boards).find(item => {
          //if the id of props.boards matches boardid
        return this.props.boards[item]._id === parseInt(boardId);
      })];
      var cardsList = Object.keys(this.props.cardsList).map((item, index) => {
        if (board.cardsList.indexOf(this.props.cardsList[item]._id) > -1) {
          return (
            <li key={index}>
              <h3>{this.props.cardsList[item].title}</h3>
              <Cards.Container
                  cardsListId={item} key={index} boardId={boardId}/>
            </li>
          );
        }
      });

      return (
        <div className="board">
          <div className="board-name">
            <h1>{boardName}</h1>
          </div>
          <div className="board-list">
            <ul>
              {cardsList}
            </ul>
            <input type="button" value="Add Cards List" onClick={this.showCreateCardsList}/>
              {this.state.showCreateCardsList ? <CreateItems.Container
                onAddInputChanged={this.onAddInputChanged} addItems={this.addCardsList}/> : null}
          </div>
        </div>
      );
  }

});
//allows subcription to redux updates and access to data stored in redux store
var mapStateToProps = function(state) {
  return {
    boards: state.boards,
    cardsList: state.cardsList
  };
};
//connects component to redux store
var Container = connect(mapStateToProps)(CardsListName);
module.exports = {
  Container,
  CardsListName
};
