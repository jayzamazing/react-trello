import React from 'react';
// var ReactDOM = require('react-dom');
// var Provider = require('react-redux').Provider;
import {Route} from 'react-router';
// var Router = router.Router;
// var Route = router.Route;
// var IndexRoute = router.IndexRoute;
// var NavBar1 = require('./components/navbar1');
// var NavBar2 = require('./components/navbar2');
// var Boards = require('./components/boards');
// var Cardslist = require('./components/cardslist');
// var store = require('./components/store');
import PageNotFound from './components/pagenotfound';
//render the data onto div with id app
// document.addEventListener('DOMContentLoaded', function() {
// ReactDOM.render
// <IndexRoute component={Boards.Container}/>
const routes = (
  <Route path="/">
    <Route path="boards"/>
    <Route path="*" component={PageNotFound}/>
  </Route>
);
export default routes;
