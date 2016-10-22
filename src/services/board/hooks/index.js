'use strict';

// const globalHooks = require('../../../hooks');
const hooks = require('feathers-hooks');
const populateCardsList = hooks.populate('cardsList', {
  service: 'cardslists'
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
  find: [populateCardsList],
  get: [populateCardsList],
  create: [],
  update: [],
  patch: [populateCardsList],
  remove: []
};
