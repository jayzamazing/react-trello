var React = require('react');
var connect = require('react-redux').connect;
var actions = require('./actions');
var CreateItems = require('./create-items');

//component to store list of cards and text
var CardsContainer = React.createClass({
  onAddInputChanged: function(event) {
    this.setState({text: event.target.value});
  },
  addCards: function() {
    this.props.dispatch(
      actions.queries('cards', 'POST', {text: this.state.text},
      'create cards', this.props.cardsListId, this.props.boardId)
    );
  },
  deleteCards: function(cardId) {
    //dispatch query cards
    this.props.dispatch(
      actions.queries('cards', 'DELETE', cardId, 'delete cards')
    );
    // this.forceUpdate();
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
            {this.props.cards[item].text}
            <input type="button" value="Delete Card"
              onClick={context.deleteCards.bind(null, temp._id)}/>
          </li>
        );
      }
    });
    return (
      <div>
        <ul>
          {cards}
        </ul>
          <CreateItems.Container
            onAddInputChanged={this.onAddInputChanged}
            addItems={this.addCards.bind(null, this.props.cardsListId)}/>
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
