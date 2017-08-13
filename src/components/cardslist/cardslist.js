var React = require('react');
var Cards = require('./cards');
var connect = require('react-redux').connect;
var actions = require('./CardsListActions');
var CreateItems = require('./create-items');
var Immutable = require('seamless-immutable');
//function to render multiple lists of cards
var CardsListName = React.createClass({
  //set up initial data state
  getInitialState: function() {
    return {showCreateCardsList: false, editCardsList: {}, cardsList: {}, cardsListTitle: ''};
  },
  //keep track of text
  onAddInputChanged: function(event) {
    //if the addCardsList input is being used
    if (event.target.name == 'addCardsList') {
      this.setState({cardsListTitle: event.target.value});
      //otherwise assume we are editing cardslist name
    } else {
      //get cardslist from state
      var temp = this.state.cardsList;
      //update the title for the selected cardsList
      var temp2 = Immutable.update(temp, event.target.id, function() {
        return {title: event.target.value};
      });
      //store the updated cardslist title
      this.setState({cardsList: temp2});
    }
  },
  //function to add a new board
  addCardsList: function() {
    this.props.dispatch(
    //dispatch query boards
    actions.queries('cardslists', 'POST', {
      title: this.state.cardsList
    }, 'create cardslist', this.props.params.boardId.replace(':', '')));
    //hide the following input
    this.setState({showCreateCardsList: false});
  },
  //function to delete a cardslist
  deleteCardsList: function(cardsListId) {
    this.props.dispatch(
    //dispatch query cardslist
    actions.queries('cardslists', 'DELETE', cardsListId, 'delete cardslist'));
  },
  //function to edit the name of the cardsList
  updateCardsList: function(cardsListId, cardsListName) {
    this.props.dispatch(actions.queries('cardslists', 'PUT', {
      title: cardsListName
    }, 'update cardslist', cardsListId));
    this.forceUpdate();
  },
  //set the variable to show the create cardslist inputs
  showCreateCardsList: function() {
    this.setState({showCreateCardsList: true});
  },
  //deal with the user hitting enter from the input and updating the cardslist
  handleKeyPress: function(events) {
    if (events.charCode == 13) {
      var temp = this.state.editCardsList;
      temp[events.target.id] = true;
      this.setState({editCardsList: temp});
      this.updateCardsList(events.target.id, events.target.value);
    }
  },
  //set variable to enable the editing of the cardslist name
  editCardsListName: function(item) {
    var temp = this.state.editCardsList;
    temp[item] = false;
    this.setState({editCardsList: temp});
  },
  render: function() {
    var context = this;
    if (this.props.cardsList) {
      var boardName = context.props.params.boardName.replace(':', '');
      var boardId = context.props.params.boardId.replace(':', '');
      //iterate over props.boards and get the item that matches the boardid
      var board = context.props.boards[Object.keys(context.props.boards).find(item => {
          //if the id of props.boards matches boardid
        return context.props.boards[item]._id == boardId;
      })];
      //function to render multiple cardslist
      var cardsList = Object.keys(context.props.cardsList).map((item, index) => {
        if (board.cardsList.indexOf(context.props.cardsList[item]._id) > -1) {
          var temp = context.props.cardsList[item];
          return (
            <li key={index}>
              <input type="text" id={temp._id} value={context.state.cardsList[temp._id]
                ? context.state.cardsList[temp._id].title
                : temp.title} disabled={(context.state.editCardsList[temp._id] == undefined)
                ? true
                : context.state.editCardsList[temp._id]} onChange={context.onAddInputChanged} onKeyPress={context.handleKeyPress}/>
              <Cards.Container cardsListId={item} key={index} boardId={boardId}/>
              <input type="button" value="Delete Cardslist" onClick={context.deleteCardsList.bind(null, temp._id)}/>
              <input type="button" value="Edit Cardslist" onClick={context.editCardsListName.bind(null, temp._id)}/>
            </li>
          );
        }
      });
    }
    return (
      <div className="board">
        <div className="board-name">
          <h1>{boardName}</h1>
        </div>
        <div className="board-list">
          <ul>
            {cardsList}
          </ul>
          <input type="button" value="Add Cards List" onClick={this.showCreateCardsList}/> {this.state.showCreateCardsList
            ? <CreateItems.Container onAddInputChanged={this.onAddInputChanged} addItems={this.addCardsList} name="addCardsList"/>
            : null}
        </div>
      </div>
    );
  }

});
//allows subcription to redux updates and access to data stored in redux store
var mapStateToProps = function(state) {
  return {boards: state.boards, cardsList: state.cardsList};
};
//connects component to redux store
var Container = connect(mapStateToProps)(CardsListName);
module.exports = {
  Container,
  CardsListName
};
