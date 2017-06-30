//init app in browser using #app in html
import React from 'react';
import ReactDOM from 'react-dom';
import AppRoutes from './components/AppRoutes.js';
// import { Provider } from 'react-redux';
// <Provider store={store}></Provider>
window.onload = () => {
  ReactDOM.render(
      <Routes/>,
      document.getElementById('app')
    );
};
