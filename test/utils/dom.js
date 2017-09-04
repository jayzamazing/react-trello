import jsdom from 'jsdom';

//setup document
let document = jsdom.jsdom('<!doctype html><html><body></body></html>');
//get window
let window = document.defaultView;
//set globals for mocha
global.document = document;
global.window = window;

let propagateToGlobal = (window) => {
  for (let key in window) {
    if (!window.hasOwnProperty(key)) {
      continue;
    }
    if (key in global) {
      continue;
    }
    global[key] = window[key];
  }
};
//pass properties of the window object to the global
propagateToGlobal(window);
