'use strict';

const assert = require('assert');
const app = require('../../../src/app');

describe('cards-list service', function() {
  it('registered the cards-lists service', () => {
    assert.ok(app.service('cards-lists'));
  });
});
