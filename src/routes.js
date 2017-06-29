import React from 'react';
// var ReactDOM = require('react-dom');
// var Provider = require('react-redux').Provider;
import { Route, IndexRoute } from 'react-router';
// var Router = router.Router;
// var Route = router.Route;
// var IndexRoute = router.IndexRoute;
// var NavBar1 = require('./navbar1');
var NavBar2 = require('./components/navbar2');
// var Boards = require('./components/boards');
// var Cardslist = require('./components/cardslist');
// var store = require('./components/store');
import PageNotFound from './components/pagenotfound';
//render the data onto div with id app
// document.addEventListener('DOMContentLoaded', function() {
  // ReactDOM.render
  cost routes = (
      // <Provider store={store}>
          // <Router>
          <Route path='/' component={NavBar1}>
            //   //TODO
            // </Route>
            <Route path='boards' component={NavBar2}>
              // <IndexRoute component={Boards.Container}/>
              <Route path="*" component={PageNotFound}/>
              // <Route path='/:boardId/:boardName' component={Cardslist.Container} />
          </Route>
          // </Router>
      // </Provider>
// }
);
export default routes;
