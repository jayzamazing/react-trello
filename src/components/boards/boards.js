import React from 'react';
import {connect} from 'react-redux';
import { Router, hashHistory } from 'react-router';
import CreateItems from '../utils/create-items';
import * as actions from './BoardActions';
import {Immutable} from 'seamless-immutable';
//function to render multiple lists of boards
var BoardsListName = React.createClass({
  //set up initial data state
  getInitialState: function() {
    return {
      showCreateBoard: false,
      editBoard: {},
      boards: {},
      boardTitle: ''
    };
  },
  //keep track of text
  onAddInputChanged: function(event) {
    //if the addBoard input is being used
    if (event.target.name == 'addBoard') {
      //store title for board
      this.setState({boardTitle: event.target.value});
      //otherwise assume we are editing board name
    } else {
      //get boards from state
      var temp = this.state.boards;
      //update the title for the selected board
      var temp2 = Immutable.update(temp,
        event.target.id,
        function() {
          return {
            title: event.target.value
          };
        });
      //store the updated board title
      this.setState({boards: temp2});
    }
  },
  //function to add a new board by dispatching post request
  addBoard: function() {
    this.props.dispatch(
      //dispatch to create a board
      actions.createBoards({title: this.state.boardTitle})
    );
    this.setState({showCreateBoard: false});
  },
  //function to delete a board by dispatching delete request
  deleteBoard: function(boardId) {
    this.props.dispatch(
      //dispatch to delete a board
      actions.deleteBoards(boardId)
    );
    this.forceUpdate();
  },
  //function to edit the name of the board
  updateBoard: function(boardId, boardName) {
    this.props.dispatch(
      //dispatch tp update a board
      actions.updateBoards(boardId, {title: boardName})
    );
    this.forceUpdate();
  },
  componentDidMount() {
    this.props.dispatch(
      //dispatch to get all boards
      actions.getBoards()
    );
  },
  //set the variable to show the create board inputs
  showCreateBoard: function() {
    this.setState({showCreateBoard: true});
  },
  handleKeyPress: function(events) {
    if(events.charCode==13){
      var temp = this.state.editBoard;
      temp[events.target.id] = true;
      this.setState({editBoard: temp});
      this.updateBoard(events.target.id, events.target.value);
    }
  },
  //set variable to enable the editing of the boards name
  editBoardName: function(item) {
    var temp = this.state.editBoard;
    temp[item] = false;
    this.setState({editBoard: temp});
  },
  showBoard: function(boardId, boardName, item) {
    if (this.state.editBoard[item] == undefined) {
      var temp = this.state.editBoard;
      temp[item] = true;
      this.setState({editBoard: temp});
    }
    if (this.state.editBoard[item] == true) {
      hashHistory.push('/:' + boardId + '/:' + boardName);
    }
  },
  render: function() {
    var context = this;
    //only execute if there is data
    if (this.props.boards) {
      var list = Object.keys(this.props.boards).map(function(item, index) {
        var temp = context.props.boards[item];
        return (
          <li key={index}>
            <span onClick={context.showBoard.bind(null, temp._id, temp.title, temp._id)}>
              <input type="text" id={temp._id} value={context.state.boards[temp._id] ? context.state.boards[temp._id].title : temp.title}
                disabled={(context.state.editBoard[temp._id] == undefined) ? true : context.state.editBoard[temp._id] }
                onChange={context.onAddInputChanged}
                onKeyPress={context.handleKeyPress}/>
            </span>
            <input type="button" value="Delete Board"
              onClick={context.deleteBoard.bind(null, temp._id)}/>
            <input type="button" value="Edit Board"
              onClick={context.editBoardName.bind(null, temp._id)}/>
          </li>
        );
      });
    }
    return (
      <div>
        <ul>{list}</ul>
        <input type="button" value="Add Board" onClick={this.showCreateBoard}/>
        {this.state.showCreateBoard ?
          <CreateItems onAddInputChanged={this.onAddInputChanged}
            addItems={this.addBoard} name="addBoard"/> : null}
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
