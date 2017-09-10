'use strict';
import React from 'react';
import TestUtils from 'react-addons-test-utils';
import chai from 'chai';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import Boards from './boards';
import deepEqual from 'chai-shallow-deep-equal';
import nock from 'nock';
import {seedBoards2} from '../testutils/seeddata';

chai.use(deepEqual);
chai.should();
const middlewares = [ thunk ];
const mockStore = configureMockStore(middlewares);
let boards = {};
//testing for the boards class
describe('Boards component', () => {
  //setup before all tests
  beforeEach(() => {
    //mock server without sending any data back to get rid of warnings
    nock('http://localhost/')
    .get('/boards')
    .query(true)
    .reply(200)
    .delete(/\/boards\/([a-z0-9]+)/)
    .reply(204);
    boards = seedBoards2(3);
  });
  //tear down after tests are complete
  afterEach(() => {
    boards = {};
    nock.cleanAll();
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
    let keys = Object.keys(boards);
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
    span_input.props.children.props.value.should.equal(boards[keys[0]].title);
    board_list[0].props.children[1].type.should.equal('input');
    board_list[0].props.children[1].props.type.should.equal('button');
    board_list[0].props.children[1].props.value.should.equal('Delete Board');
    board_list[1].type.should.shallowDeepEqual('li');
    let span_input2 = board_list[1].props.children[0];
    span_input2.props.children.type.should.equal('input');
    span_input2.props.children.props.value.should.equal(boards[keys[1]].title);
    board_list[1].props.children[1].type.should.equal('input');
    board_list[1].props.children[1].props.type.should.equal('button');
    board_list[1].props.children[1].props.value.should.equal('Delete Board');
    board_list[1].props.children[2].type.should.equal('input');
    board_list[1].props.children[2].props.type.should.equal('button');
    board_list[1].props.children[2].props.value.should.equal('Edit Board');
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
    inputs.length.should.equal(10);
    //simulate button click
    TestUtils.Simulate.click(inputs[9]);
    //get all buttons on the page after button press
    let inputs2 = TestUtils.scryRenderedDOMComponentsWithTag(renderer, 'input');
    //check that previous input is there plus two inputs from create-items
    inputs2.length.should.equal(12);
    inputs2[7].value = 'happy';
    TestUtils.Simulate.change(inputs2[9]);
    TestUtils.Simulate.click(inputs2[8]);
  });
  //test for performing clic event on delete board
  it('should simulate a click event on delete board input', () => {//TODO continue from here
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
    inputs.length.should.equal(10);
    //simulate button click
    TestUtils.Simulate.click(inputs[7]);
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
    inputs.length.should.equal(10);
    //simulate button click
    TestUtils.Simulate.click(inputs[8]);
    inputs[3].value = 'happy';
    TestUtils.Simulate.change(inputs[5]);
    //simulate button click
    TestUtils.Simulate.keyDown(inputs[5], {key: 'Enter', keyCode: 13, which: 13});
  });
});
