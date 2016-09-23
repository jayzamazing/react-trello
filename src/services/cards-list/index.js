'use strict';

const service = require('feathers-mongoose');
const cards-list = require('./cards-list-model');
const hooks = require('./hooks');

module.exports = function() {
  const app = this;

  const options = {
    Model: cards-list,
    paginate: {
      default: 5,
      max: 25
    }
  };

  // Initialize our service with any options it requires
  app.use('/cards-lists', service(options));

  // Get our initialize service to that we can bind hooks
  const cards-listService = app.service('/cards-lists');

  // Set up our before hooks
  cards-listService.before(hooks.before);

  // Set up our after hooks
  cards-listService.after(hooks.after);
};
