'use strict';
var React = require('react');
var TestUtils = require('react-addons-test-utils');
var chai = require('chai');
chai.use(require('chai-shallow-deep-equal'));
var should = chai.should();

var Board_List = require('../../../public/js/board-list');
var boards = {};
before(() => {
  boards = { '1': { _id: 1, title: 'blah' },
     '2': { _id: 2, title: 'shopping list' } }
});
after(() => {
  boards = {};
});
describe('List component', function() {
    it('Renders the list item', function() {
      // var list = Object.keys(this.props.boards).map(function(item, index) {
      //   return (<input key={index} type="button"
      //   onClick={context.showBoard.bind(null, item)} id={item._id} value={item.title}/>);
      // });
      //create instance of render
      var renderer = TestUtils.createRenderer();
      //render an image component
      renderer.render(<Board_List.BoardsListName boards={boards}/>);
      //get the rendered react component to test against
      var result = renderer.getRenderOutput();
      //check class name is correct
      result.type.should.shallowDeepEqual('div');
      //get props
      var board_list = result.props;
      //test props for various values
      board_list.children[0].type.should.shallowDeepEqual('input');
      var board_list_item = board_list.children[0].props;
      board_list_item.id.should.equal(boards[1]._id);
      board_list_item.value.should.equal(boards[1].value);
    });
  });
