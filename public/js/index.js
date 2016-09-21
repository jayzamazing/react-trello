var React = require('react');
var ReactDOM = require('react-dom');
var Provider = require('react-redux').Provider;
var Board = require('./board');
var store = require('./store');
//render the data onto div with id app
document.addEventListener('DOMContentLoaded', function() {
    ReactDOM.render(
      <Provider store={store}>
        <Board />
      </Provider>,
      document.getElementById('app'));
});
