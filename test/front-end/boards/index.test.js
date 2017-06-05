'use strict';
import React from 'react';
import TestUtils from 'react-addons-test-utils';
import chai from 'chai';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import Boards from '../../../public/js/boards';
import deepEqual from 'chai-shallow-deep-equal';

chai.use(deepEqual);
chai.should();
const middlewares = [ thunk ];
const mockStore = configureMockStore(middlewares);
let boards = {};
//testing for the boards class
describe('Boards component', () => {
  //setup before all tests
  before(() => {
    boards = {
      '1': {
        _id: 1,
        title: 'blah'
      },
      '2': {
        _id: 2,
        title: 'shopping list'
      }
    };
  });
  //tear down after tests are complete
  after(() => {
    boards = {};
  });
  //test showing board data
  it('should render the board items', function() {
    //create instance of render
    let renderer = TestUtils.createRenderer();
    //render an image component
    renderer.render(<Boards.BoardsListName boards={boards}/>);
    //get the rendered react component to test against
    let result = renderer.getRenderOutput();
    //check class name is correct
    result.type.should.shallowDeepEqual('div');
    //get props
    let board = result.props.children;
    //test props for various values
    board[0].type.should.equal('ul');
    board[1].type.should.equal('input');
    board[1].props.type.should.equal('button');
    board[1].props.value.should.equal('Add Board');
    let board_list = board[0].props.children;
    board_list[0].type.should.shallowDeepEqual('li');
    board_list[0].props.children[0].type.should.equal('span');
    let span_input = board_list[0].props.children[0];
    span_input.props.children.type.should.equal('input');
    span_input.props.children.props.value.should.equal('blah');
    board_list[0].props.children[1].type.should.equal('input');
    board_list[0].props.children[1].props.type.should.equal('button');
    board_list[0].props.children[1].props.value.should.equal('Delete Board');
    board_list[1].type.should.shallowDeepEqual('li');
    let span_input2 = board_list[1].props.children[0];
    span_input2.props.children.type.should.equal('input');
    span_input2.props.children.props.value.should.equal('shopping list');
    board_list[1].props.children[1].type.should.equal('input');
    board_list[1].props.children[1].props.type.should.equal('button');
    board_list[1].props.children[1].props.value.should.equal('Delete Board');
    board_list[1].props.children[2].type.should.equal('input');
    board_list[1].props.children[2].props.type.should.equal('button');
    board_list[1].props.children[2].props.value.should.equal('edit Board');
  });
  //test for performing click event on add board
  it('should simulate a click event on add board input', () => {
    //set up a mockstore
    const store = mockStore({'boards': boards});
    //create instance of render and pass store to it
    let renderer = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <Boards.Container/>
      </Provider>
    );
    //get the input for boards
    let inputs = TestUtils.scryRenderedDOMComponentsWithTag(renderer, 'input');
    inputs.length.should.equal(7);
    //simulate button click
    TestUtils.Simulate.click(inputs[4]);
    //get all buttons on the page after button press
    let inputs2 = TestUtils.scryRenderedDOMComponentsWithTag(renderer, 'input');
    //check that previous input is there plus two inputs from create-items
    inputs2.length.should.equal(7);
    inputs2[5].value = 'happy';
    TestUtils.Simulate.change(inputs2[5]);
    TestUtils.Simulate.click(inputs2[6]);
  });
  //test for performing clic event on delete board
  it('should simulate a click event on delete board input', () => {
    //set up a mockstore
    const store = mockStore({'boards': boards});
    //create instance of render and pass store to it
    let renderer = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <Boards.Container/>
      </Provider>
    );
    //get the input for boards
    let inputs = TestUtils.scryRenderedDOMComponentsWithTag(renderer, 'input');
    inputs.length.should.equal(7);
    //simulate button click
    TestUtils.Simulate.click(inputs[1]);
  });
  it('should simulate a click event on edit board input', () => {
    //set up a mockstore
    const store = mockStore({'boards': boards});
    //create instance of render and pass store to it
    let renderer = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <Boards.Container/>
      </Provider>
    );
    //get the input for boards
    let inputs = TestUtils.scryRenderedDOMComponentsWithTag(renderer, 'input');
    inputs.length.should.equal(7);
    inputs[1].value = 'happy';
    TestUtils.Simulate.change(inputs[1]);
    //simulate button click
    TestUtils.Simulate.click(inputs[2]);
  });
});
