'use strict';

const globalHooks = require('../../../hooks');
const hooks = require('feathers-hooks');
const populateCardsList = hooks.populate('cardsList', {
  service: 'cardsList',
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
  all: [populateCardsList],
  find: [],
  get: [],
  create: [],
  update: [],
  patch: [],
  remove: []
};
