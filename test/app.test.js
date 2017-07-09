'use strict';
const assert = require('assert');
const request = require('request');
import {runServer, closeServer} from '../src/app';

describe('index page test', function() {
  //setup
  before(() => {
    return runServer();
  });
  after(() => {
    return closeServer();
  });

  it('starts and shows the index page', function(done) {
    request('http://localhost:8080', function(err, res, body) {
      assert.ok(body.indexOf('<html lang="en">') !== -1);
      done(err);
    });
  });
});
