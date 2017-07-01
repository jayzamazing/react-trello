'use strict';
exports.DATABASE_URL = process.env.DATABASE_URL ||
                       global.DATABASE_URL ||
                      'mongodb://localhost/reactTrello';
exports.PORT = process.env.PORT || 8080;
exports.NODE_ENV = process.env.NODE_ENV || 'development';
