'use strict';

const globalHooks = require('../../../hooks');
const hooks = require('feathers-hooks');
const populateCards = hooks.populate('cards', {
  service: 'cards',
  field: '_id'
});


exports.before = {
  all: [],
  find: [],
  get: [],
  create: [],
  update: [],
  patch: [],
  remove: []
};

exports.after = {
  all: [populateCards],
  find: [],
  get: [],
  create: [],
  update: [],
  patch: [],
  remove: []
};
