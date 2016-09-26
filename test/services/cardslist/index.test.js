'use strict';

const assert = require('assert');
const app = require('../../../src/app');

describe('cardslist service', function() {
  it('registered the cardslists service', () => {
    assert.ok(app.service('cardslists'));
  });
});
