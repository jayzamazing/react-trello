'use strict';

const assert = require('assert');
const app = require('../../../src/app');

describe('card service', function() {
  it('registered the cards service', () => {
    assert.ok(app.service('cards'));
  });
});
