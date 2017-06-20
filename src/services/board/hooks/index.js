'use strict';

// const globalHooks = require('../../../hooks');
const hooks = require('feathers-hooks');
const auth = require('feathers-authentication').hooks;
const populateCardsList = hooks.populate('cardsList', {
  service: 'cardslists'
});

exports.before = {
  all: [],
  find: [
    auth.verifyToken(),
    auth.populateUser(),
    auth.restrictToAuthenticated()
  ],
  get: [
    auth.verifyToken(),
    auth.restrictToAuthenticated(),
    auth.populateUser(),
    auth.restrictToOwner({idField: '_id', ownerField: 'owner' })
  ],
  create: [
    auth.restrictToAuthenticated(),
    auth.verifyToken(),
    auth.populateUser(),
    auth.associateCurrentUser({ idField: '_id', as: 'owner' })
  ],
  update: [
    auth.verifyToken(),
    auth.restrictToAuthenticated(),
    auth.populateUser(),
    auth.associateCurrentUser({ idField: '_id', as: 'owner' }),
    auth.restrictToOwner({idField: '_id', ownerField: 'owner' })
  ],
  patch: [
    auth.verifyToken(),
    auth.restrictToAuthenticated(),
    auth.populateUser(),
    auth.associateCurrentUser({ idField: '_id', as: 'owner' }),
    auth.restrictToOwner({idField: '_id', ownerField: 'owner' })
  ],
  remove: [
    auth.verifyToken(),
    auth.restrictToAuthenticated(),
    auth.populateUser(),
    auth.restrictToOwner({idField: '_id', ownerField: 'owner' })
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
