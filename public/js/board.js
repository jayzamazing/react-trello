var React = require('react');
var List = require('./list');
var connect = require('react-redux').connect;
var router = require('react-router');
var Router = router.Router;
var Route = router.Route;
var hashHistory = router.hashHistory;
var IndexRoute = router.IndexRoute;
//function to render multiple lists of cards
var Board = function(props) {
    //remove : from variable due to routing
    var boardName = props.params.boardName.replace(':', '');
    var boardId = parseInt(props.params.boardId.replace(':', ''));
    //iterate over props.boards and get the item that matches the boardid
    var board = props.boards[Object.keys(props.boards).find(item => {
      //if the id of props.boards matches boardid
      return props.boards[item]._id === boardId;
    })];
    //set up empty object
    var cardsList = {};
    //iterate over props.cardslist and return items that match board.cardslist array
    for (var item in props.cardsList) {
      //if props.cardslist id has matching id
      if (board.cardsList.includes(props.cardsList[item]._id)) {
        //add item to cardslist object
        cardsList[item] = props.cardsList[item];
      }
    }
    //set up empty objects
    var tempcardsListIds = [], cardsListIds = [];
    //iterate through cardslist.cards and add them to tempcardsListIds
    for (var item in cardsList) {
      tempcardsListIds.push(cardsList[item].cards);
    }
    //flatten array using es6 spread operator
    cardsListIds = [].concat(...tempcardsListIds);
    //set up empty pbject
    var cards = {};
    //iterate over props.cards and return items that match cardslistids array
    for (var item in props.cards) {
      //if props.cards has matching id
      if (cardsListIds.includes(props.cards[item]._id)) {
        cards[item] = props.cards[item];
      }
    }
    //component that deals with displaying the List.Container
    var list = board.cardsList.map((elem, index) => {
      //set up empty objects for sorting
        var tempCardsList = {}, tempCards = {};
        //iterate through cardslist
        for (var item in cardsList) {
          //if board.cardlist has current cardlist id
          if (board.cardsList.includes(cardsList[item]._id)){
            //pass it to tempcardslist
            tempCardsList[item] = cardsList[item];
          }
        }
        //iterate over cards
        for (var item in cards) {
          //if cardsList.cards has current cards id
          if(cardsList[elem].cards.includes(cards[item]._id)) {
            //pass it to tempcards
            tempCards[item] = cards[item];
          }
        }
        return (<List.Container title={tempCardsList[elem].title} cards={tempCards} key={index}
          id={index} board={boardName}/>)
    });
    return (
        <div className="board">
            <div className="board-name">
                <h1>{boardName}</h1>
            </div>
            <div className="board-list">
                {list}
            </div>
        </div>
    );
};
//allows subcription to redux updates and access to data stored in redux store
var mapStateToProps = function(state, props) {
  return {
    boards: state.boards,
    cardsList: state.cardsList,
    cards: state.cards
  };
};
//connects component to redux store
var Container = connect(mapStateToProps)(Board);
module.exports = {
  Container,
  Board
}
