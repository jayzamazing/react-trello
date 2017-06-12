var React = require('react');
var connect = require('react-redux').connect;
var actions = require('./actions');
var CreateItems = require('./create-items');

//component to store list of cards and text
var CardsContainer = React.createClass({
  //set up initial data state
  getInitialState: function() {
    showCreateCards: false,
    editCards: {},
    cards: {},
    text: ''
  },
  //keep track of text
  onAddInputChanged: function(event) {
    //if the addCards input is being used
    if (event.target.name == 'addCards') {
        this.setState({text: event.target.value});
    //otherwise assume we are editing cards name
    } else {
      //get cards from state
      var temp = this.state.cards;
      //update the title for the selected cards
      var temp = Immutable.update(temp,
      event.target.id,
      function() {
        return {
          text: event.target.value
        }
      });
      //store the updated cards
      this.setState({cardsList: temp});
    }
  },
  //function to add a new card
  addCards: function() {
    this.props.dispatch(
      //dispatch query cards
      actions.queries('cards', 'POST', {text: this.state.text},
      'create cards', this.props.cardsListId, this.props.boardId)
    );
    //hide the following input
    this.setState({showCreateCards: false});
  },
  //function to delete a card
  deleteCards: function(cardId) {
    //dispatch query cards
    this.props.dispatch(
      actions.queries('cards', 'DELETE', cardId, 'delete cards')
    );
  },
  //function to edit the text in a card
  updateCards: function(cardsId, cardsText) {
    this.props.dispatch(
      actions.queries('cards', 'PUT', {text: cardsText}, 'update cards', cardsId)
    );
    this.forceUpdate();
  },
  showCreateCards: function() {
    this.setState({showCreateCards: true});
  },
  //deal with the user hitting enter from the input and updating the cards
  handleKeyPress: function(events) {
    if(events.charCode == 13) {
      var temp = this.state.editCards;
      temp[events.target.id] = true;
      this.setState({editCards: temp});
      this.updateCards(events.target.id, events.target.value);
    }
  },
  //set variable to enable the editing of the cards text
  editCardsText: function(item) {
    var temp = this.state.editCards;
    temp[item] = false;
    this.setState({editCards: temp});
  },
  render: function() {
    var context = this;
    var cardsList = this.props.cardsList[Object.keys(this.props.cardsList).find(item => {
        //if the id of props.cardslist matches cardslistid
      return this.props.cardsList[item]._id === parseInt(this.props.cardsListId);
    })];
    //function to render multiple cards
    var cards = Object.keys(this.props.cards).map((item, index) => {
      if (cardsList.cards.indexOf(this.props.cards[item]._id) > -1) {
        var temp = context.props.cards[item];
        return (
          <li key={index}>
            <input type="text" id={temp._id} value={context.state.cards[temp._id] ? context.state.cards[temp._id].title : temp.title}
              disabled={(context.state.editCards[temp._id] == undefined) ? true : context.state.editCards[temp._id]}
              onChange={context.onAddInputChanged}
              onKeyPress={context.handleKeyPress}/>
            <input type="button" value="Delete Card"
              onClick={context.deleteCards.bind(null, temp._id)}/>
              <input type="button" value="Edit Card"
                onClick={context.editCardsText.bind(null, temp._id)}/>
          </li>
        );
      }
    });
    return (
      <div>
        <ul>
          {cards}
        </ul>
          <input type="button" value="Add Cards" onClick={this.showCreateCards}/>
          {this.state.showCreateCards ? <CreateItems.Container
              onAddInputChanged={this.onAddInputChanged}
              addItems={this.addCards.bind(null, this.props.cardsListId)}/> : null}
      </div>
    );
  }
});
//allows subcription to redux updates and access to data stored in redux store
var mapStateToProps = function(state) {
  return {
    cardsList: state.cardsList,
    cards: state.cards
  };
};
var Container = connect(mapStateToProps)(CardsContainer);
module.exports = {
  Container,
  CardsContainer
};
