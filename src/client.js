//init app in browser using #app in html
import React from 'react';
import ReactDOM from 'react-dom';
import Routes from './components/routes.js';
// import { Provider } from 'react-redux';

window.onload = () => {
  ReactDOM.render(
    // <Provider store={store}>
      <Routes>
    // </Provider>
    ,document.getElementById('app')
    );
};
