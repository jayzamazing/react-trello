'use strict';
import React from 'react';
import TestUtils from 'react-addons-test-utils';
import chai from 'chai';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import Boards from '../../../public/js/boards';
import deepEqual from 'chai-shallow-deep-equal';
import nock from 'nock';

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
    //create a mock server response
    nock('http://localhost:3030')
      .get('/boards')
      //send back reply to request
      .reply((uri, requestBody) => {
        //return response
        return [
          200, {
            body: boards
          }
        ];
      });
  });
  //tear down after tests are complete
  after(() => {
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
    let board = result.props;
    //test props for various values
    board.children[0][0].type.should.shallowDeepEqual('input');
    let board_item = board.children[0][0].props;
    board_item.id.should.equal(boards[1]._id);
    board_item.value.should.equal(boards[1].title);
    board_item = board.children[0][1].props;
    board_item.id.should.equal(boards[2]._id);
    board_item.value.should.equal(boards[2].title);
  });
  //test for performing click event on add board
  it('should simulate a click event on add board input', () => {
    //set up a mockstore
    const store = mockStore();
    //create instance of render and pass store to it
    let renderer = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <Boards.Container/>
      </Provider>
    );
    //get the input for boards
    let inputs = TestUtils.scryRenderedDOMComponentsWithTag(renderer, 'input');
    inputs.length.should.equal(1);
    //simulate button click
    TestUtils.Simulate.click(inputs[0]);
    //get all buttons on the page after button press
    let inputs2 = TestUtils.scryRenderedDOMComponentsWithTag(renderer, 'input');
    //check that previous input is there plus two inputs from create-items
    inputs2.length.should.equal(3);
  });
});
