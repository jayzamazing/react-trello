'use strict';

// const globalHooks = require('../../../hooks');
const hooks = require('feathers-hooks');
const auth = require('feathers-authentication').hooks;
const populateCardsList = hooks.populate('cardsList', {
  service: 'cardslists'
});

exports.before = {
  all: [
    auth.restrictToAuthenticated()
  ],
  find: [],
  get: [
    auth.restrictToOwner({ ownerField: '_id' })
  ],
  create: [],
  update: [
    auth.restrictToOwner({ ownerField: '_id' })
  ],
  patch: [
    auth.restrictToOwner({ ownerField: '_id' })
  ],
  remove: [
    auth.restrictToOwner({ ownerField: '_id' })
  ]
};

exports.after = {
  all: [],
  find: [populateCardsList],
  get: [populateCardsList],
  create: [],
  update: [],
  patch: [populateCardsList],
  remove: [populateCardsList]
};
