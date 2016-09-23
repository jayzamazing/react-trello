'use strict';

const service = require('feathers-mongoose');
const card = require('./card-model');
const hooks = require('./hooks');

module.exports = function() {
  const app = this;

  const options = {
    Model: card,
    paginate: {
      default: 5,
      max: 25
    }
  };

  // Initialize our service with any options it requires
  app.use('/cards', service(options));

  // Get our initialize service to that we can bind hooks
  const cardService = app.service('/cards');

  // Set up our before hooks
  cardService.before(hooks.before);

  // Set up our after hooks
  cardService.after(hooks.after);
};
