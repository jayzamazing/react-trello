'use strict';

const service = require('feathers-mongoose');
const cardslist = require('./cardslist-model');
const hooks = require('./hooks');

module.exports = function() {
  const app = this;

  const options = {
    Model: cardslist,
    paginate: {
      default: 5,
      max: 25
    }
  };

  // Initialize our service with any options it requires
  app.use('/cardslists', service(options));

  // Get our initialize service to that we can bind hooks
  const cardslistService = app.service('/cardslists');

  // Set up our before hooks
  cardslistService.before(hooks.before);

  // Set up our after hooks
  cardslistService.after(hooks.after);
};
