'use strict';

// const globalHooks = require('../../../hooks');
const hooks = require('feathers-hooks');
const populateCards = hooks.populate('cards', {
  service: 'cards'
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
  all: [],
  find: [populateCards],
  get: [populateCards],
  create: [],
  update: [populateCards],
  patch: [populateCards],
  remove: [populateCards]
};
